const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});


const pool = mysql.createPool({
  host: 'localhost',
  user: 'u122685751_aurasense',
  password: '@Talita31102014#',
  database: 'u122685751_aurasense',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Auth Endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
      const user = rows[0];
      res.json({ success: true, user: { username: user.username, role: user.role } });
    } else {
      res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  // Create Product
  app.post('/api/products', async (req, res) => {
    const { id, brand, variant, category, bottle_capacity, stock_ml, image, note, prices, capital_price, barcode, aroma_category } = req.body;
    try {
      const [result] = await pool.query(
        `INSERT INTO products (id, brand, variant, category, bottle_capacity, stock_ml, image, note, prices, capital_price, barcode, aroma_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id || 'PRD' + Date.now().toString().slice(-4), brand, variant, category, bottle_capacity, stock_ml, image, note, JSON.stringify(prices), capital_price, barcode, aroma_category]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update Product
  app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { brand, variant, category, bottle_capacity, stock_ml, image, note, prices, capital_price, barcode, aroma_category } = req.body;
    try {
      await pool.query(
        `UPDATE products SET brand = ?, variant = ?, category = ?, bottle_capacity = ?, stock_ml = ?, image = ?, note = ?, prices = ?, capital_price = ?, barcode = ?, aroma_category = ? WHERE id = ?`,
        [brand, variant, category, bottle_capacity, stock_ml, image, note, JSON.stringify(prices), capital_price, barcode, aroma_category, id]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete Product
  app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM products WHERE id = ?', [id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows.map(p => ({ ...p, prices: typeof p.prices === 'string' ? JSON.parse(p.prices) : p.prices })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM transactions');
    res.json(rows.map(t => ({ ...t, items: typeof t.items === 'string' ? JSON.parse(t.items) : t.items })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  const transaction = req.body;
  const id = Date.now().toString();
  const transaction_id = 'TRX' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const timestamp = new Date();

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    await connection.query(
      `INSERT INTO transactions (id, transaction_id, customer_name, shipping_type, shipping_cost, payment_method, total_amount, timestamp, items)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        transaction_id,
        transaction.customer_name,
        transaction.shipping_type,
        transaction.shipping_cost,
        transaction.payment_method,
        transaction.total_amount,
        timestamp,
        JSON.stringify(transaction.items)
      ]
    );

    for (const item of transaction.items) {
      await connection.query(
        'UPDATE products SET stock_ml = stock_ml - ? WHERE id = ?',
        [item.quantity * item.selected_size, item.id]
      );
      await connection.query(
        'UPDATE supplies SET stock_qty = stock_qty - ? WHERE type = "botol" AND size_ml = ?',
        [item.quantity, item.selected_size]
      );
    }

    await connection.query('UPDATE supplies SET stock_qty = GREATEST(0, stock_qty - 1) WHERE id IN ("SUP_PLSTK", "SUP_STIKER")');

    await connection.commit();
    res.json({ success: true, transaction_id });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ success: false, error: err.message });
  } finally {
    connection.release();
  }
});

// Supplies
app.get('/api/supplies', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM supplies');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/supplies/:id', async (req, res) => {
  try {
    await pool.query('UPDATE supplies SET stock_qty = ? WHERE id = ?', [req.body.stock_qty, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  const { category, amount, description } = req.body;
  const id = 'EXP' + Date.now();
  try {
    await pool.query('INSERT INTO expenses (id, date, category, amount, description) VALUES (?, NOW(), ?, ?, ?)', [id, category, amount, description]);
    // If it's a supply purchase, also add to stock!
    if (req.body.supply_id && req.body.supply_qty) {
      await pool.query('UPDATE supplies SET stock_qty = stock_qty + ? WHERE id = ?', [req.body.supply_qty, req.body.supply_id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port} (MySQL)`);
});
