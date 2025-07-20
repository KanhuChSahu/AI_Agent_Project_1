/**
 * Error handling middleware
 */

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error('Error:', err.message);
  console.error(err.stack);

  // Set appropriate status code
  const statusCode = err.statusCode || 500;

  // Send error response
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    status: statusCode
  });
};

/**
 * Not found middleware
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Request logger middleware
 */
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
};

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message) {
    return new ApiError(message || 'Bad Request', 400);
  }

  static unauthorized(message) {
    return new ApiError(message || 'Unauthorized', 401);
  }

  static forbidden(message) {
    return new ApiError(message || 'Forbidden', 403);
  }

  static notFound(message) {
    return new ApiError(message || 'Not Found', 404);
  }

  static internal(message) {
    return new ApiError(message || 'Internal Server Error', 500);
  }
}

module.exports = {
  errorHandler,
  notFound,
  requestLogger,
  ApiError
};