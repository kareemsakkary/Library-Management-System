const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

async function addIndexes() {
  try {
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_books_title ON books (title);
      CREATE INDEX IF NOT EXISTS idx_books_author ON books (author);
      CREATE INDEX IF NOT EXISTS idx_books_isbn ON books (isbn);
      CREATE INDEX IF NOT EXISTS idx_borrowers_email ON borrowers (email);
      CREATE INDEX IF NOT EXISTS idx_borrow_records_book_id ON borrow_records (book_id);
      CREATE INDEX IF NOT EXISTS idx_borrow_records_borrower_id ON borrow_records (borrower_id);
      CREATE INDEX IF NOT EXISTS idx_borrow_records_due_date ON borrow_records (due_date);
    `);
    console.log('Database indexes created successfully or already exist.');
  } catch (err) {
    console.error('Error creating database indexes:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

addIndexes();
