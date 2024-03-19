const jwt = require('jsonwebtoken');
const prisma = require('../libs/prisma.libs');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  restrict: async (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        err: 'Missing token on header',
        data: null,
      });
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
          err: err.message,
          data: null,
        });
      }

      req.user = await prisma.users.findUnique({ where: { email: decoded.email } });
      if (!req.user) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'User does not exist',
          data: null,
        });
      }

      next();
    });
  },
};
