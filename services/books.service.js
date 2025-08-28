const db = require('../db');
const { CustomError } = require('../utils/CustomError');

exports.createBook = async (title, author, isbn, available_quantity, shelf_location) => {
  const { rows } = await db.query(
    'INSERT INTO books (title, author, isbn, available_quantity, shelf_location) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
    [title, author, isbn, available_quantity, shelf_location]
  );
  return rows[0];
};

exports.updateBook = async (id, title, author, isbn, available_quantity, shelf_location) => {
  const fields = {};
  if (title !== undefined) fields.title = title;
  if (author !== undefined) fields.author = author;
  if (isbn !== undefined) fields.isbn = isbn;
  if (available_quantity !== undefined) fields.available_quantity = available_quantity;
  if (shelf_location !== undefined) fields.shelf_location = shelf_location;

  const keys = Object.keys(fields);
  if (keys.length === 0) {
    const { rows } = await db.query('SELECT * FROM books WHERE id = $1;', [id]);
    if (rows.length === 0) {
      throw new CustomError('Book not found', 404);
    }
    return rows[0];
  }

  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
  const values = Object.values(fields);

  const { rows } = await db.query(
    `UPDATE books SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING *;`,
    [...values, id]
  );
  if (rows.length === 0) {
    throw new CustomError('Book not found', 404);
  }
  return rows[0];
};

exports.deleteBook = async (id) => {
  const { rowCount } = await db.query('DELETE FROM books WHERE id = $1;', [id]);
  if (rowCount === 0) {
    throw new CustomError('Book not found', 404);
  }
  return true;
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
