const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    err.statusCode = 400;
    err.message = message;
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'JSON Web Token is invalid, try again';
    err.statusCode = 400;
    err.message = message;
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'JSON Web Token is expired, try again';
    err.statusCode = 400;
    err.message = message;
  }

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err.statusCode = 400;
    err.message = message;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
