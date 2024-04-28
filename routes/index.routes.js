const express = require('express');
const router = express.Router();
const auth = require('./auth.routes');
const identityCards = require('./identity-card.routes');
const currentLocations = require('./current-locations.routes');
const banks = require('./banks.routes');
const emergencyContacts = require('./emergency-contacts.routes');

router.use('/auth', auth);
router.use('/identity-card', identityCards);
router.use('/current-location', currentLocations);
router.use('/bank', banks);
router.use('/emergency-contacts', emergencyContacts);

module.exports = router;
