import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, Ticket, Check, ShieldCheck } from 'lucide-react';
import { CartItem, Coupon, Order } from '../types';
import { BRAND_INFO, INITIAL_COUPONS } from '../data';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateCartQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  onPlaceOrder: (order: Order) => void;
}

export default function ShoppingCart({
  isOpen,
  onClose,
  cartItems,
  updateCartQty,
  removeFromCart,
  onPlaceOrder,
}: ShoppingCartProps) {
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  // Settle Shipping & Checkout Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Easypaisa' | 'JazzCash'>('Cash on Delivery');
  const [orderNotes, setOrderNotes] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  // Billing Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  }, [cartItems]);

  const discount = useMemo(() => {
    if (!activeCoupon) return 0;
    if (subtotal < activeCoupon.minAmount) return 0;

    if (activeCoupon.discountType === 'fixed') {
      return activeCoupon.discountValue;
    } else {
      return Math.round((subtotal * activeCoupon.discountValue) / 100);
    }
  }, [activeCoupon, subtotal]);

  const deliveryCharges = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= BRAND_INFO.freeDeliveryThreshold ? 0 : BRAND_INFO.deliveryCharges;
  }, [subtotal]);

  const total = useMemo(() => {
    if (subtotal === 0) return 0;
    return Math.max(0, subtotal - discount + deliveryCharges);
  }, [subtotal, discount, deliveryCharges]);

  // Handle Coupon Apply
  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const coupon = INITIAL_COUPONS.find(c => c.code === code);
    if (!coupon) {
      setCouponError('Invalid Coupon Code');
      setActiveCoupon(null);
      return;
    }

    if (subtotal < coupon.minAmount) {
      setCouponError(`Minimum order amount for this coupon is Rs. ${coupon.minAmount}`);
      setActiveCoupon(null);
      return;
    }

    setActiveCoupon(coupon);
  };

  // Settle Direct Placement and Auto compile prefilled WhatsApp Order payload!
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) return;

    setIsPlacing(true);

    const trackCode = 'FB-' + Math.floor(100000 + Math.random() * 900000);
    const orderId = 'ORD-' + Date.now().toString().slice(-6);

    const newOrder: Order = {
      id: orderId,
      customerName,
      customerPhone,
      deliveryAddress,
      items: cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      subtotal,
      discount,
      deliveryCharges,
      total,
      status: 'Pending',
      paymentMethod,
      placedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      notes: orderNotes,
      trackCode,
    };

    // Fast compile text representation
    let message = `*🍔 FAST BURGERZ ORDER PLACEMENT*\n`;
    message += `===============================\n`;
    message += `*Order Reference:* ${trackCode}\n`;
    message += `*Customer:* ${customerName}\n`;
    message += `*Contact:* ${customerPhone}\n`;
    message += `*Location Deliver To:* ${deliveryAddress}\n`;
    message += `*Payment Mode:* ${paymentMethod}\n`;
    if (orderNotes.trim()) {
      message += `*Special Instructions:* ${orderNotes}\n`;
    }
    message += `===============================\n`;
    message += `*ORDER ITEMS:*\n`;
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. _${item.product.name}_ (x${item.quantity}) - Rs. ${item.product.price * item.quantity}\n`;
    });
    
    message += `===============================\n`;
    message += `*Subtotal:* Rs. ${subtotal}\n`;
    if (discount > 0) {
      message += `*Coupon Discount:* -Rs. ${discount} (${activeCoupon?.code})\n`;
    }
    message += `*Delivery Charges:* Rs. ${deliveryCharges}\n`;
    message += `===============================\n`;
    message += `*TOTAL AMMOUNT:* *Rs. ${total}*\n\n`;
    message += `_Hello FAST Burgerz, please cook and confirm my order above. Thank you!_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encodedMessage}`;

    // Callback to parent index to push order to store
    onPlaceOrder(newOrder);

    setTimeout(() => {
      // Direct opening tab safely
      window.open(whatsappUrl, '_blank');
      setIsPlacing(false);
      onClose();
      
      // Clear checking states
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryAddress('');
      setOrderNotes('');
      setActiveCoupon(null);
      setCouponCode('');
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop mask overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-xs"
            id="cart-overlay-mask"
          />

          {/* Cart Drawer Panel Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 200 }}
            className="fixed top-0 right-0 z-[200] h-full w-full max-w-md bg-editorial-darker border-l border-editorial shadow-2xl flex flex-col justify-between rounded-none"
            id="cart-drawer-panel"
          >
            {/* Header Column details (Editorial header style) */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-editorial bg-editorial-dark">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-extrabold text-white tracking-[0.2em] uppercase">BASKET REGISTRY</span>
                <span className="bg-editorial-orange text-black px-2 py-0.5 rounded-none text-[9px] font-mono font-black select-none">
                  {cartItems.length} ITEMS
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-none hover:bg-white/5 border border-editorial text-white/50 hover:text-white transition-all"
                id="cart-drawer-close"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable Form & Items Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 space-y-4" id="empty-cart-view">
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white/40">Your basket is empty</h3>
                  <p className="text-xs text-white/30 max-w-xs mx-auto leading-relaxed">
                    Browse our handcrafted visual catalog to append pristine sated burgers and sides.
                  </p>
                  <button
                    onClick={onClose}
                    className="text-[10px] font-extrabold uppercase tracking-[0.18em] border border-editorial-orange text-editorial-orange px-4 py-2 hover:bg-editorial-orange hover:text-black transition-all rounded-none cursor-pointer mt-4"
                  >
                    Start Browsing Items
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Food Items list stack (Lookbook lists style) */}
                  <div className="space-y-2" id="basket-items-list">
                    {cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-none bg-editorial-dark border border-editorial"
                        id={`cart-item-${item.product.id}`}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover flex-shrink-0 border border-editorial rounded-none filter grayscale hover:grayscale-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white uppercase tracking-tight truncate">{item.product.name}</h4>
                          <span className="text-xs text-editorial-orange font-mono">Rs. {item.product.price}</span>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center space-x-2 bg-editorial-darker px-1.5 py-0.5 border border-editorial">
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                            className="text-white/40 hover:text-white active:scale-90"
                            id={`cart-qty-dec-${item.product.id}`}
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-bold text-white font-mono min-w-[12px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                            className="text-white/40 hover:text-white active:scale-95"
                            id={`cart-qty-inc-${item.product.id}`}
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        {/* Removal button */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 border border-editorial hover:border-red-500/20 text-white/30 hover:text-red-400 aspect-square rounded-none transition-all"
                          id={`cart-item-remove-${item.product.id}`}
                          title="Remove item"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Promo Coupons Section */}
                  <div className="p-4 bg-editorial-dark border border-editorial space-y-3 rounded-none">
                    <label className="block text-[10px] font-extrabold text-white/55 uppercase tracking-[0.2em] flex items-center">
                      <Ticket size={11} className="text-editorial-orange mr-1.5" /> Promo Voucher Code
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponError('');
                        }}
                        placeholder="HOSTELDEAL, WELCOME50"
                        className="flex-1 bg-editorial-darker text-white rounded-none border border-editorial px-3 py-1.5 text-xs font-mono uppercase focus:outline-none focus:border-editorial-orange/50 placeholder:text-white/20"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 bg-white text-black hover:bg-editorial-orange hover:text-black text-[10px] tracking-widest uppercase font-extrabold rounded-none transition-all"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-[9px] text-red-400 font-bold tracking-wide font-mono uppercase">{couponError}</p>}
                    {activeCoupon && (
                      <div className="flex items-center justify-between text-[10px] font-bold text-green-400 bg-green-500/5 border border-green-500/15 p-2 rounded-none">
                        <span>🏷️ '{activeCoupon.code}' Applied (-Rs. {discount})</span>
                        <X
                          size={11}
                          className="cursor-pointer hover:text-red-400"
                          onClick={() => {
                            setActiveCoupon(null);
                            setCouponCode('');
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Shipping Info Form */}
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4" id="checkout-shipping-form">
                    <h3 className="text-[10px] font-extrabold text-white uppercase tracking-[0.2em] border-b border-editorial pb-2">
                      COURIER DELIVER TO COORDINATES
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Your Name / Hostel Room"
                          className="w-full bg-editorial-darker text-white rounded-none border border-editorial px-3 py-2 text-xs font-semibold focus:outline-none focus:border-editorial-orange/50"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Contact phone coordinate (e.g. 03xx-xxxxxxx)"
                          className="w-full bg-editorial-darker text-white rounded-none border border-editorial px-3 py-2 text-xs font-mono focus:outline-none focus:border-editorial-orange/50"
                        />
                      </div>
                      <div>
                        <textarea
                          required
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Specific Location coordinates (Hostel Room, Soneri Bank Block, Bharakahu, Islamabad)"
                          rows={2}
                          className="w-full bg-editorial-darker text-white rounded-none border border-editorial p-3 text-xs font-semibold focus:outline-none focus:border-editorial-orange/50 placeholder:text-white/20"
                        />
                      </div>

                      {/* Payment Mode Selector Grid */}
                      <div>
                        <label className="block text-[8px] font-extrabold text-white/40 uppercase tracking-[0.2em] mb-1.5">
                          Payment mode parameters / index
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {['Cash on Delivery', 'Easypaisa', 'JazzCash'].map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method as any)}
                              className={`py-2 rounded-none text-[8px] font-bold text-center tracking-widest uppercase border transition-all ${
                                paymentMethod === method
                                  ? 'bg-editorial-orange text-black border-editorial-orange font-extrabold'
                                  : 'bg-editorial-darker text-white/50 border-editorial hover:text-white'
                              }`}
                            >
                              {method === 'Cash on Delivery' ? 'Cash/COD' : method}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="Special instructions: (e.g., extra spicy, no onion)"
                          className="w-full bg-editorial-darker text-white rounded-none border border-editorial px-3 py-2 text-xs font-semibold focus:outline-none focus:border-editorial-orange/50"
                        />
                      </div>
                    </div>

                    {/* Slashed-price high contrast lookbook total list */}
                    <div className="bg-editorial-dark p-4 rounded-none border border-editorial space-y-2 text-[11px] font-mono uppercase tracking-wider text-white/60">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span className="text-white">Rs. {subtotal}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-rose-400 font-extrabold">
                          <span>Applied Savings:</span>
                          <span>-Rs. {discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Courier Tariff:</span>
                        <span>{deliveryCharges === 0 ? <strong className="text-green-400 font-bold">FREE</strong> : `Rs. ${deliveryCharges}`}</span>
                      </div>
                      <hr className="border-editorial my-1" />
                      <div className="flex justify-between text-white font-extrabold text-xs">
                        <span>Grand Total:</span>
                        <span className="text-editorial-gold font-black underline decoration-editorial-orange">Rs. {total}</span>
                      </div>
                      {subtotal < BRAND_INFO.minDeliveryOrder && (
                        <p className="text-[8px] text-editorial-orange font-extrabold text-center mt-2 tracking-widest uppercase">
                          ⚠️ Minimum threshold requires Rs. {BRAND_INFO.minDeliveryOrder}
                        </p>
                      )}
                    </div>

                    {/* Checkout Button */}
                    <button
                      type="submit"
                      disabled={subtotal < BRAND_INFO.minDeliveryOrder || isPlacing}
                      className={`w-full py-3.5 rounded-none text-[10px] font-extrabold uppercase tracking-[0.22em] flex items-center justify-center transition-all ${
                        subtotal < BRAND_INFO.minDeliveryOrder
                          ? 'bg-editorial-darker border border-editorial text-white/20 cursor-not-allowed'
                          : 'bg-white border border-transparent text-black hover:bg-editorial-orange hover:text-black cursor-pointer'
                      }`}
                      id="submit-order-checkout"
                    >
                      <span>{isPlacing ? 'TRANSMITTING REQS TO WHATSAPP...' : 'SEND ORDER payload via WHATSAPP 💬'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Footer trust badge */}
            <div className="p-4 bg-editorial-darker border-t border-editorial text-center flex items-center justify-center space-x-1.5 text-[8px] font-mono uppercase tracking-widest text-white/30 select-none">
              <ShieldCheck size={10} className="text-editorial-orange" />
              <span>Direct encrypted coordinates with FAST Burgerz Dispatch</span>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
