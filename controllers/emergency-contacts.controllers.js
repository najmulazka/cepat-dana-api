const prisma = require('../libs/prisma.libs');

module.exports = {
  input: async (req, res) => {
    const { number, fullName, relation } = req.body;
    const requiredFields = ['number', 'fullName', 'relation'];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: `Field ${field} is required`,
        });
      }
    }

    const emergencyNumber = await prisma.emergecyContacts.create({
      data: {
        number,
        fullName,
        relation,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      status: true,
      message: 'Created',
      err: null,
      data: emergencyNumber,
    });
  },
};
