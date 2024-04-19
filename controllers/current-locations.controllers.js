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
      where: { userId: req.user.id },
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

  input: async (req, res, next) => {
    const { village, subdistrict, regency, province, country, address } = req.body;
    const requiredFields = ['village', 'subdistrict', 'regency', 'province', 'country', 'address'];

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

    const currentLocationExist = await prisma.currentLocations.findUnique({ where: { userId: req.user.id } });

    if (currentLocationExist) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'current location already exist',
        data: null,
      });
    }

    const currentLocation = await prisma.currentLocations.create({
      data: {
        village,
        subdistrict,
        regency,
        province,
        country,
        address,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      status: true,
      message: 'OK',
      err: null,
      data: currentLocation,
    });
  },

  update: async (req, res, next) => {
    const { currentLocationId } = req.params;
    const { village, subdistrict, regency, province, country, address } = req.body;
    const requiredFields = ['village', 'subdistrict', 'regency', 'province', 'country', 'address'];

    // Check req.params
    if (!currentLocationId) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: `field is required`,
        data: null,
      });
    }

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

    const currentLocationExist = await prisma.currentLocations.findUnique({ where: { id: Number(currentLocationId) } });

    if (!currentLocationExist) {
      return res.status(404).json({
        status: false,
        message: 'Bad Request',
        err: 'Resource not found',
        data: null,
      });
    }

    const currentLocation = await prisma.currentLocations.update({
      where: { id: Number(currentLocationId) },
      data: {
        village,
        subdistrict,
        regency,
        province,
        country,
        address,
      },
    });

    res.status(200).json({
      status: true,
      message: 'Update current location successful',
      err: null,
      data: currentLocation,
    });
  },

  delet: async (req, res, next) => {
    const { currentLocationId } = req.params;

    // Check req.params
    if (!currentLocationId) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: `field is required`,
        data: null,
      });
    }

    const currentLocationExist = await prisma.currentLocations.findUnique({ where: { id: Number(currentLocationId) } });

    if (!currentLocationExist) {
      return res.status(400).json({
        status: false,
        message: 'Not Found',
        err: 'Resource not found',
        data: null,
      });
    }

    const currentLocation = await prisma.currentLocations.delete({
      where: { id: Number(currentLocationId) },
    });

    res.status(200).json({
      status: true,
      message: 'Delete current location successful',
      err: null,
      data: null,
    });
  },
};
