const express = require('express');
const { input, index, show } = require('../controllers/emergency-contacts.controllers');
const { restrict } = require('../middlewares/restrict.middlewares');
const { admin } = require('../middlewares/admin.middlewares');
const router = express.Router();

router.get('/', admin, index);
router.get('/show', restrict, show);
router.post('/input', restrict, input);

module.exports = router;
