const sendMail = require("../services/sendMail");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const contactUsFunction = async (req, res) => {
    try {
        await sendMail({
            from: req.body.email,
            to: process.env.STORE_EMAIL,
            subject: req.body.subject,
            text: `User mail: ${req.body.email}\n${req.body.message}`
        });
        
        res.status(200).json({
            status: true,
            message: 'Thanks for contacting us, we will get back to you as soon as possible.'
        })
    } catch(err) {
        return res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    } 
}

module.exports = contactUsFunction;  