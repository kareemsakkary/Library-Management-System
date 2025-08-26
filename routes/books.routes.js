const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books.controller');
const { validateBook, validateBookUpdate, validateBookSearch } = require('../middlewares/validation');
const { createBookRateLimiter } = require('../middlewares/rateLimiter');
const { authMiddleware } = require('../middlewares/basicAuth');

router.post('/', authMiddleware, createBookRateLimiter, validateBook, booksController.createBook);
router.put('/:id', authMiddleware, validateBookUpdate, booksController.updateBook);
router.delete('/:id', authMiddleware, booksController.deleteBook);
router.get('/', booksController.getAllBooks);
router.get('/search', validateBookSearch, booksController.searchBooks);

module.exports = router;
