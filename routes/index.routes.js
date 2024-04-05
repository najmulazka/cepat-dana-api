const express = require('express');
const router = express.Router();
const auth = require('./auth.routes');
const identityCards = require('./identity-card.routes');
const currentLocations = require('./current-locations.routes');

router.use('/auth', auth);
router.use('/identity-card', identityCards);
router.use('/current-location', currentLocations);

module.exports = router;
