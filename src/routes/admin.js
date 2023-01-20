const express = require("express");

const { signIn } = require("../controllers/admin/auth");
const { getDashboardDetails } = require("../controllers/admin/dashboard");
const { getAllOrders } = require("../controllers/admin/orders");
const { getAllProduct, addNewProduct, getInvDetails, updateProductRecord } = require("../controllers/admin/product");
const { getAllSupplier } = require("../controllers/admin/supplier");
const { validateInputs } = require("../middleware/validation");

const upload = require("../middleware/upload");
const verifyToken = require("../middleware/verifyToken");
const { uploadImage } = require("../controllers/admin/uploadImage");

const router = express.Router();

router.get('/dashboard', verifyToken, getDashboardDetails);
router.get('/product/all', verifyToken, getAllProduct);
router.get('/product/inventory/:id', verifyToken, getInvDetails);
router.get('/supplier/all', verifyToken, getAllSupplier);
router.get('/order/all', verifyToken, getAllOrders);

router.post('/auth/signin', validateInputs, signIn);
router.post('/product/addNew', verifyToken, addNewProduct);
router.post('/image/upload', verifyToken, upload.single('file'), uploadImage);

router.patch('/product/:id', updateProductRecord);

module.exports = router;    