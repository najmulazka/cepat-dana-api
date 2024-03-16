module.exports = {
  notFound: (req, res) => {
    return res.status(404).json({
      status: false,
      message: 'Not Found',
      err: 'Resource not found',
      data: null,
    });
  },

  serverError: (err, req, res, next) => {
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      err: err.message,
      data: null,
    });
  },
};
