const express = require('express');
const router = express.Router();
const { index, show, input, update, delet } = require('../controllers/banks.controllers');
const { restrict } = require('../middlewares/restrict.middlewares');
const { admin } = require('../middlewares/admin.middlewares');

router.get('/', admin, index);
router.get('/show', restrict, show);
router.post('/input', restrict, input);
router.put('/update/:bankId', admin, update);
router.delete('/delete/:bankId', admin, delet);

module.exports = router;
