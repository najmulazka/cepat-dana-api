const express = require('express');
const router = express.Router();
const { restrict } = require('../middlewares/restrict.middlewares');
const { admin } = require('../middlewares/admin.middlewares');
const { input, update } = require('../controllers/identity-cards.controllers');
const { image } = require('../libs/multer.libs');

router.post(
  '/input',
  restrict,
  image.fields([
    { name: 'selfiePhoto', maxCount: 1 },
    { name: 'identityCardImage', maxCount: 1 },
  ]),
  input
);

router.put(
  '/update/:identityCardId',
  admin,
  image.fields([
    { name: 'selfiePhoto', maxCount: 1 },
    { name: 'identityCardImage', maxCount: 1 },
  ]),
  update
);

module.exports = router;
