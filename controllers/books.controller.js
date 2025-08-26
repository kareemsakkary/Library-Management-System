const bookService = require('../services/books.service');

exports.createBook = async (req, res, next) => {
  try {
    const { title, author, isbn, available_quantity, shelf_location } = req.body;
    const book = await bookService.createBook(title, author, isbn, available_quantity, shelf_location);
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, available_quantity, shelf_location } = req.body;
    const book = await bookService.updateBook(id, title, author, isbn, available_quantity, shelf_location);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await bookService.deleteBook(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await bookService.getAllBooks();
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

exports.searchBooks = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    const books = await bookService.searchBooks(query);
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};
