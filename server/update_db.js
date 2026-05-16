const mysql = require('mysql2/promise');

async function updateDB() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aurasense',
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id VARCHAR(50) PRIMARY KEY,
        date DATETIME,
        category VARCHAR(50),
        amount DECIMAL(10,2),
        description TEXT
      )
    `);
    console.log('Expenses table created or checked.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS supplies (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100),
        type VARCHAR(50),
        size_ml INT NULL,
        stock_qty INT DEFAULT 0,
        min_stock INT DEFAULT 10
      )
    `);
    console.log('Supplies table created or checked.');

    // Pre-seed supplies if empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM supplies');
    if (rows[0].count === 0) {
      await pool.query(`INSERT INTO supplies (id, name, type, size_ml, stock_qty, min_stock) VALUES 
        ('SUP1', 'Botol Decant 1ml', 'botol', 1, 0, 20),
        ('SUP2', 'Botol Decant 2ml', 'botol', 2, 0, 20),
        ('SUP3', 'Botol Decant 3ml', 'botol', 3, 0, 20),
        ('SUP5', 'Botol Decant 5ml', 'botol', 5, 0, 20),
        ('SUP10', 'Botol Decant 10ml', 'botol', 10, 0, 20),
        ('SUP_PLSTK', 'Plastik Packing', 'plastik', NULL, 0, 50),
        ('SUP_STIKER', 'Stiker Logo', 'stiker', NULL, 0, 50)
      `);
      console.log('Pre-seeded default supplies.');
    }

  } catch (err) {
    console.error('Error updating DB:', err);
  } finally {
    process.exit(0);
  }
}

updateDB();
