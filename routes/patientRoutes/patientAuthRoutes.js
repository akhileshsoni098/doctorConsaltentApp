const express = require('express');
const { register, verifyEmail, resendOTP, loginUser, forgetpassword, resetPassword, changePassword } = require('../../controllers/patientControllers/patientAuthController');

const router = express.Router();

router.route('/register').post(register)

router.route('/verification').post(verifyEmail)

router.route('/resendOtp').post(resendOTP)

router.route('/logIn').post(loginUser)

router.route('/forgotPassword').post(forgetpassword)

router.route('/resetPassword').post(resetPassword)

// changePassword testing remains do this later after authentication

module.exports = router
