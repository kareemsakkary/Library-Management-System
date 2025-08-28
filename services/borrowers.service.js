const db = require('../db');
const { CustomError } = require('../utils/CustomError');

exports.createBorrower = async (name, email) => {
  const { rows } = await db.query(
    'INSERT INTO borrowers (name, email) VALUES ($1, $2) RETURNING *;',
    [name, email]
  );
  return rows[0];
};

exports.updateBorrower = async (id, name, email) => {
  const fields = {};
  if (name !== undefined) fields.name = name;
  if (email !== undefined) fields.email = email;

  const keys = Object.keys(fields);
  if (keys.length === 0) {
    // No fields to update, return the existing borrower or throw an error
    const { rows } = await db.query('SELECT * FROM borrowers WHERE id = $1;', [id]);
    if (rows.length === 0) {
      throw new CustomError('Borrower not found', 404);
    }
    return rows[0];
  }

  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
  const values = Object.values(fields);

  const { rows } = await db.query(
    `UPDATE borrowers SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING *;`,
    [...values, id]
  );
  if (rows.length === 0) {
    throw new CustomError('Borrower not found', 404);
  }
  return rows[0];
};

exports.deleteBorrower = async (id) => {
  const { rowCount } = await db.query('DELETE FROM borrowers WHERE id = $1;', [id]);
  if (rowCount === 0) {
    throw new CustomError('Borrower not found', 404);
  }
  return true;
};

exports.getAllBorrowers = async () => {
  const { rows } = await db.query('SELECT * FROM borrowers;');
  return rows;
};
