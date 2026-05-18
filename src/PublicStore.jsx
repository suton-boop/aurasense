import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { db } from './db';

const Card = ({ children, className = '' }) => (
  <div className={`glass p-6 rounded-2xl ${className}`}>{children}</div>
);

export default function PublicStore({ onBack }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      const p = await db.getProducts();
      setProducts(p.filter(prod => prod.is_active != 0 && prod.is_active !== '0' && prod.is_active !== false));
    };
    fetchProducts();
  }, []);

  const handleSizeChange = (productId, size) => {
    setSelectedSizes({ ...selectedSizes, [productId]: size });
  };

  const addToCart = (product) => {
    const availableSizes = product.prices ? ['2', '3', '5', '7', '10'].filter(s => Number(product.prices[s]) > 0) : [];
    const defaultSize = availableSizes.length > 0 ? Number(availableSizes[0]) : 2;
    const size = selectedSizes[product.id] || defaultSize;
    const price = product.prices[size] || 0;
    
    const cartKey = `${product.id}-${size}`;
    const existing = cart.find(item => item.cartKey === cartKey);
    
    if (existing) {
      setCart(cart.map(item => item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, selected_size: size, price, quantity: 1, cartKey }]);
    }
  };

  const removeFromCart = (cartKey) => {
    setCart(cart.filter(item => item.cartKey !== cartKey));
  };

  const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const handleCheckoutWA = () => {
    if (cart.length === 0) return;
    let text = 'Halo Admin Aurasense, saya ingin pesan parfum:\n\n';
    cart.forEach(item => {
      text += `- ${item.variant} (${item.brand}) - ${item.selected_size}ml x${item.quantity}\n`;
    });
    text += `\nTotal Harga: Rp ${total.toLocaleString('id-ID')}`;
    text += `\n\nMohon info pembayaran dan ongkir. Terima kasih!`;
    
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 p-4 md:p-8 min-h-screen bg-[#0f172a] text-white fade-in">
      {/* Mobile Sticky Cart */}
      {cart.length > 0 && (
        <div className="mobile-cart-sticky block md:hidden z-50 fixed bottom-4 left-4 right-4">
          <button 
            onClick={() => document.getElementById('public-cart').scrollIntoView({ behavior: 'smooth' })}
            className="btn btn-primary w-full justify-center py-3 text-sm font-bold shadow-2xl"
          >
            <ShoppingCart size={18} /> Lihat Keranjang ({cart.length}) - Rp {total.toLocaleString('id-ID')}
          </button>
        </div>
      )}

      {/* Catalog */}
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="flex justify-between items-center mb-8 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-4">
            <img src="/logo aurasense.png" alt="Logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-2xl font-bold gold-text">Aurasense</h1>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">Decant Parfum Premium</p>
            </div>
          </div>
          <button 
            onClick={onBack} 
            className="btn btn-outline text-xs px-4 py-2 text-slate-300 border-slate-600 hover:text-white hover:border-slate-400"
          >
            Login Admin
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <Card key={p.id} className="product-card !p-0 overflow-hidden flex flex-col">
              <img src={p.image || 'https://via.placeholder.com/150'} className="w-full h-40 object-cover" alt={p.variant} />
              <div className="p-4 flex flex-col flex-1">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{p.brand}</p>
                <h3 className="font-bold text-white text-sm mb-3 flex-1">{p.variant}</h3>
                
                <div className="space-y-2 mb-4">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Pilih Ukuran:</p>
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
                            className={`p-1 rounded text-[10px] font-bold border transition-all ${
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
                    <div className="mt-auto">
                      <p className="text-amber-400 font-bold mb-3 text-sm">
                        Rp {currentPrice.toLocaleString('id-ID')}
                      </p>
                      <button 
                        onClick={() => addToCart(p)}
                        disabled={currentPrice <= 0 || p.stock_ml < currentSize}
                        className="w-full btn btn-outline text-xs justify-center py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {p.stock_ml < currentSize ? 'Stok Habis' : 'Tambah'}
                      </button>
                    </div>
                  );
                })()}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div id="public-cart" className="w-full md:w-[350px] lg:w-[400px]">
        <Card className="h-full flex flex-col min-h-[500px]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
            <ShoppingCart size={20} className="text-amber-500" /> Keranjang Belanja
          </h2>

          <div className="flex-1 overflow-y-auto mb-6 pr-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
                <ShoppingCart size={48} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-sm">Keranjang masih kosong</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.cartKey} className="flex gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <img src={item.image} className="w-12 h-12 rounded-lg object-cover" alt={item.variant} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{item.variant}</p>
                          <p className="text-[10px] text-slate-400 uppercase">{item.brand} • {item.selected_size}ml</p>
                        </div>
                        <button onClick={() => removeFromCart(item.cartKey)} className="text-slate-500 hover:text-red-400 p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm font-bold text-amber-400">Rp {item.price.toLocaleString('id-ID')}</p>
                        <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-700">
                          <button 
                            className="p-1 hover:text-amber-500 text-slate-400 transition-colors"
                            onClick={() => {
                              if (item.quantity > 1) {
                                setCart(cart.map(c => c.cartKey === item.cartKey ? { ...c, quantity: c.quantity - 1 } : c));
                              } else {
                                removeFromCart(item.cartKey);
                              }
                            }}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold w-4 text-center text-white">{item.quantity}</span>
                          <button 
                            className="p-1 hover:text-amber-500 text-slate-400 transition-colors"
                            onClick={() => setCart(cart.map(c => c.cartKey === item.cartKey ? { ...c, quantity: c.quantity + 1 } : c))}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-700/50 pt-4 mt-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400">Total Harga</span>
              <span className="text-xl font-bold text-amber-400">Rp {total.toLocaleString('id-ID')}</span>
            </div>
            
            <button 
              onClick={handleCheckoutWA}
              disabled={cart.length === 0}
              className="w-full btn btn-primary justify-center py-3 text-sm font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:shadow-none"
            >
              Checkout via WhatsApp
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
