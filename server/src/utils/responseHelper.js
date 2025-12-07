/**
 * Send a successful response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {*} data - Response data
 * @param {String} message - Success message
 */
const sendSuccess = (res, statusCode, data, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} error - Error message
 */
const sendError = (res, statusCode, error) => {
  res.status(statusCode).json({
    success: false,
    error
  });
};

module.exports = {
  sendSuccess,
  sendError
};
