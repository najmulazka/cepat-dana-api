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
};
