const rateLimit = require('express-rate-limit');

exports.createBookRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, 
  message: 'Too many book creation requests from this IP, please try again after 15 minutes',
});

exports.createBorrowerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: 'Too many borrower registration requests from this IP, please try again after 15 minutes',
});
