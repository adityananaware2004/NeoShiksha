// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments")
const { authenticate, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
router.post("/capturePayment", authenticate, isStudent, capturePayment)
router.post("/verifyPayment",authenticate, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", authenticate, isStudent, sendPaymentSuccessEmail);

// router.get("/purchaseHistory", authenticate, isStudent, purchaseHistory);

module.exports = router