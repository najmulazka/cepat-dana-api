const express = require('express');
const { input, show, index } = require('../controllers/tempos.controllers');
const { admin } = require('../middlewares/admin.middlewares');
const router = express.Router();

router.get('/', admin, index);
router.get('/show/:temposId', admin, show);
router.post('/input', admin, input);

module.exports = router;