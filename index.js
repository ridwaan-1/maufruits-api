const express = require("express");
const cors = require('cors');

const productRoutes = require("./src/routes/product");
const addressRoutes = require("./src/routes/address");
const authRoutes = require("./src/routes/auth");
const checkoutRoutes = require("./src/routes/checkout");
const adminRoutes = require("./src/routes/admin");
const { stripeWebhookHandler } = require("./src/controllers/checkout");
const contactUsFunction = require("./src/controllers/mail");


const app = express();
app.use(cors());
app.use('/images', express.static('images'));

app.use(express.json({
    verify: function (req, res, buf) {
        var url = req.originalUrl;
        if (url.startsWith('/stripe_webhook')) {
            req.rawBody = buf.toString();
        }
    }
}));
app.use(express.urlencoded({ extended: true }));

app.use('/api/product', productRoutes);
app.use('/api/user/auth', authRoutes);
app.use('/api/userAddress', addressRoutes);
app.use('/api/checkout', checkoutRoutes);

app.use('/api/admin', adminRoutes);

app.post('/api/contact/sendmail', contactUsFunction);
app.post('/stripe_webhook', express.raw({ type: '*/*' }), stripeWebhookHandler);

app.listen(process.env.PORT || 8080);
