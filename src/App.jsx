import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Plus, 
  Trash2, 
  Printer, 
  Edit,
  ChevronRight,
  CreditCard,
  Wallet,
  Banknote,
  Truck,
  LogOut,
  User,
  Users,
  Lock,
  Inbox,
  Database,
  Menu,
  ArrowLeft,
  Download
} from 'lucide-react';
import PublicStore from './PublicStore';

// --- Components ---

const Login = ({ onLogin, onBackToStore }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await db.login(username, password);
    if (result.success) {
      onLogin(result.user);
    } else {
      setError(result.message || 'Login gagal');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-12 w-full max-w-md text-center relative"
      >
        <button 
          onClick={onBackToStore}
          className="absolute top-6 left-6 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
          title="Kembali ke Toko"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="mb-8 mt-4">
          <img src="/logo aurasense.png" alt="Logo" className="w-20 h-20 mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-bold gold-text">AURASENSE</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-2">Admin Portal Login</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Username</label>
            <div className="relative mt-2">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="text-left">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn btn-primary justify-center py-4 text-lg mt-4 disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Masuk Sekarang'}
          </button>
        </form>

        <p className="mt-8 text-[10px] text-slate-600 uppercase tracking-widest">
          &copy; 2026 Aurasense Parfums
        </p>
      </motion.div>
    </div>
  );
};
import { motion, AnimatePresence } from 'framer-motion';
import { db } from './db';

