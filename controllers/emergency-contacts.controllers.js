const prisma = require('../libs/prisma.libs');

module.exports = {
  index: async (req, res) => {
    const emergencyNumber = await prisma.emergecyContacts.findMany();

    res.status(200).json({
      status: true,
      message: 'Get emergencys number successfull',
      err: null,
      data: emergencyNumber,
    });
  },

  show: async (req, res) => {
    const emergencyNumber = await prisma.emergecyContacts.findMany({ where: { userId: req.user.id } });

    res.status(200).json({
      status: true,
      message: 'Get emergency number successfull',
      err: null,
      data: emergencyNumber,
    });
  },

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

  update: async (req, res) => {
    const { contactId } = req.params;
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

    const contactExist = await prisma.emergecyContacts.findUnique({ where: { id: Number(contactId) } });
    if (!contactExist) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Contact does not exist',
        data: null,
      });
    }

    const emergencyNumber = await prisma.emergecyContacts.update({
      where: { id: Number(contactId) },
      data: {
        number,
        fullName,
        relation,
      },
    });

    res.status(200).json({
      status: true,
      message: 'Update emergency contact successfull',
      err: null,
      data: emergencyNumber,
    });
  },
};
