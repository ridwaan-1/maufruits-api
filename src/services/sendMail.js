const nodemailer = require("nodemailer");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const sendMail = async (config) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.STORE_EMAIL,
            pass: process.env.STORE_EMAIL_PASS
        }
    });
    
    await transporter.sendMail(config);
}

module.exports = sendMail;