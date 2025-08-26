const db = require('../db');

exports.checkoutBook = async (book_id, borrower_id, due_date) => {
  // Check if book is available
  const bookResult = await db.query('SELECT available_quantity FROM books WHERE id = $1;', [book_id]);
  if (bookResult.rows.length === 0 || bookResult.rows[0].available_quantity === 0) {
    throw new Error('Book not available or does not exist.');
  }

  // Create borrow record
  const { rows } = await db.query(
    'INSERT INTO borrow_records (book_id, borrower_id, due_date) VALUES ($1, $2, $3) RETURNING *;',
    [book_id, borrower_id, due_date]
  );

  // Decrease available quantity of book
  await db.query('UPDATE books SET available_quantity = available_quantity - 1 WHERE id = $1;', [book_id]);

  return rows[0];
};

exports.returnBook = async (record_id) => {
  // Get borrow record
  const recordResult = await db.query('SELECT book_id, return_date FROM borrow_records WHERE id = $1;', [record_id]);
  if (recordResult.rows.length === 0) {
    throw new Error('Borrow record not found.');
  }
  if (recordResult.rows[0].return_date !== null) {
    throw new Error('Book already returned.');
  }

  const book_id = recordResult.rows[0].book_id;

  // Update return date
  const { rows } = await db.query(
    'UPDATE borrow_records SET return_date = CURRENT_DATE WHERE id = $1 RETURNING *;',
    [record_id]
  );

  // Increase available quantity of book
  await db.query('UPDATE books SET available_quantity = available_quantity + 1 WHERE id = $1;', [book_id]);

  return rows[0];
};

exports.getBorrowedBooks = async (borrower_id) => {
  const { rows } = await db.query(
    'SELECT br.*, b.title, b.author FROM borrow_records br JOIN books b ON br.book_id = b.id WHERE br.borrower_id = $1 AND br.return_date IS NULL;',
    [borrower_id]
  );
  return rows;
};

exports.getOverdueBooks = async () => {
  const { rows } = await db.query(
    'SELECT br.*, b.title, b.author, bor.name as borrower_name, bor.email as borrower_email FROM borrow_records br JOIN books b ON br.book_id = b.id JOIN borrowers bor ON br.borrower_id = bor.id WHERE br.return_date IS NULL AND br.due_date < CURRENT_DATE;',
  );
  return rows;
};
