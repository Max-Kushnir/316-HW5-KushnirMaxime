const { validationResult } = require('express-validator');

/**
 * Middleware to validate request data using express-validator
 * Returns 400 with first error message if validation fails
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({
      success: false,
      error: firstError.msg
    });
  }

  next();
};

module.exports = validateRequest;
