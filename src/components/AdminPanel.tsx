import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Package,
  PlusCircle,
  Clock,
  Trash2,
  DollarSign,
  User,
  Image,
  Tag,
  Shield,
  Upload,
  BarChart3,
  Edit2,
  BellRing
} from 'lucide-react';
import { Product, Coupon, Order, Promotion } from '../types';
import { BRAND_INFO } from '../data';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  promotions: Promotion[];
  setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>;
  onClose: () => void;
}

export default function AdminPanel({
  products,
  setProducts,
  orders,
  setOrders,
  promotions,
  setPromotions,
  onClose,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'menu' | 'promotions' | 'profile'>('analytics');

  // --- Profile state management ---
  const [owner, setOwner] = useState(BRAND_INFO.owner);
  const [phone1, setPhone1] = useState(BRAND_INFO.contactNumbers[0]);
  const [phone2, setPhone2] = useState(BRAND_INFO.contactNumbers[1]);
  const [storeAddress, setStoreAddress] = useState(BRAND_INFO.address);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // --- Menu item creation state ---
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('burgers');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdTags, setNewProdTags] = useState('');
  const [menuSuccess, setMenuSuccess] = useState(false);

  // --- Banner creation state ---
  const [newPromoTitle, setNewPromoTitle] = useState('');
  const [newPromoDesc, setNewPromoDesc] = useState('');
  const [newPromoBadge, setNewPromoBadge] = useState('');
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoBg, setNewPromoBg] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);

  // --- Calculations for Analytics ---
  const stats = useMemo(() => {
    const totalSales = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((acc, curr) => acc + curr.total, 0);

    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    const itemsCount = products.length;
    const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

    // Aggregate category distribution
    const categoryShare: Record<string, number> = {};
    products.forEach(p => {
      categoryShare[p.category] = (categoryShare[p.category] || 0) + 1;
    });

    return { totalSales, pendingCount, itemsCount, deliveredCount, categoryShare };
  }, [orders, products]);

  // --- Menu Management Handlers ---
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    const pr = parseFloat(newProdPrice);
    if (isNaN(pr) || pr <= 0) return;

    const img = newProdImage.trim() || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80';

    const cleanTags = newProdTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const item: Product = {
      id: 'custom-' + Date.now(),
      name: newProdName,
      price: pr,
      category: newProdCategory,
      description: newProdDesc || 'Delicious freshly prepped customized food menu item.',
      image: img,
      rating: 4.5,
      isNew: true,
      tags: cleanTags.length > 0 ? cleanTags : ['Customized', 'Fresh'],
    };

    setProducts(prev => [item, ...prev]);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdCategory('burgers');
    setNewProdDesc('');
    setNewProdImage('');
    setNewProdTags('');
    setMenuSuccess(true);
    setTimeout(() => setMenuSuccess(false), 2500);
  };

  const handlePriceChange = (id: string, newPriceStr: string) => {
    const np = parseFloat(newPriceStr);
    if (isNaN(np) || np <= 0) return;

    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, price: np } : p))
    );
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you absolutely sure you want to remove this menu item from FAST Burgers list?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // --- Order status cycles ---
  const handleOrderStatusShift = (orderId: string, nextStatus: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Do you want to wipe this order from the registry list?')) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  // --- Promo/Banner Handlers ---
  const handleAddPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoTitle.trim() || !newPromoDesc.trim()) return;

    const promoBg = newPromoBg.trim() || 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=1000&auto=format&fit=crop&q=80';

    const item: Promotion = {
      id: 'promo-' + Date.now(),
      title: newPromoTitle,
      description: newPromoDesc,
      badge: newPromoBadge || 'Special Promo',
      bgImage: promoBg,
      code: newPromoCode.trim().toUpperCase() || undefined,
    };

    setPromotions(prev => [item, ...prev]);
    setNewPromoTitle('');
    setNewPromoDesc('');
    setNewPromoBadge('');
    setNewPromoCode('');
    setNewPromoBg('');
    setPromoSuccess(true);
    setTimeout(() => setPromoSuccess(false), 2500);
  };

  const handleDeletePromo = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  // --- Save profile changes ---
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    BRAND_INFO.owner = owner;
    BRAND_INFO.contactNumbers[0] = phone1;
    BRAND_INFO.contactNumbers[1] = phone2;
    BRAND_INFO.address = storeAddress;
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-8 border-t border-orange-500/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Admin backoffice titles */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-900 pb-6 mb-8">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="p-3 bg-amber-500 text-black rounded-2xl">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">FAST BURGERZ BACKOFFICE</h2>
              <p className="text-xs text-amber-500 font-mono tracking-widest leading-none mt-1">
                SECURE ADMINISTRATION CONSOLE ● POWERED BY M.D.M. IRFAN
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-black text-gray-400 hover:bg-neutral-900 hover:text-white transition-all cursor-pointer"
          >
            ← Exit Admin Terminal
          </button>
        </div>

        {/* Dashboard quick tabs bar */}
        <div className="flex flex-wrap gap-2 mb-8 bg-neutral-900 p-2 rounded-xl border border-neutral-850 justify-center sm:justify-start">
          {[
            { id: 'analytics', label: 'Dashboard & Analytics', icon: <BarChart3 size={15} /> },
            { id: 'orders', label: `Pending Orders (${stats.pendingCount})`, icon: <Clock size={15} /> },
            { id: 'menu', label: 'Menu List Settings', icon: <Package size={15} /> },
            { id: 'promotions', label: 'Promotional Ad Banners', icon: <BellRing size={15} /> },
            { id: 'profile', label: 'Owner Profile', icon: <User size={15} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black'
                  : 'text-gray-400 hover:text-white hover:bg-neutral-950/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* --- Tab Content Grid --- */}

        {/* 1. ANALYTICS PANEL */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-black tracking-wider text-white border-b border-neutral-900 pb-2">
              REAL-TIME KITCHEN METRICS
            </h3>
            
            {/* Quick score widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-850 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase font-black">Gross Sales Revenue</span>
                  <p className="text-2xl font-black text-orange-400 mt-1">Rs. {stats.totalSales}</p>
                </div>
                <div className="h-10 w-10 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center border border-orange-500/20">
                  <DollarSign size={20} />
                </div>
              </div>

              <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-850 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase font-black">Pending Orders</span>
                  <p className="text-2xl font-black text-amber-500 mt-1">{stats.pendingCount}</p>
                </div>
                <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center border border-amber-500/20">
                  <Clock size={20} />
                </div>
              </div>

              <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-850 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase font-black">Items on Menu Grid</span>
                  <p className="text-2xl font-black text-white mt-1">{stats.itemsCount}</p>
                </div>
                <div className="h-10 w-10 bg-neutral-950 text-slate-400 rounded-lg flex items-center justify-center border border-neutral-800">
                  <Package size={20} />
                </div>
              </div>

              <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-850 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase font-black">Delivered Deliveries</span>
                  <p className="text-2xl font-black text-green-500 mt-1">{stats.deliveredCount}</p>
                </div>
                <div className="h-10 w-10 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center border border-green-500/20">
                  <TrendingUp size={20} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category distribution panel */}
              <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-850 space-y-4">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Product Inventory Distribution</h4>
                <div className="space-y-3">
                  {Object.entries(stats.categoryShare).map(([cat, countVal]) => {
                    const count = countVal as number;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold font-mono">
                          <span className="capitalize text-gray-300">{cat}</span>
                          <span className="text-amber-400">{count} items ({Math.round((count / stats.itemsCount) * 100)}%)</span>
                        </div>
                        <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500"
                            style={{ width: `${(count / stats.itemsCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick instructions and developer guide to mock sales */}
              <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-850 flex flex-col justify-center space-y-3">
                <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">💡 SIMULATION ASSIST:</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                  This panel is powered by live, active React client state synchronizing instantly with your browser's <strong className="text-white">localStorage</strong> scope.
                </p>
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                  To test placing an order, add products to the shopping basket, input the delivery addresses, check out, and place them. Then come back here to cycle status codes!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-black tracking-wider text-white border-b border-neutral-900 pb-2">
              LOCAL ORDER DISPATCH REGISTRY
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-neutral-900/50 rounded-2xl border border-dashed border-neutral-800 text-xs font-bold text-gray-500">
                🫙 No orders processed yet. Try placing one through the menu shopping basket!
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-neutral-900 border border-neutral-850 flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center"
                    id={`admin-order-${order.id}`}
                  >
                    {/* Order Meta details */}
                    <div className="space-y-2 max-w-lg">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-amber-400 font-mono bg-neutral-950 border border-neutral-800 px-2.5 py-1 rounded">
                          TRACK: {order.trackCode}
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold">{order.placedAt}</span>
                        <span className="text-[10px] bg-neutral-950 border border-neutral-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                          {order.paymentMethod}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-white">
                        Customer: <span className="text-orange-400">{order.customerName}</span> ({order.customerPhone})
                      </h4>

                      <p className="text-xs text-gray-400 font-bold leading-relaxed">
                        📍 Deliver Address: {order.deliveryAddress}
                      </p>

                      <div className="text-xs text-gray-300 bg-neutral-950 p-2.5 rounded border border-neutral-850">
                        <span className="font-mono text-gray-500 text-[10px] block mb-1">ITEMS PORTFOLIO:</span>
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between font-mono text-[11px]">
                            <span>{it.name} (x{it.quantity})</span>
                            <span>Rs. {it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <p className="text-[11px] text-red-400 italic font-semibold">
                          📌 Notes: "{order.notes}"
                        </p>
                      )}
                    </div>

                    {/* Order action elements */}
                    <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto items-stretch sm:items-center">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-[10px] text-gray-500 font-mono text-center mb-1">CYCLE STATUS</span>
                        <div className="flex flex-wrap gap-1">
                          {(['Pending', 'Confirmed', 'Cooking', 'Out for Delivery', 'Delivered', 'Cancelled'] as const).map(st => (
                            <button
                              key={st}
                              onClick={() => handleOrderStatusShift(order.id, st)}
                              className={`px-2.5 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${
                                order.status === st
                                  ? 'bg-orange-500 text-black font-black'
                                  : 'bg-neutral-950 hover:bg-neutral-800 text-gray-400 border border-neutral-850'
                              }`}
                            >
                              {st === 'Out for Delivery' ? 'Onway' : st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 justify-center rounded-lg bg-neutral-950 hover:bg-rose-500 hover:text-white border border-neutral-850 transition-all flex items-center space-x-1"
                        title="Wipe Order Record"
                      >
                        <Trash2 size={13} />
                        <span className="sm:hidden text-xs">Delete Record</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Create Menu Product Form */}
            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-850 space-y-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center">
                <PlusCircle size={16} className="text-orange-500 mr-2" /> CREATE NEW FOOD PRODUCT
              </h4>

              {menuSuccess && (
                <div className="bg-green-600/15 border border-green-500/20 text-green-400 p-3 rounded-lg text-xs font-black">
                  🎉 Product successfully added to the active FAST Burgerz menu lineup!
                </div>
              )}

              <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Garlic Mayo Double Burger"
                      className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Price (Rs.)</label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="e.g. 550"
                      className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as any)}
                      className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 px-3 py-2"
                    >
                      <option value="burgers">Burgers</option>
                      <option value="fries">Fries</option>
                      <option value="wraps">Wraps & Shawarma</option>
                      <option value="wings">Crispy Wings</option>
                      <option value="sandwiches">Sandwiches</option>
                      <option value="drinks">Drinks</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Unsplash Product Image URL (Optional)</label>
                    <input
                      type="url"
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Keywords/Tags (Comma separated)</label>
                    <input
                      type="text"
                      value={newProdTags}
                      onChange={(e) => setNewProdTags(e.target.value)}
                      placeholder="e.g. Spicy, Cheese, Double Beef"
                      className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Food Description</label>
                  <textarea
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Describe ingredients, meat purity, crunch toppings, sauce layering details..."
                    rows={2}
                    className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 p-3"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-extrabold rounded-lg text-xs tracking-wider transition-all"
                >
                  PUBLISH PRODUCT TO GRID
                </button>
              </form>
            </div>

            {/* List and Modify existing items */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                CURRENT MENU LINEUP ({products.length})
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="manage-menu-grid">
                {products.map(p => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center gap-3 justify-between"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-white truncate">{p.name}</h4>
                        <span className="text-[10px] text-gray-500 capitalize">{p.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1.5 text-xs">
                        <span>Rs.</span>
                        <input
                          type="number"
                          value={p.price}
                          onChange={(e) => handlePriceChange(p.id, e.target.value)}
                          className="w-16 bg-neutral-950 text-center font-black rounded border border-neutral-800 py-1 text-xs text-orange-400 font-mono"
                          title="Click to edit Price"
                        />
                      </div>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-all active:scale-95"
                        title="Delete Product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 4. PROMOTIONS CONTROLLER */}
        {activeTab === 'promotions' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Create Promo Banner Form */}
            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-850 space-y-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center">
                <PlusCircle size={16} className="text-orange-500 mr-2" /> ADD NEW ADVERTISEMENT BANNER
              </h4>

              {promoSuccess && (
                <div className="bg-green-600/15 border border-green-500/20 text-green-400 p-3 rounded-lg text-xs font-black">
                  🎉 Advertising banner successfully drafted into today's carousel deals!
                </div>
              )}

              <form onSubmit={handleAddPromotion} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Promo/Campaign Title</label>
                    <input
                      type="text"
                      required
                      value={newPromoTitle}
                      onChange={(e) => setNewPromoTitle(e.target.value)}
                      placeholder="e.g. MIDNIGHT SOUP DEALS"
                      className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Tag/Badge Value</label>
                    <input
                      type="text"
                      value={newPromoBadge}
                      onChange={(e) => setNewPromoBadge(e.target.value)}
                      placeholder="e.g. Save 15% / Limited Time"
                      className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Coupon System Code (Optional)</label>
                    <input
                      type="text"
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value)}
                      placeholder="e.g. HELLOFAST"
                      className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 px-3 py-2 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Background Image URL (Optional)</label>
                    <input
                      type="url"
                      value={newPromoBg}
                      onChange={(e) => setNewPromoBg(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Advertisement Tagline / Description</label>
                  <input
                    type="text"
                    required
                    value={newPromoDesc}
                    onChange={(e) => setNewPromoDesc(e.target.value)}
                    placeholder="Brief sentence outlining savings, items, or delivery hours..."
                    className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 px-3 py-2"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-extrabold rounded-lg text-xs tracking-wider transition-all"
                >
                  PUBLISH CAROUSEL PROMO
                </button>
              </form>
            </div>

            {/* List current active flags */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                ACTIVE ADVERTISING BANNERS ({promotions.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="manage-promos-grid">
                {promotions.map(promo => (
                  <div
                    key={promo.id}
                    className="p-4 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[9px] bg-orange-500 text-black px-1.5 py-0.5 rounded uppercase font-black font-mono">
                        {promo.badge}
                      </span>
                      <h4 className="text-xs font-black text-white mt-1.5">{promo.title}</h4>
                      <p className="text-[11px] text-gray-400 font-semibold line-clamp-1">{promo.description}</p>
                    </div>

                    <button
                      onClick={() => handleDeletePromo(promo.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-all active:scale-95 flex-shrink-0"
                      title="Wipe Promo Banner"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 5. PROFILE MANAGER */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-black tracking-wider text-white border-b border-neutral-900 pb-2">
              RESTAURANT BRAND PROFILE MANAGER
            </h3>

            {profileSuccess && (
              <div className="bg-green-600/15 border border-green-500/20 text-green-400 p-3 rounded-lg text-xs font-black">
                🎉 Owner demographics and telephone indexes updated successfully across FAST Burgerz channels!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="bg-neutral-900 p-6 rounded-2xl border border-neutral-850 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Owner Name</label>
                  <input
                    type="text"
                    required
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 px-3 py-2 text-xs font-black"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Official Hot Line Number 1</label>
                  <input
                    type="text"
                    required
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
                    className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 px-3 py-2 text-xs font-mono font-black text-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Official Hot Line Number 2</label>
                  <input
                    type="text"
                    required
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
                    className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 px-3 py-2 text-xs font-mono font-black text-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Store Physical Address (Hostel Coordinates)</label>
                <input
                  type="text"
                  required
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="w-full bg-neutral-950 text-white rounded-lg border border-neutral-800 px-3 py-2"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-extrabold rounded-lg text-xs tracking-wider transition-all"
              >
                SAVE BRAND INFORMATION
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
