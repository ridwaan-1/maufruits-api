const Stripe = require("stripe");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;