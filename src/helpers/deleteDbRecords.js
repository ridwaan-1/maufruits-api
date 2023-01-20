const { sqlQueryExecutor, sqlTransactionExecutor } = require("../services/queyExecutor");

const deleteDbRecords = async (id) => {
    const cartItems = await sqlQueryExecutor(`SELECT cart.product_id, cart.quantity
                                        FROM cart, order_details, stripe_payment
                                        WHERE order_details.id = stripe_payment.id
                                        AND stripe_payment.paymentId = '${id}'
                                        AND order_details.cart_id = cart.id;`);

    sqlTransactionExecutor(async (conn) => {
        for(const item of cartItems) {
            await conn.query(`UPDATE product 
                            SET numInStock = numInStock + ${item.quantity}
                            WHERE id=${item.product_id};`);
        };

        await conn.query(`DELETE stripe_payment, order_details, cart
                        FROM (stripe_payment JOIN order_details ON stripe_payment.id = order_details.id)
                        JOIN cart ON cart.id = order_details.cart_id
                        WHERE stripe_payment.paymentId = '${id}';`)
    });
};

module.exports = deleteDbRecords;