const prisma = require('../libs/prisma.libs');

module.exports = {
  index: async (req, res) => {
    const currentLocations = await prisma.currentLocations.findMany();

    res.status(200).json({
      status: true,
      message: 'OK',
      err: null,
      data: currentLocations,
    });
  },

  show: async (req, res, next) => {
    const currentLocation = await prisma.currentLocations.findUnique({
      where: { id: req.user.id },
      include: { users: true },
    });

    if (!currentLocation) {
      return res.status(400).json({
        status: true,
        message: 'Current location does not exist',
        err: null,
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: 'OK',
      err: null,
      data: currentLocation,
    });
  },
};
