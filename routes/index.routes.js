const express = require('express');
const router = express.Router();
const auth = require('./auth.routes');
const identityCards = require('./identity-card.routes');

router.use('/auth', auth);
router.use('/identity-card', identityCards);

module.exports = router;
