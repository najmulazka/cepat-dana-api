const prisma = require('../libs/prisma.libs');
const path = require('path');
const imagekit = require('../libs/imagekit.libs');
const { validation } = require('../libs/validation.libs');

module.exports = {
  create: async (req, res, next) => {
    try {
      const { selfiePhoto, identityCardImage } = req.files;
      const requiredFiles = ['selfiePhoto', 'identityCardImage'];

      const { identityCardNumber, placeBirth, dateBirth, gender, village, subdistrict, regency, province, country, address, religion, maritalStatus, jobs } = req.body;
      const requiredFields = ['identityCardNumber', 'placeBirth', 'dateBirth', 'gender', 'village', 'subdistrict', 'regency', 'province', 'country', 'address', 'religion', 'maritalStatus', 'jobs'];

      // Check req.body
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({
            status: false,
            message: 'Bad Request',
            err: `field ${field} is required`,
          });
        }
      }

      // Check req.files
      for (const file of requiredFiles) {
        if (!req.files[file]) {
          return res.status(400).json({
            status: false,
            message: 'Bad Request',
            err: `file ${file} is required`,
          });
        }
      }

      // handle image selfie
      const strSelfiePhoto = selfiePhoto[0].buffer.toString('base64');
      const { url: selfiePhotoUrl, fileId: selfiePhotoFileId } = await imagekit.upload({
        fileName: Date.now() + path.extname(selfiePhoto[0].originalname),
        file: strSelfiePhoto,
      });

      // handle image identity card
      const strIdentityCardImage = identityCardImage[0].buffer.toString('base64');
      const { url: identityCardImageUrl, fileId: identityCardImageFileId } = await imagekit.upload({
        fileName: Date.now() + path.extname(identityCardImage[0].originalname),
        file: strIdentityCardImage,
      });

      // Save identity card to database by user id
      const identityCard = await prisma.identityCards.create({
        data: {
          selfiePhoto: selfiePhotoUrl,
          selfiePhotoId: selfiePhotoFileId,
          identityCardImage: identityCardImageUrl,
          identityCardImageId: identityCardImageFileId,
          identityCardNumber,
          placeBirth,
          dateBirth: new Date(dateBirth),
          gender,
          village,
          subdistrict,
          regency,
          province,
          country,
          address,
          religion,
          maritalStatus,
          jobs,
          userId: req.user.id,
        },
      });

      res.status(200).json({
        status: true,
        message: 'Created',
        err: null,
        data: identityCard,
      });
    } catch (err) {
      next(err);
    }
  },
};
