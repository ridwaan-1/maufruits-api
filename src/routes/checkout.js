const express = require("express");
const { 
    placeOrder, 
    processPayment } = require("../controllers/checkout");
const checkItemAvailability = require("../middleware/checkItemAvailability");
const { validateShippingForm } = require("../middleware/validation");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post('/placeOrder', verifyToken, checkItemAvailability, placeOrder);
router.post('/payment', verifyToken, validateShippingForm, checkItemAvailability, processPayment);

module.exports = router;    