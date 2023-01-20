const express = require("express");
const { signIn, signUp } = require("../controllers/auth");
const { validateInputs } = require("../middleware/validation");

const router = express.Router();

router.post('/signin', validateInputs, signIn);
router.post('/signup', signUp);


module.exports = router;    