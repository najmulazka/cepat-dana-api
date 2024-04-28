const express = require('express');
const { input } = require('../controllers/emergency-contacts.controllers');
const { restrict } = require('../middlewares/restrict.middlewares');
const router = express.Router();

router.post('/input', restrict, input);

module.exports = router;
