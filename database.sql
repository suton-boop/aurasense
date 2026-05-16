-- Create Database
CREATE DATABASE IF NOT EXISTS aurasense;
USE aurasense;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    brand VARCHAR(100),
    variant VARCHAR(100),
    category VARCHAR(50),
    bottle_capacity INT,
    stock_ml DECIMAL(10, 2),
    image TEXT,
    note TEXT,
    prices TEXT -- JSON string
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    transaction_id VARCHAR(50),
    customer_name VARCHAR(100),
    shipping_type VARCHAR(50),
    shipping_cost DECIMAL(10, 2),
    payment_method VARCHAR(50),
    total_amount DECIMAL(10, 2),
    timestamp DATETIME,
    items JSON
);

-- Seed Data
INSERT IGNORE INTO products (id, brand, variant, category, bottle_capacity, stock_ml, image, note, prices) VALUES 
('MK001', 'Mykonos', 'My Ego', 'EDP', 100, 450.00, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&auto=format&fit=crop&q=60', 'Best Seller', '{"1": 15000, "2": 25000, "3": 35000, "5": 55000, "10": 100000}'),
('MK002', 'Mykonos', 'Royal Ispahan', 'EDP', 100, 300.00, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&auto=format&fit=crop&q=60', '', '{"1": 15000, "2": 25000, "3": 35000, "5": 55000, "10": 100000}'),
('ZM001', 'Zimaya', 'Rabab Purple', 'EDP', 100, 200.00, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&auto=format&fit=crop&q=60', 'Premium', '{"1": 18000, "2": 30000, "3": 42000, "5": 65000, "10": 120000}');
