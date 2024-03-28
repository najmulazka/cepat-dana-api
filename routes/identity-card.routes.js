const express = require('express');
const router = express.Router();
const { restrict } = require('../middlewares/restrict.middlewares');
const { create } = require('../controllers/identity-cards.controllers');
const { image } = require('../libs/multer.libs');

router.post(
  '/create',
  restrict,
  image.fields([
    { name: 'selfiePhoto', maxCount: 1 },
    { name: 'identityCardImage', maxCount: 1 },
  ]),
  create
);

module.exports = router;
