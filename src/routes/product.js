const express = require("express");
const { getAllProduct, getPopularProduct, getRecentProduct, getHomepageProduct } = require("../controllers/product.js");

const router = express.Router();

router.get('/homepage', getHomepageProduct)
router.get('/all', getAllProduct);
router.get('/popular', getPopularProduct);
router.get('/new', getRecentProduct);

module.exports = router;