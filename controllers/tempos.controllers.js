const prisma = require('../libs/prisma.libs');

module.exports = {
  index: async (req, res, next) => {
    try {
      const tempos = await prisma.tempos.findMany();

      return res.status(200).json({
        status: true,
        message: 'OK',
        err: null,
        data: tempos,
      });
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    try {
      const { temposId } = req.params;
      const tempos = await prisma.tempos.findUnique({ where: { id: Number(temposId) } });

      if (!tempos) {
        return res.status(404).json({
          status: false,
          message: 'Not Found',
          err: 'Resource Not Found',
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Get tempos successful',
        err: null,
        data: tempos,
      });
    } catch (err) {
      next(err);
    }
  },

  input: async (req, res, next) => {
    try {
      const { timePeriod, interest } = req.body;
      const requiredFields = ['timePeriod', 'interest'];

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

      const tempos = await prisma.tempos.create({
        data: {
          timePeriod,
          interest,
        },
      });

      return res.status(200).json({
        status: true,
        message: 'Created',
        err: null,
        data: tempos,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { temposId } = req.params;
      const { timePeriod, interest } = req.body;
      const requiredFields = ['timePeriod', 'interest'];

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

      const existTempo = await prisma.tempos.findUnique({ where: { id: Number(temposId) } });

      if (!existTempo) {
        return res.status(404).json({
          status: false,
          message: 'Not Found',
          err: 'Resource Not Found',
          data: null,
        });
      }

      const tempos = await prisma.tempos.update({
        where: {
          id: Number(temposId),
        },
        data: {
          timePeriod,
          interest: Number(interest),
        },
      });

      res.status(200).json({
        status: true,
        message: 'Update tempo successful',
        err: null,
        data: tempos,
      });
    } catch (err) {
      next(err);
    }
  },

  delet: async (req, res, next) => {
    try {
      const { temposId } = req.params;

      const existTempo = await prisma.tempos.findUnique({ where: { id: Number(temposId) } });

      if (!existTempo) {
        return res.status(404).json({
          status: false,
          message: 'Not Found',
          err: 'Resource Not Found',
          data: null,
        });
      }

      await prisma.tempos.delete({ where: { id: Number(temposId) } });

      res.status(200).json({
        status: true,
        message: 'Delete tempo successful',
        err: null,
        data: null,
      });
    } catch (err) {
      next(err);
    }
  },
};
