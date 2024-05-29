const express = require('express');
const { input } = require('../controllers/tempos.controllers');
const { admin } = require('../middlewares/admin.middlewares');
const router = express.Router();

router.post('/input', admin, input)

module.exports = router