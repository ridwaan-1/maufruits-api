const express = require("express");
const { getUserAddress, postUserAddress } = require("../controllers/address.js");
const verifyToken = require("../middleware/verifyToken.js");

const router = express.Router();

router.get('/', verifyToken, getUserAddress);
router.post('/', verifyToken, postUserAddress);

module.exports = router;    