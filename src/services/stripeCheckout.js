const stripe = require('../config/stripe.js');

const stripeCheckout = async ({
    email,
    cart
}, discount, shipping) => {
    const customer_email = email ? {
        customer_email: email
    } : {};

    let discounts = [];
    if (discount !== 0) {
        const coupon = await stripe.coupons.create({
            currency: "MUR",
            amount_off: 5000,
            duration: 'once'
        });
        discounts.push({
            coupon: coupon.id
        });
    }

    let shipping_options = [];
    if(shipping>0) shipping_options.push({
        shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
                amount: 150 * 100,
                currency: 'mur',
            },
            display_name: 'MauFruits Delivery'
        }
    });

    const line_items = cart.map((item) => ({
        price_data: {
            currency: "MUR",
            product_data: {
                name: item.name,
                images: [item.imgPath],
            },
            unit_amount: item.sellingPrice * 100,
        },
        quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        ...customer_email,
        shipping_options,
        discounts,
        expires_at: Math.round(Date.now() / 1000) + 3600,
        success_url: `${process.env.CLIENT_URL}/MauFruits/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/MauFruits/checkout-fail`,
    });

    return {
        sessionUrl: session.url,
        paymentId: session.payment_intent,
        paymentStatus: session.payment_status
    };
}

module.exports = stripeCheckout;