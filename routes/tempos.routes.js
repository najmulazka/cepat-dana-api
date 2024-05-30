const express = require('express');
const { input, show, index, update } = require('../controllers/tempos.controllers');
const { admin } = require('../middlewares/admin.middlewares');
const router = express.Router();

router.get('/', admin, index);
router.get('/show/:temposId', admin, show);
router.post('/input', admin, input);
router.put('/update/:temposId', admin, update);

module.exports = router;
