const express = require('express');
const router = express.Router();
const { register, resendOtp, activationCode, login, whoiam } = require('../controllers/auth.controllers');
const { restrict } = require('../middlewares/restrict.middlewares');

router.post('/register', register);
router.post('/resendOtp', resendOtp);
router.post('/activationCode', activationCode);
router.post('/login', login);

// test who i am
router.get('/whoiam', restrict, whoiam);

module.exports = router;
