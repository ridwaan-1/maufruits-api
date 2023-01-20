const { sqlQueryExecutor, sqlTransactionExecutor } = require("../services/queyExecutor.js");
const deleteDbRecords = require("../helpers/deleteDbRecords.js");
const stripeCheckout = require('../services/stripeCheckout');
const stripe = require('../config/stripe.js');
const sendMail = require('../services/sendMail.js');


exports.placeOrder = async (req, res) => {
    try {
        const {
            deliveryOption,
            cart
        } = req.body;
        const totalPrice = req.totalPrice;

        let shipping = 0;
        if(deliveryOption==='delivery') {
            shipping = 100;
        } 

        const response = await sqlQueryExecutor(`SELECT COUNT(user_id) AS totalPurchase FROM order_details 
                                                WHERE user_id=${req.userId} AND orderStatus='delivered';`)
        let discount = {
            discount: 0
        }
        if(response[0].totalPurchase===1) {
            discount = {
                discount: 50,
                discountMsg: 'Congratulations, You won Rs50 discount for your first purchase'
            }
        }

        res.status(200).json({
            basketTotal: totalPrice,
            ...discount,
            shipping
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
};

exports.processPayment = async (req, res) => {
    const { address, deliveryOption, paymentOption, cart } = req.body;
    const totalPrice = req.totalPrice;
    let orderDetails = {};
    try {
        const [cartResponse, ] = await sqlQueryExecutor(`SELECT COUNT(user_id) AS totalPurchase FROM order_details 
                                                WHERE user_id=${req.userId};`)
        const discount = cartResponse.totalPurchase===1 ? 50 : 0;
        sqlTransactionExecutor(async (dbConnection) => {
            const response = await dbConnection.query('SELECT MAX(id) + 1 AS cart_id FROM cart');
            const cart_id = response[0][0].cart_id;
            for(const item of cart) {
                await dbConnection.query(`UPDATE product 
                                        SET numInStock = numInStock - ${item.qty}
                                        WHERE id=${item.id};`);
                await dbConnection.query(`INSERT INTO cart VALUES (${cart_id}, ${item.id}, ${item.qty})`);
            };
            
            [orderDetails, ] = await dbConnection.query(`INSERT INTO order_details(totalPrice, discount, paymentType, deliveryMethod, user_id, cart_id, address_id) 
                                    VALUES (${totalPrice}, ${discount}, '${paymentOption}', '${deliveryOption}', ${req.userId}, ${cart_id}, ${address || 'NULL'});`);
        });
        
        if (paymentOption === 'card') {
            let shippingCost = 0;
            if(deliveryOption==='delivery') shippingCost = 150;
            const { sessionUrl, paymentId, paymentStatus } = await stripeCheckout(req.body, discount, shippingCost);
            await sqlQueryExecutor(`INSERT INTO stripe_payment 
                                    VALUES (${orderDetails.insertId}, '${paymentId}', '${paymentStatus}')`);
            return res.status(200).json({
                status: true,   
                sessionUrl 
            });
        };
    
        return res.status(200).json({
            status: true,
            successUrl: `${process.env.CLIENT_URL}/checkout-success`
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
}

exports.stripeWebhookHandler = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SK);
    } catch (err) {
        return res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            await sqlQueryExecutor(`UPDATE stripe_payment, order_details
                                    SET stripe_payment.paymentStatus = 'paid', 
                                        order_details.orderStatus='payment received'
                                    WHERE stripe_payment.id = order_details.id
                                    AND stripe_payment.paymentId = '${event.data.object.id}'
                                    AND stripe_payment.paymentStatus = 'unpaid';`);
            break;

        case 'payment_intent.payment_failed':
            deleteDbRecords(event.data.object.id)
            break;
       
        case 'payment_intent.canceled':
            deleteDbRecords(event.data.object.id)
            break;

        case 'checkout.session.expired':
            deleteDbRecords(event.data.object.id)
            break;
    }

    res.status(200).json({
        status: true
    });
}