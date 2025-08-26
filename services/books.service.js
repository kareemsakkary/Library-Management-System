const db = require('../db');

exports.createBook = async (title, author, isbn, available_quantity, shelf_location) => {
  const { rows } = await db.query(
    'INSERT INTO books (title, author, isbn, available_quantity, shelf_location) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
    [title, author, isbn, available_quantity, shelf_location]
  );
  return rows[0];
};

exports.updateBook = async (id, title, author, isbn, available_quantity, shelf_location) => {
  const { rows } = await db.query(
    'UPDATE books SET title = $1, author = $2, isbn = $3, available_quantity = $4, shelf_location = $5 WHERE id = $6 RETURNING *;',
    [title, author, isbn, available_quantity, shelf_location, id]
  );
  return rows[0];
};

exports.deleteBook = async (id) => {
  const { rowCount } = await db.query('DELETE FROM books WHERE id = $1;', [id]);
  return rowCount > 0;
};

exports.getAllBooks = async () => {
  const { rows } = await db.query('SELECT * FROM books;');
  return rows;
};

exports.searchBooks = async (query) => {
  const { rows } = await db.query(
    'SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $1 OR isbn ILIKE $1;',
    [`%${query}%`]
  );
  return rows;
};
