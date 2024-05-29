const prisma = require('../libs/prisma.libs');

module.exports = {
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
