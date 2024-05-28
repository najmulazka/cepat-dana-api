const express = require('express');
const { input, index, show, update, delet } = require('../controllers/emergency-contacts.controllers');
const { restrict } = require('../middlewares/restrict.middlewares');
const { admin } = require('../middlewares/admin.middlewares');
const router = express.Router();

router.get('/', admin, index);
router.get('/show', restrict, show);
router.post('/input', restrict, input);
router.put('/update/:contactId', admin, update);
router.delete('/delete/:contactId', admin, delet);

module.exports = router;
