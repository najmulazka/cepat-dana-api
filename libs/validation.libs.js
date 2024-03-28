module.exports = {
  validation: (value, res) => {
    if (!value) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: `${value} is required`,
      });
    }
  },
};
