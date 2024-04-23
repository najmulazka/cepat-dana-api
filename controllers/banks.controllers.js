const prisma = require('../libs/prisma.libs');

module.exports = {
  index: async (req, res, next) => {
    try {
      const banks = await prisma.banks.findMany({ include: { users: true } });

      res.status(200).json({
        status: true,
        message: 'Created',
        err: null,
        data: banks,
      });
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    try {
      const bank = await prisma.banks.findUnique({ where: { userId: req.user.id } }, { include: { users: true } });

      res.status(200).json({
        status: true,
        message: 'OK',
        err: null,
        data: bank,
      });
    } catch (err) {
      next(err);
    }
  },

  input: async (req, res, next) => {
    try {
      const { typeBank, cardNumber, cardName } = req.body;
      const requiredFields = ['typeBank', 'cardNumber', 'cardName'];

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

      const bank = await prisma.banks.create({
        data: {
          typeBank,
          cardNumber,
          cardName,
          userId: req.user.id,
        },
      });

      res.status(201).json({
        status: true,
        message: 'Created',
        err: null,
        data: bank,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { bankId } = req.params;
      const { typeBank, cardNumber, cardName } = req.body;
      const requiredFields = ['typeBank', 'cardNumber', 'cardName'];

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

      const bankExist = await prisma.banks.findUnique({ where: { id: Number(bankId) } });
      if (!bankExist) {
        return res.status(404).json({
          status: false,
          message: 'Not Found',
          err: 'Resource not found',
          data: null,
        });
      }

      const bank = await prisma.banks.update({
        where: { id: Number(bankId) },
        data: {
          typeBank,
          cardNumber,
          cardName,
        },
      });

      res.status(200).json({
        status: true,
        message: 'Update bank successful',
        err: null,
        data: bank,
      });
    } catch (err) {
      next(err);
    }
  },

  delet: async (req, res, next) => {
    try {
      const { bankId } = req.params;
      const bankExist = await prisma.banks.findUnique({ where: { id: Number(bankId) } });
      if (!bankExist) {
        return res.status(404).json({
          status: false,
          message: 'Not Found',
          err: 'Resource not found',
          data: null,
        });
      }

      await prisma.banks.delete({ where: { id: Number(bankId) } });
      res.status(200).json({
        status: true,
        message: 'Delete banks successful',
        err: null,
        data: null,
      });
    } catch (err) {
      next(err);
    }
  },
};
