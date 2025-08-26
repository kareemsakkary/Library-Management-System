const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('Attempting to connect with DB_DATABASE:', process.env.DB_DATABASE);
console.log('Attempting to connect with DB_USER:', process.env.DB_USER);
console.log('Attempting to connect with DATABASE_URL:', process.env.DATABASE_URL);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        isbn VARCHAR(20) UNIQUE NOT NULL,
        available_quantity INT NOT NULL DEFAULT 0,
        shelf_location VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS borrowers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        registered_date DATE NOT NULL DEFAULT CURRENT_DATE
      );

      CREATE TABLE IF NOT EXISTS borrow_records (
        id SERIAL PRIMARY KEY,
        book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        borrower_id INT NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
        borrow_date DATE NOT NULL DEFAULT CURRENT_DATE,
        due_date DATE NOT NULL,
        return_date DATE
      );
    `);
    console.log('Database tables created successfully or already exist.');
  } catch (err) {
    console.error('Error creating database tables:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDb();