// --- Print Invoice Utility ---
export const printInvoice = (invoice) => {
  const printWindow = window.open('', '_blank');
  
  const itemsHtml = invoice.items.map(item => `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px dashed #ccc;">
        <div><strong>${item.variant}</strong></div>
        <div style="font-size: 10px; color: #666;">${item.brand} • ${item.selected_size}ml</div>
      </td>
      <td style="padding: 8px 0; border-bottom: 1px dashed #ccc; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px 0; border-bottom: 1px dashed #ccc; text-align: right;">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</td>
    </tr>
  `).join('');

  const html = `
    <html>
      <head>
        <title>Invoice - ${invoice.transaction_id}</title>
        <style>
          body { font-family: 'Courier New', Courier, monospace; color: #000; margin: 0; padding: 20px; font-size: 12px; }
          .container { width: 100%; max-width: 300px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
          .header h1 { margin: 0; font-size: 20px; font-weight: bold; }
          .header p { margin: 2px 0; }
          .details { margin-bottom: 20px; }
          .details div { display: flex; justify-content: space-between; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { text-align: left; padding-bottom: 8px; border-bottom: 2px dashed #000; font-weight: bold; }
          .totals { border-top: 2px dashed #000; padding-top: 10px; }
          .totals div { display: flex; justify-content: space-between; margin-bottom: 4px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; font-size: 10px; border-top: 1px dashed #000; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AURASENSE</h1>
            <p>Decant Parfum Premium</p>
          </div>
          <div class="details">
            <div><span>ID:</span> <span>${invoice.transaction_id}</span></div>
            <div><span>Tgl:</span> <span>${new Date(invoice.timestamp).toLocaleString('id-ID')}</span></div>
            <div><span>Pelanggan:</span> <span>${invoice.customer_name || '-'}</span></div>
            <div><span>Metode:</span> <span>${invoice.payment_method}</span></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="totals">
            <div><span>Ongkir (${invoice.shipping_type || '-'})</span> <span>Rp ${Number(invoice.shipping_cost || 0).toLocaleString('id-ID')}</span></div>
            <div style="font-size: 14px; margin-top: 8px;"><span>TOTAL</span> <span>Rp ${Number(invoice.total_amount).toLocaleString('id-ID')}</span></div>
          </div>
          <div class="footer">
            <p>Terima kasih atas belanja Anda!</p>
            <p>@aurasense.id</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
};

export const downloadInvoiceImage = (invoice) => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 800 + (invoice.items.length * 50);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Text settings
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AURASENSE', 200, 40);
  
  ctx.font = '14px monospace';
  ctx.fillText('Decant Parfum Premium', 200, 60);
  
  // Dotted line
  ctx.fillText('--------------------------------------', 200, 80);

  // Details
  ctx.textAlign = 'left';
  ctx.font = '14px monospace';
  ctx.fillText(`ID       : ${invoice.transaction_id}`, 20, 110);
  ctx.fillText(`Tanggal  : ${new Date(invoice.timestamp).toLocaleString('id-ID')}`, 20, 130);
  ctx.fillText(`Pelanggan: ${invoice.customer_name}`, 20, 150);
  ctx.fillText(`Metode   : ${invoice.payment_method}`, 20, 170);

  ctx.textAlign = 'center';
  ctx.fillText('--------------------------------------', 200, 190);

  // Items
  ctx.textAlign = 'left';
  ctx.fillText('Item', 20, 210);
  ctx.textAlign = 'center';
  ctx.fillText('Qty', 260, 210);
  ctx.textAlign = 'right';
  ctx.fillText('Subtotal', 380, 210);

  ctx.textAlign = 'center';
  ctx.fillText('--------------------------------------', 200, 230);

  let y = 250;
  invoice.items.forEach(item => {
    ctx.textAlign = 'left';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`${item.variant}`, 20, y);
    ctx.font = '12px monospace';
    ctx.fillStyle = '#666666';
    ctx.fillText(`${item.brand} • ${item.selected_size}ml`, 20, y + 15);
    
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.font = '14px monospace';
    ctx.fillText(`${item.quantity}`, 260, y + 8);
    
    ctx.textAlign = 'right';
    ctx.fillText(`Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`, 380, y + 8);
    
    y += 40;
  });

  ctx.textAlign = 'center';
  ctx.fillText('--------------------------------------', 200, y);
  y += 20;

  // Totals
  ctx.textAlign = 'left';
  ctx.fillText(`Ongkir (${invoice.shipping_type || '-'})`, 20, y);
  ctx.textAlign = 'right';
  ctx.fillText(`Rp ${Number(invoice.shipping_cost || 0).toLocaleString('id-ID')}`, 380, y);
  
  y += 30;
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`TOTAL`, 20, y);
  ctx.textAlign = 'right';
  ctx.fillText(`Rp ${Number(invoice.total_amount).toLocaleString('id-ID')}`, 380, y);

  y += 20;
  ctx.textAlign = 'center';
  ctx.font = '14px monospace';
  ctx.fillText('--------------------------------------', 200, y);

  y += 30;
  ctx.fillText('Terima kasih atas pesanan Anda!', 200, y);
  y += 20;
  ctx.fillText('@aurasense.id', 200, y);

  // Resize canvas to exact height
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = 400;
  finalCanvas.height = y + 30;
  const fCtx = finalCanvas.getContext('2d');
  fCtx.drawImage(canvas, 0, 0);

  // Download logic
  const link = document.createElement('a');
  link.download = `Invoice_Aurasense_${invoice.transaction_id}.png`;
  link.href = finalCanvas.toDataURL('image/png');
  link.click();
};

// --- Helper Components ---
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '16px', 
      padding: '12px 16px', 
      margin: '0 0 8px 0', 
      cursor: 'pointer',
      borderRadius: '12px',
      background: active ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
      borderRight: active ? '2px solid #fbbf24' : 'none',
      color: active ? '#fbbf24' : '#94a3b8',
      transition: 'all 0.3s ease'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', flexShrink: 0, margin: 0, padding: 0 }}>
      <Icon size={20} color={active ? '#fbbf24' : '#94a3b8'} />
    </div>
    <span style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, padding: 0 }}>{label}</span>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`glass p-6 ${className}`}>
    {children}
  </div>
);

// --- Main Pages ---

const Dashboard = ({ products, transactions, supplies }) => {
  const [showAllStock, setShowAllStock] = useState(false);

  const totalSales = transactions.reduce((acc, curr) => acc + Number(curr.total_amount), 0);
  const totalTransactions = transactions.length;
  
  const lowStockProducts = products.filter(p => p.stock_ml < 20).map(p => ({ ...p, type: 'product' }));
  const lowStockSupplies = supplies ? supplies.filter(s => s.stock_qty <= s.min_stock).map(s => ({ ...s, type: 'supply' })) : [];
  
  const allLowStockItems = [...lowStockProducts, ...lowStockSupplies];
  const lowStock = allLowStockItems.length;
  const displayedLowStock = showAllStock ? allLowStockItems : allLowStockItems.slice(0, 5);

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-8 gold-text">Aurasense Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm">Total Penjualan</span>
            <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500"><BarChart3 size={20} /></div>
          </div>
          <h2 className="text-2xl font-bold text-white">Rp {totalSales.toLocaleString('id-ID')}</h2>
        </Card>
        <Card>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm">Total Transaksi</span>
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500"><ShoppingCart size={20} /></div>
          </div>
          <h2 className="text-2xl font-bold text-white">{totalTransactions}</h2>
        </Card>
        <Card>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm">Stok Menipis</span>
            <div className="bg-red-500/10 p-2 rounded-lg text-red-500"><Package size={20} /></div>
          </div>
          <h2 className="text-2xl font-bold text-white">{lowStock} <span className="text-sm font-normal text-slate-400">Items</span></h2>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold mb-4">Penjualan Terakhir</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-3 text-left text-slate-400">ID Transaksi</th>
                <th className="p-3 text-left text-slate-400">Pelanggan</th>
                <th className="p-3 text-left text-slate-400">Total</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice().reverse().slice(0, 5).map(t => (
                <tr key={t.id} className="border-t border-slate-700/50">
                  <td className="p-3 text-sm text-slate-200">{t.transaction_id}</td>
                  <td className="p-3 text-sm text-white font-medium">{t.customer_name}</td>
                  <td className="p-3 text-sm text-amber-400 font-bold">Rp {Number(t.total_amount).toLocaleString('id-ID')}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr><td colSpan="3" className="p-4 text-center text-slate-500 text-sm">Belum ada transaksi.</td></tr>
              )}
            </tbody>
          </table>
        </Card>

        <Card>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
            <Package size={18} /> Daftar Stok Menipis
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {displayedLowStock.map((item, idx) => (
              <div key={item.id + idx} className="flex justify-between items-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div>
                  <p className="text-sm font-bold text-white">{item.type === 'product' ? item.variant : item.name} {item.type === 'product' && <span className="text-xs text-slate-400">({item.brand})</span>}</p>
                  <p className="text-[10px] text-slate-500">{item.type === 'product' ? 'Parfum / Cairan' : 'Supply / Botol'}</p>
                </div>
                <span className="text-xs font-bold text-red-500">{item.type === 'product' ? `${Math.round(item.stock_ml)} ml` : `${item.stock_qty} pcs`}</span>
              </div>
            ))}
            
            {allLowStockItems.length > 5 && !showAllStock && (
              <button 
                onClick={() => setShowAllStock(true)}
                className="w-full mt-2 py-2 text-xs font-bold text-amber-500 border border-amber-500/50 rounded-lg hover:bg-amber-500/10 transition-colors"
              >
                Lihat Lebih Banyak ({allLowStockItems.length - 5} lainnya)
              </button>
            )}

            {showAllStock && allLowStockItems.length > 5 && (
              <button 
                onClick={() => setShowAllStock(false)}
                className="w-full mt-2 py-2 text-xs font-bold text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Tutup Sebagian
              </button>
            )}

            {allLowStockItems.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-slate-500">
                <Package size={40} className="mb-2 opacity-20" />
                <p className="text-sm">Semua stok dalam kondisi aman.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

const MasterProduct = ({ products, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id: '', brand: '', variant: '', category: 'EDP', bottle_capacity: 100, stock_ml: 0, image: '', note: '',
    price_1: 0, price_2: 0, price_3: 0, price_5: 0, price_7: 0, price_10: 0,
    capital_price: 0, barcode: '', aroma_category: '', is_active: 1
  });

  const handleOpenAdd = () => {
    const newId = 'PRD' + Date.now().toString().slice(-4);
    setEditingId(null);
    setFormData({ id: newId, brand: '', variant: '', category: 'EDP', bottle_capacity: 100, stock_ml: 0, image: '', note: '', price_2: 0, price_3: 0, price_5: 0, price_7: 0, price_10: 0, capital_price: 0, barcode: '', aroma_category: '', is_active: 1 });
    setShowModal(true);
  };

  const getPrefix = (brand) => {
    if (!brand) return 'PRD';
    const b = brand.toLowerCase().trim();
    if (b.includes('mykonos')) return 'MK';
    if (b.includes('zimaya')) return 'ZM';
    if (b.includes('velixir')) return 'VL';
    if (b.includes('botol')) return 'BT';
    if (b.length >= 2) return b.substring(0, 2).toUpperCase();
    return 'PRD';
  };

  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    setFormData((prev) => {
      let updatedId = prev.id;
      if (!editingId) {
        const prefix = getPrefix(newBrand);
        const numericPart = prev.id.replace(/^[a-zA-Z]+/, ''); 
        updatedId = prefix + numericPart;
      }
      return { ...prev, brand: newBrand, id: updatedId };
    });
  };

  const handleOpenEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      id: p.id, brand: p.brand || '', variant: p.variant || '', category: p.category || '', bottle_capacity: p.bottle_capacity || 100, stock_ml: p.stock_ml || 0, image: p.image || '', note: p.note || '',
      price_2: p.prices?.[2] || 0, price_3: p.prices?.[3] || 0, price_5: p.prices?.[5] || 0, price_7: p.prices?.[7] || 0, price_10: p.prices?.[10] || 0,
      capital_price: p.capital_price || 0, barcode: p.barcode || '', aroma_category: p.aroma_category || '', is_active: p.is_active !== undefined ? Number(p.is_active) : 1
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      const res = await db.deleteProduct(id);
      if (res.success) {
        if(onUpdate) onUpdate();
      } else {
        alert('Gagal menghapus produk');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const res = await db.uploadImage(file);
      if (res.url) {
        setFormData({ ...formData, image: res.url });
      } else {
        alert('Gagal mengunggah gambar');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id: formData.id, brand: formData.brand, variant: formData.variant, category: formData.category, bottle_capacity: Number(formData.bottle_capacity), stock_ml: Number(formData.stock_ml), image: formData.image, note: formData.note,
      prices: { 2: Number(formData.price_2), 3: Number(formData.price_3), 5: Number(formData.price_5), 7: Number(formData.price_7), 10: Number(formData.price_10) },
      capital_price: Number(formData.capital_price), barcode: formData.barcode, aroma_category: formData.aroma_category, is_active: formData.is_active
    };

    let res;
    if (editingId) {
      res = await db.updateProduct(editingId, payload);
    } else {
      res = await db.createProduct(payload);
    }

    if (res.success) {
      setShowModal(false);
      if(onUpdate) onUpdate();
    } else {
      alert('Gagal menyimpan produk');
    }
  };

  return (
    <>
      <div className="fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gold-text">Data Produk</h1>
          <button onClick={handleOpenAdd} className="btn btn-primary"><Plus size={18} /> Tambah Produk</button>
        </div>
        <Card className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-4 text-left text-slate-400">Barcode</th>
                <th className="p-4 text-left text-slate-400">Produk</th>
                <th className="p-4 text-left text-slate-400">Kategori Aroma</th>
                <th className="p-4 text-left text-slate-400">Harga Modal</th>
                <th className="p-4 text-left text-slate-400">Status</th>
                <th className="p-4 text-left text-slate-400">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t border-slate-700/50">
                  <td className="p-4 text-sm text-slate-400">{p.barcode || p.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-white text-sm">{p.variant}</p>
                        <p className="text-slate-400 text-xs">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-200">{p.aroma_category || '-'}</td>
                  <td className="p-4 text-sm text-slate-200">Rp {Number(p.capital_price || 0).toLocaleString('id-ID')}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-lg text-xs ${p.is_active != 0 && p.is_active !== '0' && p.is_active !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'}`}>
                      {p.is_active != 0 && p.is_active !== '0' && p.is_active !== false ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <div className="flex gap-3">
                      <button onClick={() => handleOpenEdit(p)} className="flex items-center gap-1 text-slate-400 hover:text-amber-500 transition-colors">
                        <Edit size={16} /> <span className="text-xs font-bold">Edit</span>
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {showModal && (
        <div className="modal-overlay z-50">
          <div className="glass" style={{ width: '800px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', borderRadius: '16px', position: 'relative' }}>
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Produk' : 'Tambah Produk'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">ID Produk (Otomatis)</label>
                  <input required readOnly type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-500 cursor-not-allowed" value={formData.id} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Barcode</label>
                  <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Brand</label>
                  <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={formData.brand} onChange={handleBrandChange} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Varian</label>
                  <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={formData.variant} onChange={e => setFormData({...formData, variant: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Kategori (EDP/EDT)</label>
                  <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Kategori Aroma</label>
                  <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={formData.aroma_category} onChange={e => setFormData({...formData, aroma_category: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Harga Modal (Rp)</label>
                  <input required type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={formData.capital_price} onChange={e => setFormData({...formData, capital_price: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Kapasitas Botol Utama (ml)</label>
                  <input required type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={formData.bottle_capacity} onChange={e => setFormData({...formData, bottle_capacity: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Stok Awal (ml)</label>
                  <input required type="number" step="0.1" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={formData.stock_ml} onChange={e => setFormData({...formData, stock_ml: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Status Penjualan (Tampil di Kasir)</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500" value={formData.is_active} onChange={e => setFormData({...formData, is_active: Number(e.target.value)})}>
                    <option value={1}>Aktif (Dijual)</option>
                    <option value={0}>Tidak Aktif (Disembunyikan)</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="text-xs text-slate-400 block mb-1">Foto Produk</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="URL Gambar..." className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                  <label className="btn btn-outline flex items-center justify-center cursor-pointer">
                    <span className="text-sm">Kamera/File</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                {formData.image && <img src={formData.image} alt="Preview" className="mt-3 h-20 w-20 object-cover rounded-lg border border-slate-700" />}
              </div>

              <div className="mt-4">
                <label className="text-xs text-slate-400 block mb-1">Harga Jual Decant (Rp)</label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  <div><span className="text-10 text-slate-500 block mb-1 text-center">2ml</span><input required type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white text-center" value={formData.price_2} onChange={e => setFormData({...formData, price_2: e.target.value})} /></div>
                  <div><span className="text-10 text-slate-500 block mb-1 text-center">3ml</span><input required type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white text-center" value={formData.price_3} onChange={e => setFormData({...formData, price_3: e.target.value})} /></div>
                  <div><span className="text-10 text-slate-500 block mb-1 text-center">5ml</span><input required type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white text-center" value={formData.price_5} onChange={e => setFormData({...formData, price_5: e.target.value})} /></div>
                  <div><span className="text-10 text-slate-500 block mb-1 text-center">7ml</span><input required type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white text-center" value={formData.price_7} onChange={e => setFormData({...formData, price_7: e.target.value})} /></div>
                  <div><span className="text-10 text-slate-500 block mb-1 text-center">10ml</span><input required type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white text-center" value={formData.price_10} onChange={e => setFormData({...formData, price_10: e.target.value})} /></div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-700/50">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline px-6 py-2">Batal</button>
                <button type="submit" className="btn btn-primary px-6 py-2">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const IncomingItems = ({ products, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [addStock, setAddStock] = useState(0);

  const handleOpenAdd = () => {
    setSelectedProductId('');
    setAddStock(0);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return alert('Pilih produk!');
    
    // Create updated payload
    const payload = {
      ...product,
      stock_ml: Number(product.stock_ml) + Number(addStock)
    };

    const res = await db.updateProduct(product.id, payload);
    if (res.success) {
      setShowModal(false);
      if(onUpdate) onUpdate();
    } else {
      alert('Gagal menambah stok');
    }
  };

  return (
    <>
      <div className="fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gold-text">Barang Masuk</h1>
          <button onClick={handleOpenAdd} className="btn btn-primary"><Plus size={18} /> Tambah Stok Barang</button>
        </div>
        <Card className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-4 text-left text-slate-400">Barcode</th>
                <th className="p-4 text-left text-slate-400">Produk</th>
                <th className="p-4 text-left text-slate-400">Stok (ml)</th>
                <th className="p-4 text-left text-slate-400">Botol Sisa</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t border-slate-700/50">
                  <td className="p-4 text-sm text-slate-400">{p.barcode || p.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-white text-sm">{p.variant}</p>
                        <p className="text-slate-400 text-xs">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-lg ${p.stock_ml < 20 ? 'bg-red-500/10 text-red-500' : 'bg-slate-700 text-slate-200'}`}>
                      {Math.round(p.stock_ml)} ml
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-200">
                    {Math.floor(Number(p.stock_ml) / (Number(p.bottle_capacity) || 100))} Botol ({Math.round(Number(p.stock_ml) % (Number(p.bottle_capacity) || 100))} ml sisa)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {showModal && (
        <div className="modal-overlay z-50">
          <div className="glass" style={{ width: '500px', maxWidth: '95vw', padding: '2.5rem', borderRadius: '16px', position: 'relative' }}>
            <h2 className="text-2xl font-bold mb-6">Tambah Stok Barang Masuk</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Pilih Produk</label>
                <select required className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}>
                  <option value="" disabled>-- Pilih Produk Master --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.brand} - {p.variant} ({p.barcode || p.id})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Jumlah Stok Masuk (ml)</label>
                <input required type="number" step="0.1" min="0.1" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={addStock} onChange={e => setAddStock(e.target.value)} />
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-700/50">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline px-6 py-2">Batal</button>
                <button type="submit" className="btn btn-primary px-6 py-2">Simpan Stok</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const Inventory = ({ products, onUpdate, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newStock, setNewStock] = useState('');

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewStock(product.stock_ml);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editingProduct && newStock !== '') {
      await db.updateProduct(editingProduct.id, { ...editingProduct, stock_ml: Number(newStock) });
      setShowModal(false);
      onUpdate();
    }
  };
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gold-text">Stok Barang</h1>
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-4 text-left text-slate-400">ID</th>
              <th className="p-4 text-left text-slate-400">Produk</th>
              <th className="p-4 text-left text-slate-400">Kategori</th>
              <th className="p-4 text-left text-slate-400">Harga (1ml - 10ml)</th>
              <th className="p-4 text-left text-slate-400">Stok (ml)</th>
              <th className="p-4 text-left text-slate-400">Botol Sisa</th>
              {user?.role?.toLowerCase() === 'superadmin' && <th className="p-4 text-right text-slate-400">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-slate-700/50">
                <td className="p-4 text-sm text-slate-400">{p.id}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-white text-sm">{p.variant}</p>
                      <p className="text-slate-400 text-xs">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-200">{p.category}</td>
                <td className="p-4 text-sm text-amber-400 font-medium">
                  {p.prices ? `Rp ${p.prices[1]?.toLocaleString('id-ID')} - ${p.prices[10]?.toLocaleString('id-ID')}` : 'N/A'}
                </td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-lg ${p.stock_ml < 20 ? 'bg-red-500/10 text-red-500' : 'bg-slate-700 text-slate-200'}`}>
                    {Math.round(p.stock_ml)} ml
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-200">
                  {Math.floor(Number(p.stock_ml) / (Number(p.bottle_capacity) || 100))} Botol ({Math.round(Number(p.stock_ml) % (Number(p.bottle_capacity) || 100))} ml sisa)
                </td>
                {user?.role?.toLowerCase() === 'superadmin' && (
                  <td className="p-4 text-right">
                    <button onClick={() => handleEditClick(p)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showModal && (
        <div className="modal-overlay z-1000" style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          <div className="glass" style={{ width: '400px', maxWidth: '95vw', padding: '2.5rem', borderRadius: '16px', position: 'relative' }}>
            <h2 className="text-xl font-bold mb-4 gold-text">Edit Stok Fisik</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Produk</label>
                <input readOnly type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-500 cursor-not-allowed" value={`${editingProduct?.variant} (${editingProduct?.brand})`} />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Stok Fisik Saat Ini (ml)</label>
                <input required type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500" value={newStock} onChange={e => setNewStock(e.target.value)} />
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-700/50">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline px-6 py-2">Batal</button>
                <button type="button" onClick={handleSave} className="btn btn-primary px-6 py-2">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const POS = ({ products, supplies, onSale }) => {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [shippingType, setShippingType] = useState('Gratis');
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [showCheckout, setShowCheckout] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({}); // Tracking selected size per product card
  const [notification, setNotification] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes({ ...selectedSizes, [productId]: size });
  };

  const addToCart = (product) => {
    if (!customerName) {
      alert('Masukkan nama pelanggan terlebih dahulu!');
      return;
    }
    
    const availableSizes = product.prices ? ['2', '3', '5', '7', '10'].filter(s => Number(product.prices[s]) > 0) : [];
    const defaultSize = availableSizes.length > 0 ? Number(availableSizes[0]) : 2;
    const size = selectedSizes[product.id] || defaultSize;
    const price = product.prices[size] || 0;
    
    // Calculate total ML for this product ID already in cart (all sizes)
    const currentTotalMlInCart = cart
      .filter(item => item.id === product.id)
      .reduce((sum, item) => sum + (item.quantity * item.selected_size), 0);
    
    const totalMlRequested = currentTotalMlInCart + size;

    if (totalMlRequested > product.stock_ml) {
      alert(`Stok parfum tidak mencukupi! Sisa stok parfum: ${Math.round(product.stock_ml)}ml.`);
      return;
    }

    // Periksa stok botol
    const bottleSupply = supplies.find(s => s.type === 'botol' && s.size_ml === size);
    if (bottleSupply) {
      const currentBottlesInCart = cart.filter(item => item.selected_size === size).reduce((sum, item) => sum + item.quantity, 0);
      if (currentBottlesInCart + 1 > bottleSupply.stock_qty) {
        alert(`Gagal! Stok Botol Decant ${size}ml tidak mencukupi (sisa: ${bottleSupply.stock_qty} pcs). Silakan restock di menu Pengeluaran.`);
        return;
      }
    }
    
    const cartKey = `${product.id}-${size}`;
    const existingInCart = cart.find(item => item.cartKey === cartKey);
    
    if (existingInCart) {
      setCart(cart.map(item => item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, cartKey, selected_size: size, price, quantity: 1 }]);
    }
    showNotification(`${product.variant} (${size}ml) ditambahkan ke keranjang!`);
  };

  const removeFromCart = (cartKey) => {
    setCart(cart.filter(item => item.cartKey !== cartKey));
  };

  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const total = subtotal + Number(shippingCost);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    // Final stock check before processing
    for (const item of cart) {
      const product = products.find(p => p.id === item.id);
      const totalMlInCart = cart
        .filter(c => c.id === item.id)
        .reduce((sum, c) => sum + (c.quantity * c.selected_size), 0);
      
      if (totalMlInCart > product.stock_ml) {
        alert(`Gagal! Stok ${product.variant} tidak mencukupi (${Math.round(product.stock_ml)}ml tersedia).`);
        return;
      }
    }

    const transaction = {
      customer_name: customerName,
      items: cart,
      shipping_type: shippingType,
      shipping_cost: Number(shippingCost),
      payment_method: paymentMethod,
      total_amount: total
    };
    
    const result = await db.saveTransaction(transaction);
    if (result.success) {
      const savedTransactions = await db.getTransactions();
      setLastInvoice(savedTransactions[savedTransactions.length - 1]);
      
      setCart([]);
      setCustomerName('');
      setShippingType('Gratis');
      setShippingCost(0);
      setShowCheckout(true);
      await onSale();
    } else {
      alert('Gagal memproses transaksi: ' + (result.error || 'Terjadi kesalahan server'));
    }
  };

  return (
    <div className="flex gap-6 h-pos fade-in relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-sm fade-in flex items-center gap-2">
          <ShoppingCart size={16} />
          {notification}
        </div>
      )}

      {/* Mobile Sticky Cart Button */}
      {cart.length > 0 && (
        <div className="mobile-cart-sticky">
          <button 
            onClick={() => document.getElementById('cart-section').scrollIntoView({ behavior: 'smooth' })}
            className="btn btn-primary w-full justify-center py-3 text-sm font-bold shadow-2xl"
          >
            <ShoppingCart size={18} /> Lanjut Bayar ({cart.length} Item) - Rp {total.toLocaleString('id-ID')}
          </button>
        </div>
      )}

      {/* Product List */}
      <div className="flex-1 overflow-y-auto pr-4 pb-20">
        <h1 className="text-3xl font-bold mb-8 gold-text">Penjualan (POS)</h1>
        <div className="product-grid">
          {products.filter(p => p.is_active != 0 && p.is_active !== '0' && p.is_active !== false).map(p => (
            <Card key={p.id} className="product-card !p-0">
              <img src={p.image} className="product-image" />
              <div className="p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider">{p.brand}</p>
                <h3 className="font-bold text-white mb-2">{p.variant}</h3>
                
                <div className="space-y-2 mb-4">
                  <p className="text-10 text-slate-500 font-bold uppercase">Pilih Ukuran:</p>
                  <div className="grid grid-cols-3 gap-1">
                    {p.prices && ['2', '3', '5', '7', '10']
                      .filter(size => Number(p.prices[size]) > 0)
                      .map(size => {
                        const availableSizes = ['2', '3', '5', '7', '10'].filter(s => Number(p.prices[s]) > 0);
                        const defaultSize = availableSizes.length > 0 ? Number(availableSizes[0]) : 2;
                        const isSelected = (selectedSizes[p.id] || defaultSize) === Number(size);
                        
                        return (
                          <button 
                            key={size}
                            onClick={() => handleSizeChange(p.id, Number(size))}
                            className={`p-1 rounded text-10 font-bold border transition-all ${
                              isSelected 
                                ? 'border-amber-500 bg-amber-500/10 text-amber-500' 
                                : 'border-slate-700 text-slate-400'
                            }`}
                          >
                            {size}ml
                          </button>
                        );
                      })}
                  </div>
                </div>

                {(() => {
                  const availableSizes = p.prices ? ['2', '3', '5', '7', '10'].filter(s => Number(p.prices[s]) > 0) : [];
                  const defaultSize = availableSizes.length > 0 ? Number(availableSizes[0]) : 2;
                  const currentSize = selectedSizes[p.id] || defaultSize;
                  const currentPrice = p.prices ? (p.prices[currentSize] || 0) : 0;
                  
                  return (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-amber-400 font-bold">
                          Rp {currentPrice.toLocaleString('id-ID')}
                        </p>
                        <p className="text-[10px] text-slate-500">{Math.round(p.stock_ml)}ml tersedia</p>
                      </div>

                      <button 
                        onClick={() => addToCart(p)}
                        disabled={p.stock_ml < currentSize || currentPrice <= 0}
                        className="w-full btn btn-outline text-xs justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {currentPrice <= 0 ? 'Harga Belum Diatur' : (p.stock_ml < currentSize ? 'Stok Tidak Cukup' : <><Plus size={14} /> Masukkan Keranjang</>)}
                      </button>
                    </>
                  );
                })()}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Side */}
      <div id="cart-section" className="cart-side" style={{ width: '400px' }}>
        <Card className="h-full flex flex-col">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ShoppingCart size={20} className="text-amber-500" /> Keranjang
          </h2>
          
          <input 
            type="text"
            placeholder="Nama Pelanggan"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 mb-6 text-white focus:outline-none focus:border-amber-500"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <div className="flex-1 overflow-y-auto mb-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <ShoppingCart size={48} strokeWidth={1} className="mb-2 opacity-20" />
                <p>Keranjang Kosong</p>
              </div>
            ) : (
              <AnimatePresence>
                {cart.map(item => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={item.cartKey} 
                    className="flex justify-between items-center mb-4 pb-4 border-bottom border-slate-700/50"
                  >
                    <div>
                      <p className="font-bold text-white text-sm">{item.variant} <span className="text-amber-500">({item.selected_size}ml)</span></p>
                      <p className="text-xs text-slate-400">{item.quantity}x @ Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-white">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                      <button onClick={() => removeFromCart(item.cartKey)} className="text-red-500 opacity-50 hover:opacity-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-700">
            <div className="grid grid-cols-3 gap-2">
              {['Gratis', 'Gojek', 'Maxim'].map(type => (
                <button 
                  key={type}
                  onClick={() => setShippingType(type)}
                  className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                    shippingType === type ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-slate-400" />
              <input 
                type="number"
                placeholder="Biaya Ongkir (Rp)"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
              />
            </div>

            <div className="flex justify-between text-slate-400 text-sm">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Ongkir</span>
              <span>Rp {Number(shippingCost).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-bold gold-text">Rp {total.toLocaleString('id-ID')}</span>
            </div>

            <div className="space-y-2 py-4">
              <p className="text-xs text-slate-400 font-bold uppercase">Metode Pembayaran</p>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setPaymentMethod('Tunai')} className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${paymentMethod === 'Tunai' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-700 text-slate-400'}`}>
                  <Banknote size={16} /> <span className="text-[10px]">Tunai</span>
                </button>
                <button onClick={() => setPaymentMethod('GoPay')} className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${paymentMethod === 'GoPay' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-700 text-slate-400'}`}>
                  <Wallet size={16} /> <span className="text-[10px]">GoPay</span>
                </button>
                <button onClick={() => setPaymentMethod('QRIS')} className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${paymentMethod === 'QRIS' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-700 text-slate-400'}`}>
                  <CreditCard size={16} /> <span className="text-[10px]">QRIS</span>
                </button>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0 || !customerName}
              className="w-full btn btn-primary justify-center py-4 text-lg disabled:opacity-30"
            >
              Bayar Sekarang <ChevronRight size={20} />
            </button>
          </div>
        </Card>
      </div>

      {/* Invoice Modal */}
      {showCheckout && lastInvoice && (
        <div className="modal-overlay z-1000" style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="modal-content glass modal-content-sm p-8"
            style={{ maxHeight: '85vh', overflowY: 'auto' }}
          >
            <div className="text-center mb-8">
              <div className="inline-block p-4 rounded-full bg-green-500/10 text-green-500 mb-4">
                <LayoutDashboard size={40} />
              </div>
              <h2 className="text-2xl font-bold">Pembayaran Berhasil!</h2>
              <p className="text-slate-400">ID Transaksi: {lastInvoice.transaction_id}</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 mb-8 text-sm space-y-4">
              <div className="flex justify-between text-slate-400">
                <span>Pelanggan</span>
                <span className="text-white font-bold">{lastInvoice.customer_name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Metode</span>
                <span className="text-white">{lastInvoice.payment_method}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Waktu</span>
                <span className="text-white">{new Date(lastInvoice.timestamp).toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-slate-700 pt-4">
                {lastInvoice.items.map(item => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <span>{item.variant} x {item.quantity}</span>
                    <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ongkir ({lastInvoice.shipping_type})</span>
                <span>Rp {lastInvoice.shipping_cost.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-slate-700 pt-4 flex justify-between font-bold text-lg">
                <span>TOTAL</span>
                <span className="text-amber-500">Rp {Number(lastInvoice.total_amount).toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowCheckout(false)} className="flex-1 btn btn-outline justify-center">Tutup</button>
              <button onClick={() => downloadInvoiceImage(lastInvoice)} className="flex-1 btn btn-primary justify-center bg-emerald-600 hover:bg-emerald-500 text-white border-none"><Download size={18} /> Unduh Gambar</button>
              <button onClick={() => printInvoice(lastInvoice)} className="flex-1 btn btn-primary justify-center"><Printer size={18} /> Cetak Struk</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const Reports = ({ transactions, expenses, user }) => {
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isWithinDateRange = (timestamp) => {
    if (filterType === 'all') return true;
    
    const date = new Date(timestamp);
    const today = new Date();
    
    if (filterType === 'daily') {
      return date.toDateString() === today.toDateString();
    }
    
    if (filterType === 'monthly') {
      return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }
    
    if (filterType === 'custom') {
      if (!startDate || !endDate) return true;
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    }
    
    return true;
  };

  const filteredTransactions = transactions.filter(t => isWithinDateRange(t.timestamp));
  const filteredExpenses = expenses.filter(e => isWithinDateRange(e.timestamp));

  // Calculate Totals
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.items.reduce((acc, item) => acc + (item.price * item.quantity), 0), 0);
  
  const totalCOGS = filteredTransactions.reduce((sum, t) => {
    return sum + t.items.reduce((acc, item) => {
      const capPrice = Number(item.capital_price) || 0;
      const capacity = Number(item.bottle_capacity) || 100;
      const mlSold = Number(item.selected_size) * Number(item.quantity);
      const cogs = (capPrice / capacity) * mlSold;
      return acc + cogs;
    }, 0);
  }, 0);

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const netProfit = totalRevenue - totalCOGS - totalExpenses;

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gold-text">Laporan Penjualan & Laba Rugi</h1>
        
        <div className="flex gap-4 items-center bg-slate-800 p-3 rounded-xl border border-slate-700">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-transparent text-white text-sm outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-800">Semua Waktu</option>
            <option value="daily" className="bg-slate-800">Hari Ini</option>
            <option value="monthly" className="bg-slate-800">Bulan Ini</option>
            <option value="custom" className="bg-slate-800">Pilih Tanggal</option>
          </select>
          
          {filterType === 'custom' && (
            <div className="flex gap-2 items-center border-l border-slate-600 pl-4">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-700 text-white text-xs p-2 rounded outline-none"
              />
              <span className="text-slate-400">-</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-700 text-white text-xs p-2 rounded outline-none"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-t-4 border-t-blue-500">
          <h3 className="text-slate-400 text-xs mb-2">Total Pendapatan</h3>
          <p className="text-2xl font-bold text-white">Rp {totalRevenue.toLocaleString('id-ID')}</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-t-4 border-t-red-500">
          <h3 className="text-slate-400 text-xs mb-2">Total Modal (HPP)</h3>
          <p className="text-2xl font-bold text-white">Rp {Math.round(totalCOGS).toLocaleString('id-ID')}</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-t-4 border-t-orange-500">
          <h3 className="text-slate-400 text-xs mb-2">Total Pengeluaran</h3>
          <p className="text-2xl font-bold text-white">Rp {totalExpenses.toLocaleString('id-ID')}</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-t-4 border-t-green-500">
          <h3 className="text-slate-400 text-xs mb-2">Laba Bersih Final</h3>
          <p className="text-2xl font-bold text-green-400">Rp {Math.round(netProfit).toLocaleString('id-ID')}</p>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: '600px' }}>
          <thead>
            <tr>
              <th className="p-4 text-left text-slate-400">Tanggal</th>
              <th className="p-4 text-left text-slate-400">ID TRX</th>
              <th className="p-4 text-left text-slate-400">Pelanggan</th>
              <th className="p-4 text-left text-slate-400">Produk</th>
              <th className="p-4 text-left text-slate-400">Total Transaksi</th>
              <th className="p-4 text-left text-slate-400">Laba Kotor</th>
              <th className="p-4 text-right text-slate-400">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">Tidak ada data transaksi untuk periode ini</td>
              </tr>
            ) : (
              filteredTransactions.slice().reverse().map(t => {
                const trxRevenue = t.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                const trxCOGS = t.items.reduce((acc, item) => {
                  const capPrice = Number(item.capital_price) || 0;
                  const capacity = Number(item.bottle_capacity) || 100;
                  const mlSold = Number(item.selected_size) * Number(item.quantity);
                  return acc + ((capPrice / capacity) * mlSold);
                }, 0);
                const trxProfit = trxRevenue - trxCOGS;

                return (
                  <tr key={t.id} className="border-t border-slate-700/50">
                    <td className="p-4 text-sm text-slate-400">{new Date(t.timestamp).toLocaleDateString('id-ID')}</td>
                    <td className="p-4 text-sm text-slate-200">{t.transaction_id}</td>
                    <td className="p-4 text-sm text-white font-medium">{t.customer_name}</td>
                    <td className="p-4 text-sm text-slate-400">{t.items.length} Item</td>
                    <td className="p-4 text-sm text-amber-400 font-bold">Rp {Number(t.total_amount).toLocaleString('id-ID')}</td>
                    <td className="p-4 text-sm text-green-400 font-bold">+ Rp {Math.round(trxProfit).toLocaleString('id-ID')}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => downloadInvoiceImage(t)} className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" title="Unduh Gambar Invoice">
                          <Download size={16} />
                        </button>
                        <button onClick={() => printInvoice(t)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Cetak Struk Kertas">
                          <Printer size={16} />
                        </button>
                        {user?.role?.toLowerCase() === 'superadmin' && (
                          <button onClick={async () => {
                            if (confirm('Yakin ingin menghapus transaksi ini? (Stok akan dikembalikan)')) {
                              await db.deleteTransaction(t.id);
                              window.location.reload();
                            }
                          }} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Hapus Transaksi">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const Expenses = ({ supplies, expenses, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSupplyData, setEditSupplyData] = useState({ id: '', name: '', stock_qty: 0 });
  const [formData, setFormData] = useState({ category: 'Operasional', amount: 0, description: '', supply_id: '', supply_qty: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      category: formData.category,
      amount: Number(formData.amount),
      description: formData.description,
      supply_id: formData.category === 'Supply/Botol' ? formData.supply_id : null,
      supply_qty: formData.category === 'Supply/Botol' ? Number(formData.supply_qty) : null
    };

    const res = await db.addExpense(payload);
    if (res.success) {
      setShowModal(false);
      setFormData({ category: 'Operasional', amount: 0, description: '', supply_id: '', supply_qty: 0 });
      if(onUpdate) onUpdate();
    } else {
      alert('Gagal menambah pengeluaran');
    }
  };

  const handleEditSupplySubmit = async (e) => {
    e.preventDefault();
    const res = await db.updateSupply(editSupplyData.id, Number(editSupplyData.stock_qty));
    if (res.success) {
      setShowEditModal(false);
      if(onUpdate) onUpdate();
    } else {
      alert('Gagal mengubah stok supply');
    }
  };

  return (
    <>
      <div className="fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gold-text">Pengeluaran & Supply</h1>
          <button onClick={() => setShowModal(true)} className="btn btn-primary"><Plus size={18} /> Tambah Pengeluaran</button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="font-bold text-lg mb-4 text-slate-300">Stok Barang Operasional (Supply)</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {supplies.map(sup => (
                <div key={sup.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div>
                    <p className="font-medium text-white text-sm">{sup.name}</p>
                    {sup.stock_qty <= sup.min_stock && (
                      <p className="text-[10px] text-red-400 mt-1">Stok menipis! Segera restock.</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded font-bold text-sm ${sup.stock_qty <= sup.min_stock ? 'bg-red-500/20 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                      {sup.stock_qty} pcs
                    </div>
                    <button 
                      onClick={() => { setEditSupplyData({ id: sup.id, name: sup.name, stock_qty: sup.stock_qty }); setShowEditModal(true); }}
                      className="text-slate-400 hover:text-amber-500 transition-colors p-2 rounded-lg bg-slate-800"
                      title="Edit Stok / Kondisi Botol"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-lg mb-4 text-slate-300">Histori Pengeluaran</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {expenses.map(exp => (
                <div key={exp.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold text-white">{exp.category}</span>
                    <span className="text-sm font-bold text-amber-500">Rp {Number(exp.amount).toLocaleString('id-ID')}</span>
                  </div>
                  <p className="text-xs text-slate-400">{exp.description}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{new Date(exp.date).toLocaleString('id-ID')}</p>
                </div>
              ))}
              {expenses.length === 0 && <p className="text-sm text-slate-500 text-center">Belum ada data pengeluaran.</p>}
            </div>
          </Card>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay z-50">
          <div className="glass" style={{ width: '500px', maxWidth: '95vw', padding: '2.5rem', borderRadius: '16px', position: 'relative' }}>
            <h2 className="text-2xl font-bold mb-6">Tambah Pengeluaran</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Kategori</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Operasional">Operasional (Listrik, Gaji, dll)</option>
                  <option value="Supply/Botol">Pembelian Supply (Botol, Stiker, Plastik)</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {formData.category === 'Supply/Botol' && (
                <>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Pilih Barang Supply</label>
                    <select required className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={formData.supply_id} onChange={e => setFormData({...formData, supply_id: e.target.value})}>
                      <option value="" disabled>-- Pilih Supply --</option>
                      {supplies.map(sup => (
                        <option key={sup.id} value={sup.id}>{sup.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Jumlah Pcs yang Dibeli</label>
                    <input required type="number" min="1" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={formData.supply_qty} onChange={e => setFormData({...formData, supply_qty: e.target.value})} />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs text-slate-400 block mb-1">Total Biaya (Rp)</label>
                <input required type="number" min="0" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Keterangan / Catatan</label>
                <input required type="text" placeholder="Misal: Beli 100 botol 5ml..." className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-700/50">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline px-6 py-2">Batal</button>
                <button type="submit" className="btn btn-primary px-6 py-2">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="modal-overlay z-50">
          <div className="glass" style={{ width: '400px', maxWidth: '95vw', padding: '2.5rem', borderRadius: '16px', position: 'relative' }}>
            <h2 className="text-xl font-bold mb-4">Edit Kondisi Botol</h2>
            <p className="text-sm text-slate-400 mb-6">Ubah stok fisik untuk: <span className="font-bold text-white">{editSupplyData.name}</span></p>
            <form onSubmit={handleEditSupplySubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Stok Tersedia Saat Ini (Pcs)</label>
                <input required type="number" min="0" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white" value={editSupplyData.stock_qty} onChange={e => setEditSupplyData({...editSupplyData, stock_qty: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-700/50">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-outline px-6 py-2">Batal</button>
                <button type="submit" className="btn btn-primary px-6 py-2">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', username: '', password: '', role: 'Operator' });

  const loadUsers = async () => {
    const data = await db.getUsers();
    setUsers(data);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.saveUser(formData);
    setShowModal(false);
    loadUsers();
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus pengguna ini?')) {
      await db.deleteUser(id);
      loadUsers();
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gold-text">Manajemen Pengguna</h1>
        <button onClick={() => { setFormData({ id: '', username: '', password: '', role: 'Operator' }); setShowModal(true); }} className="btn btn-primary flex items-center gap-2 px-6">
          <Plus size={18} /> Tambah Pengguna
        </button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: '600px' }}>
          <thead>
            <tr>
              <th className="p-4 text-left text-slate-400">Username</th>
              <th className="p-4 text-left text-slate-400">Role</th>
              <th className="p-4 text-right text-slate-400">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-slate-700/50">
                <td className="p-4 text-sm text-white font-medium">{u.username}</td>
                <td className="p-4 text-sm text-slate-400">
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${u.role?.toLowerCase() === 'superadmin' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setFormData({ id: u.id, username: u.username, password: '', role: u.role }); setShowModal(true); }} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showModal && (
        <div className="modal-overlay z-1000" style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          <div className="glass" style={{ width: '600px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', borderRadius: '16px', position: 'relative' }}>
            <h2 className="text-2xl font-bold mb-6">{formData.id ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Username</label>
                  <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Password {formData.id && '(Kosongkan jika tidak ubah)'}</label>
                  <input required={!formData.id} type="password" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Role</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="Operator">Operator</option>
                    <option value="Admin">Admin</option>
                    <option value="Superadmin">Superadmin</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-700/50">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline px-6 py-2">Batal</button>
                <button type="submit" className="btn btn-primary px-6 py-2">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('aurasense_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('aurasense_active_tab') || 'dashboard';
  });
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('aurasense_active_tab', activeTab);
  }, [activeTab]);

  const refreshData = async () => {
    const p = await db.getProducts();
    const t = await db.getTransactions();
    const s = await db.getSupplies();
    const e = await db.getExpenses();
    setProducts(p);
    setTransactions(t);
    setSupplies(s);
    setExpenses(e);
  };

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('aurasense_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aurasense_user');
  };

  if (!user && !showLogin) {
    return <PublicStore onBack={() => setShowLogin(true)} />;
  }

  if (!user && showLogin) {
    return <Login onLogin={handleLogin} onBackToStore={() => setShowLogin(false)} />;
  }

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div className="mobile-header">
         <div className="flex items-center gap-2">
            <img src="/logo aurasense.png" alt="Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-lg font-bold gold-text" style={{ margin: 0 }}>AURASENSE</h1>
         </div>
         <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2">
            <Menu size={24} />
         </button>
      </div>

      <div className={`overlay-bg ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      <aside className={`sidebar premium-gradient ${isSidebarOpen ? 'open' : ''}`} style={{ position: 'fixed', left: '0px', top: '0px', bottom: '0px', width: '260px', padding: '30px 20px', boxSizing: 'border-box', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
        <div style={{ margin: '0 0 32px 0', padding: '0 16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 8px 0' }}>
            <img src="/logo aurasense.png" alt="Aurasense Icon" style={{ width: '40px', height: '40px', objectFit: 'contain', margin: '0', flexShrink: 0 }} />
            <h1 className="text-2xl font-bold tracking-tighter gold-text" style={{ margin: 0, padding: 0 }}>AURASENSE</h1>
          </div>
          <p className="text-[10px] text-slate-500 tracking-[0.3em] font-bold uppercase" style={{ margin: '0 0 0 52px', padding: 0 }}>DECANT PARFUM PREMIUM</p>
        </div>

        <nav className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 8px', margin: 0, minHeight: 0 }}>
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={ShoppingCart} 
            label="Penjualan" 
            active={activeTab === 'pos'} 
            onClick={() => { setActiveTab('pos'); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={Database} 
            label="Data Produk" 
            active={activeTab === 'master'} 
            onClick={() => { setActiveTab('master'); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={Inbox} 
            label="Barang Masuk" 
            active={activeTab === 'incoming'} 
            onClick={() => { setActiveTab('incoming'); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={Package} 
            label="Stok Barang" 
            active={activeTab === 'inventory'} 
            onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={Wallet} 
            label="Pengeluaran & Supply" 
            active={activeTab === 'expenses'} 
            onClick={() => { setActiveTab('expenses'); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={BarChart3} 
            label="Laporan" 
            active={activeTab === 'reports'} 
            onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }} 
          />
          {(user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'superadmin') && (
            <SidebarItem 
              icon={Users} 
              label="Data Pengguna" 
              active={activeTab === 'users'} 
              onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }} 
            />
          )}
        </nav>

        <div style={{ flexShrink: 0, marginTop: '16px', padding: '0 8px' }}>
          <div className="glass rounded-2xl" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', margin: '0 0 16px 0' }}>
            <div className="bg-amber-500/10 text-amber-500" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, margin: 0 }}>
              <User size={20} />
            </div>
            <div style={{ overflow: 'hidden', margin: 0, padding: 0 }}>
              <p className="text-xs font-bold text-white uppercase truncate" style={{ margin: 0, padding: 0 }}>{user.username}</p>
              <p className="text-[10px] text-slate-500 uppercase truncate" style={{ margin: 0, padding: 0 }}>{user.role}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{ background: 'transparent', border: 'none', width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', margin: 0, cursor: 'pointer' }}
            className="text-red-500 hover:bg-red-500/10 rounded-xl transition-all text-sm font-bold"
          >
            <LogOut size={18} style={{ margin: 0, flexShrink: 0 }} />
            <span style={{ margin: 0, padding: 0 }}>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <Dashboard products={products} transactions={transactions} supplies={supplies} key="dash" />}
          {activeTab === 'master' && <MasterProduct products={products} onUpdate={refreshData} key="master" />}
          {activeTab === 'incoming' && <IncomingItems products={products} onUpdate={refreshData} key="inc" />}
          {activeTab === 'inventory' && <Inventory products={products} onUpdate={refreshData} user={user} key="inv" />}
          {activeTab === 'expenses' && <Expenses supplies={supplies} expenses={expenses} onUpdate={refreshData} key="exp" />}
          {activeTab === 'pos' && <POS products={products} supplies={supplies} onSale={refreshData} key="pos" />}
          {activeTab === 'reports' && <Reports transactions={transactions} expenses={expenses} user={user} key="rep" />}
          {activeTab === 'users' && <UserManagement key="users" />}
        </AnimatePresence>
      </main>
    </div>
  );
}
