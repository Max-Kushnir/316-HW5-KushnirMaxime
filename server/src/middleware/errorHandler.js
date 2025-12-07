/**
 * Custom application error class
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log errors in development mode
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      statusCode: statusCode
    });
  }

  // Handle PostgreSQL unique constraint violation
  if (err.code === '23505') {
    statusCode = 409;
    message = 'Resource already exists';
  }

  // Handle PostgreSQL foreign key violation
  if (err.code === '23503') {
    statusCode = 400;
    message = 'Invalid reference to related resource';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = {
  AppError,
  errorHandler
};
