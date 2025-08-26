const { expect } = require('chai');
const sinon = require('sinon');
const bookService = require('../../services/books.service');
const db = require('../../db');

describe('Book Service', () => {
  let dbQueryStub;

  beforeEach(() => {
    // Stub db.query before each test to prevent actual database calls
    dbQueryStub = sinon.stub(db, 'query');
  });

  afterEach(() => {
    // Restore the original db.query after each test
    dbQueryStub.restore();
  });

  describe('createBook', () => {
    it('should create a new book and return it', async () => {
      const newBook = {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890123',
        available_quantity: 5,
        shelf_location: 'A1',
      };
      dbQueryStub.returns({
        rows: [newBook]
      });

      const result = await bookService.createBook('Test Book', 'Test Author', '1234567890123', 5, 'A1');

      expect(dbQueryStub.calledOnce).to.be.true;
      expect(dbQueryStub.firstCall.args[0]).to.include('INSERT INTO books');
      expect(result).to.deep.equal(newBook);
    });
  });

  describe('updateBook', () => {
    it('should update an existing book and return it', async () => {
      const updatedBook = {
        id: 1,
        title: 'Updated Book',
        author: 'Test Author',
        isbn: '1234567890123',
        available_quantity: 7,
        shelf_location: 'A1',
      };
      dbQueryStub.returns({
        rows: [updatedBook]
      });

      const result = await bookService.updateBook(1, 'Updated Book', 'Test Author', '1234567890123', 7, 'A1');

      expect(dbQueryStub.calledOnce).to.be.true;
      expect(dbQueryStub.firstCall.args[0]).to.include('UPDATE books');
      expect(result).to.deep.equal(updatedBook);
    });

    it('should return undefined if book not found', async () => {
      dbQueryStub.returns({
        rows: []
      });

      const result = await bookService.updateBook(999, 'Non Existent', 'Author', '123', 1, 'B1');

      expect(dbQueryStub.calledOnce).to.be.true;
      expect(result).to.be.undefined;
    });
  });

  describe('deleteBook', () => {
    it('should delete a book and return true if successful', async () => {
      dbQueryStub.returns({
        rowCount: 1
      });

      const result = await bookService.deleteBook(1);

      expect(dbQueryStub.calledOnce).to.be.true;
      expect(dbQueryStub.firstCall.args[0]).to.include('DELETE FROM books');
      expect(result).to.be.true;
    });

    it('should return false if book not found', async () => {
      dbQueryStub.returns({
        rowCount: 0
      });

      const result = await bookService.deleteBook(999);

      expect(dbQueryStub.calledOnce).to.be.true;
      expect(result).to.be.false;
    });
  });

  describe('getAllBooks', () => {
    it('should return all books', async () => {
      const books = [{
        id: 1,
        title: 'Book 1'
      }, {
        id: 2,
        title: 'Book 2'
      }];
      dbQueryStub.returns({
        rows: books
      });

      const result = await bookService.getAllBooks();

      expect(dbQueryStub.calledOnce).to.be.true;
      expect(dbQueryStub.firstCall.args[0]).to.include('SELECT * FROM books');
      expect(result).to.deep.equal(books);
    });
  });

  describe('searchBooks', () => {
    it('should return books matching the query', async () => {
      const searchResult = [{
        id: 1,
        title: 'Searched Book',
        author: 'Test Author'
      }];
      dbQueryStub.returns({
        rows: searchResult
      });

      const result = await bookService.searchBooks('Searched');

      expect(dbQueryStub.calledOnce).to.be.true;
      expect(dbQueryStub.firstCall.args[0]).to.include('SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $1 OR isbn ILIKE $1');
      expect(dbQueryStub.firstCall.args[1][0]).to.equal('%Searched%');
      expect(result).to.deep.equal(searchResult);
    });
  });
});
