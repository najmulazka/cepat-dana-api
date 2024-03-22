const express = require('express');
const router = express.Router();
const { register, resendOtp, activationCode, forrgotPassword, verifyOtpPassword, resetPassword, login, whoiam } = require('../controllers/auth.controllers');
const { restrict } = require('../middlewares/restrict.middlewares');

router.post('/register', register);

router.post('/resend-otp', resendOtp);
router.post('/activation-code', activationCode);

router.post('/forrgot-password', forrgotPassword);
router.post('/verify-otp-password', verifyOtpPassword);
router.post('/reset-password', resetPassword);

router.post('/login', login);

// test who i am
router.get('/whoiam', restrict, whoiam);

module.exports = router;
