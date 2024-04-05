const prisma = require('../libs/prisma.libs');
const path = require('path');
const imagekit = require('../libs/imagekit.libs');

module.exports = {
  index: async (req, res, next) => {
    try {
      const identityCard = await prisma.identityCards.findMany({ include: { users: true } });

      res.status(200).json({
        status: true,
        message: 'OK',
        err: null,
        data: identityCard,
      });
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    try {
      const identityCard = await prisma.identityCards.findUnique({
        where: { userId: req.user.id },
        include: { users: true },
      });

      res.status(200).json({
        status: true,
        message: 'OK',
        err: null,
        data: identityCard,
      });
    } catch (err) {
      next(err);
    }
  },

  input: async (req, res, next) => {
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
            data: null,
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

      res.status(201).json({
        status: true,
        message: 'Created',
        err: null,
        data: identityCard,
      });
    } catch (err) {
      next(err);
    }
  },

  // Update Identity Card
  update: async (req, res, next) => {
    try {
      const { identityCardId } = req.params;
      const { selfiePhoto, identityCardImage } = req.files;
      const requiredFiles = ['selfiePhoto', 'identityCardImage'];

      const { identityCardNumber, placeBirth, dateBirth, gender, village, subdistrict, regency, province, country, address, religion, maritalStatus, jobs, isVerified } = req.body;
      const requiredFields = ['identityCardNumber', 'placeBirth', 'dateBirth', 'gender', 'village', 'subdistrict', 'regency', 'province', 'country', 'address', 'religion', 'maritalStatus', 'jobs', 'isVerified'];

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

      if (isVerified !== 'true' && isVerified !== 'false') {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: `field isVerified not boolean`,
          data: null,
        });
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

      // Get identity card
      const identityCardExist = await prisma.identityCards.findUnique({ where: { id: Number(identityCardId) } });
      if (!identityCardExist) {
        return res.status(404).json({
          status: false,
          message: 'Not Found',
          err: null,
          data: null,
        });
      }

      // Delete photo in imagekit by file id
      imagekit.deleteFile(identityCardExist.selfiePhotoId, function (error, result) {
        if (error) {
          return res.status(400).json({
            status: false,
            message: 'Crash Imagekit',
            err: error,
            data: null,
          });
        }
      });

      imagekit.deleteFile(identityCardExist.identityCardImageId, function (error, result) {
        if (error) {
          return res.status(400).json({
            status: false,
            message: 'Crash Imagekit',
            err: error,
            data: null,
          });
        }
      });

      // Handle image selfie photo
      const strSelfiePhoto = selfiePhoto[0].buffer.toString('base64');
      const { url: selfiePhotoUrl, fileId: selfiePhotoFileId } = await imagekit.upload({
        fileName: Date.now() + path.extname(selfiePhoto[0].originalname),
        file: strSelfiePhoto,
      });

      // Handle image identity card
      const strIdentityCardImage = identityCardImage[0].buffer.toString('base64');
      const { url: identityCardImageUrl, fileId: identityCardImageFileId } = await imagekit.upload({
        fileName: Date.now() + path.extname(identityCardImage[0].originalname),
        file: strIdentityCardImage,
      });

      // Update identity card in database by identity card id
      const identityCard = await prisma.identityCards.update({
        where: {
          id: Number(identityCardId),
        },
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
          isVerified,
        },
      });

      res.status(200).json({
        status: true,
        message: 'Update identity card successful',
        err: null,
        data: identityCard,
      });
    } catch (err) {
      next(err);
    }
  },

  // Delete Identity Card
  delet: async (req, res, next) => {
    try {
      const { identityCardId } = req.params;

      // Get identity card
      const identityCardExist = await prisma.identityCards.findUnique({ where: { id: Number(identityCardId) } });
      if (!identityCardExist) {
        return res.status(404).json({
          status: false,
          message: 'Not Found',
          err: null,
          data: null,
        });
      }

      // Delete photo in imagekit by file id
      imagekit.deleteFile(identityCardExist.selfiePhotoId, function (error, result) {
        if (error) {
          return res.status(400).json({
            status: false,
            message: 'Crash Imagekit',
            err: error,
            data: null,
          });
        }
      });

      imagekit.deleteFile(identityCardExist.identityCardImageId, function (error, result) {
        if (error) {
          return res.status(400).json({
            status: false,
            message: 'Crash Imagekit',
            err: error,
            data: null,
          });
        }
      });

      // delete identity card in database by id
      await prisma.identityCards.delete({ where: { id: Number(identityCardId) } });

      res.status(200).json({
        status: true,
        message: 'Delete identity card successful',
        err: null,
        data: null,
      });
    } catch (err) {
      next(err);
    }
  },
};
