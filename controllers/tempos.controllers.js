const prisma = require('../libs/prisma.libs');

module.exports = {
  index: async (req, res) => {
    const tempos = await prisma.tempos.findMany();

    return res.status(200).json({
      status: true,
      message: 'OK',
      err: null,
      data: tempos,
    });
  },

  show: async (req, res) => {
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
  },

  input: async (req, res) => {
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
  },
};
