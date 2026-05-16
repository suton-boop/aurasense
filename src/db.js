const API_URL = 'http://localhost:3001/api';

export const db = {
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return await response.json();
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, message: 'Server error' };
    }
  },
  getProducts: async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      return await response.json();
    } catch (err) {
      console.error('Failed to fetch products:', err);
      return [];
    }
  },
  getTransactions: async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`);
      return await response.json();
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      return [];
    }
  },
  saveTransaction: async (transaction) => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      });
      return await response.json();
    } catch (err) {
      console.error('Failed to save transaction:', err);
      return { success: false };
    }
  },
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      return await response.json();
    } catch (err) {
      console.error('Failed to upload image:', err);
      return { error: 'Failed to upload' };
    }
  },
  createProduct: async (product) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      return await response.json();
    } catch (err) {
      console.error('Failed to create product:', err);
      return { success: false };
    }
  },
  updateProduct: async (id, product) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      return await response.json();
    } catch (err) {
      console.error('Failed to update product:', err);
      return { success: false };
    }
  },
  deleteProduct: async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (err) {
      console.error('Failed to delete product:', err);
      return { success: false };
    }
  },
  getSupplies: async () => {
    try {
      const response = await fetch(`${API_URL}/supplies`);
      return await response.json();
    } catch (err) {
      console.error('Failed to fetch supplies:', err);
      return [];
    }
  },
  getExpenses: async () => {
    try {
      const response = await fetch(`${API_URL}/expenses`);
      return await response.json();
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
      return [];
    }
  },
  addExpense: async (expense) => {
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      });
      return await response.json();
    } catch (err) {
      console.error('Failed to add expense:', err);
      return { success: false };
    }
  },
  updateSupply: async (id, stock_qty) => {
    try {
      const response = await fetch(`${API_URL}/supplies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_qty })
      });
      return await response.json();
    } catch (err) {
      console.error('Failed to update supply:', err);
      return { success: false };
    }
  }
};
