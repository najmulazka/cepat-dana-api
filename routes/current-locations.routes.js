const express = require('express');
const router = express.Router();
const { restrict } = require('../middlewares/restrict.middlewares');
const { admin } = require('../middlewares/admin.middlewares');
const { index, show, input, update } = require('../controllers/current-locations.controllers');

router.get('/', admin, index);
router.get('/show', restrict, show);
router.post('/input', restrict, input);
router.put('/update/:currentLocationId', admin, update);

module.exports = router;
