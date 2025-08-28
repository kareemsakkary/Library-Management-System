const { body, param, query, validationResult } = require('express-validator');
const { CustomError } = require('../utils/CustomError');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400, errors.array()));
  }
  next();
};

exports.validateBook = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('isbn').isISBN().withMessage('Invalid ISBN format'),
  body('available_quantity').isInt({ min: 0 }).withMessage('Available quantity must be a non-negative integer'),
  body('shelf_location').notEmpty().withMessage('Shelf location is required'),
  handleValidationErrors,
];

exports.validateBookUpdate = [
  param('id').isInt().withMessage('Book ID must be an integer'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().notEmpty().withMessage('Author cannot be empty'),
  body('isbn').optional().isISBN().withMessage('Invalid ISBN format'),
  body('available_quantity').optional().isInt({ min: 0 }).withMessage('Available quantity must be a non-negative integer'),
  body('shelf_location').optional().notEmpty().withMessage('Shelf location cannot be empty'),
  handleValidationErrors,
];

exports.validateBookSearch = [
  query('query').notEmpty().withMessage('Search query is required'),
  handleValidationErrors,
];

exports.validateBorrower = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  handleValidationErrors,
];

exports.validateBorrowerUpdate = [
  param('id').isInt().withMessage('Borrower ID must be an integer'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  handleValidationErrors,
];

exports.validateBorrow = [
  body('book_id').isInt().withMessage('Book ID must be an integer'),
  body('borrower_id').isInt().withMessage('Borrower ID must be an integer'),
  body('due_date').isISO8601().toDate().withMessage('Invalid due date format (YYYY-MM-DD)'),
  handleValidationErrors,
];

exports.validateReturn = [
  param('id').isInt().withMessage('Borrow record ID must be an integer'),
  handleValidationErrors,
];

exports.validateBorrowedBooks = [
  param('borrower_id').isInt().withMessage('Borrower ID must be an integer'),
  handleValidationErrors,
];
