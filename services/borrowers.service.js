const db = require('../db');

exports.createBorrower = async (name, email) => {
  const { rows } = await db.query(
    'INSERT INTO borrowers (name, email) VALUES ($1, $2) RETURNING *;',
    [name, email]
  );
  return rows[0];
};

exports.updateBorrower = async (id, name, email) => {
  const { rows } = await db.query(
    'UPDATE borrowers SET name = $1, email = $2 WHERE id = $3 RETURNING *;',
    [name, email, id]
  );
  return rows[0];
};

exports.deleteBorrower = async (id) => {
  const { rowCount } = await db.query('DELETE FROM borrowers WHERE id = $1;', [id]);
  return rowCount > 0;
};

exports.getAllBorrowers = async () => {
  const { rows } = await db.query('SELECT * FROM borrowers;');
  return rows;
};
