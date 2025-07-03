const express = require('express');
const router = express.Router();

const {resetPasswordToken, resetPassword} = require('../controllers/ResetPassword')

const {
    login,
    signUp, 
    sendOTP,
    changePassword,
} = require('../controllers/Auth')

const {authenticate} = require('../middlewares/auth')

// routes for login, signup, and authentication

// ************************************************************************************
//                        Authentication routes
// ************************************************************************************

// route for user login
router.post('/login', login);

// route for user signup
router.post('/signup', signUp);

// route for sending otp to the users email
router.post('/sendotp', sendOTP);

// route for changing password
router.post('/changepassword', authenticate, changePassword);


// **************************************************************************************
//                          Reset password routes
// **************************************************************************************

// route for generating reset password token
router.post('/reset-password-token', resetPasswordToken);

// route for resetting user's password after verification
router.post('/reset-password', resetPassword);

// export the router
module.exports = router;