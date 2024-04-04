const express = require('express');
const router = express.Router();
const { restrict } = require('../middlewares/restrict.middlewares');
const { admin } = require('../middlewares/admin.middlewares');
const { index, input, update, delet } = require('../controllers/identity-cards.controllers');
const { image } = require('../libs/multer.libs');

router.get('/', admin, index);
router.get('/show', restrict, index);
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
router.delete('/delete/:identityCardId', admin, delet);

module.exports = router;
