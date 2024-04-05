const express = require('express');
const router = express.Router();
const { restrict } = require('../middlewares/restrict.middlewares');
const { admin } = require('../middlewares/admin.middlewares');
const { index, show} = require('../controllers/current-locations.controllers');

router.get('/', admin, index);
router.get('/show', restrict, show);

module.exports = router;
