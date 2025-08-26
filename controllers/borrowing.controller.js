const borrowingService = require('../services/borrowing.service');

exports.checkoutBook = async (req, res, next) => {
  try {
    const { book_id, borrower_id, due_date } = req.body;
    const record = await borrowingService.checkoutBook(book_id, borrower_id, due_date);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};

exports.returnBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await borrowingService.returnBook(id);
    res.status(200).json(record);
  } catch (err) {
    next(err);
  }
};

exports.getBorrowedBooks = async (req, res, next) => {
  try {
    const { borrower_id } = req.params;
    const records = await borrowingService.getBorrowedBooks(borrower_id);
    res.status(200).json(records);
  } catch (err) {
    next(err);
  }
};

exports.getOverdueBooks = async (req, res, next) => {
  try {
    const records = await borrowingService.getOverdueBooks();
    res.status(200).json(records);
  } catch (err) {
    next(err);
  }
};
