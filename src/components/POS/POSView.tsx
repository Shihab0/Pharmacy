import React, { useState, useMemo } from 'react';
import { Product, CartItem, Customer, SaleTransaction, Role, ProductCategory, AnimalTarget } from '../../types';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  AlertTriangle,
  Clock,
  User,
  CreditCard,
  CheckCircle2,
  Tag,
  Stethoscope,
  ShieldCheck,
  Smartphone,
  Banknote,
  Receipt
} from 'lucide-react';

interface POSViewProps {
  products: Product[];
  customers: Customer[];
  currentRole: Role;
  onProcessSale: (transaction: SaleTransaction) => void;
}

export const POSView: React.FC<POSViewProps> = ({
  products,
  customers,
  currentRole,
  onProcessSale,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAnimal, setSelectedAnimal] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Checkout details
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Mobile Banking' | 'Card' | 'Credit / Due'>('Cash');

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesAnimal = selectedAnimal === 'All' || p.targetAnimal === selectedAnimal;

      return matchesSearch && matchesCategory && matchesAnimal;
    });
  }, [products, searchQuery, selectedCategory, selectedAnimal]);

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prevCart; // Cannot exceed stock
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1, discountPercentage: 0 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.product.stock) return item; // Don't allow over stock
            if (newQty <= 0) return null; // Remove item
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountAmount(0);
    setTaxAmount(0);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => {
    const itemTotal = item.product.sellingPrice * item.quantity;
    const itemDiscount = itemTotal * ((item.discountPercentage || 0) / 100);
    return sum + (itemTotal - itemDiscount);
  }, 0);
  const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount);

  // Is product expiring soon (within 60 days)
  const isExpiringSoon = (expiryDateStr: string) => {
    const today = new Date();
    const expiry = new Date(expiryDateStr);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 60;
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Customer resolution
    let custName = 'সাধারণ খামারি (কাস্টমার)';
    let custPhone = '';
    let custId = undefined;

    if (selectedCustomerId) {
      const found = customers.find((c) => c.id === selectedCustomerId);
      if (found) {
        custName = found.name;
        custPhone = found.phone;
        custId = found.id;
      }
    } else if (guestName.trim()) {
      custName = guestName.trim();
      custPhone = guestPhone.trim();
    }

    const saleItems = cart.map((item) => {
      const itemTotal = item.product.sellingPrice * item.quantity;
      const itemDiscount = itemTotal * ((item.discountPercentage || 0) / 100);
      return {
        productId: item.product.id,
        productName: item.product.name,
        genericName: item.product.genericName,
        unit: item.product.unit,
        quantity: item.quantity,
        unitSellingPrice: item.product.sellingPrice,
        unitCostPrice: item.product.costPrice,
        totalPrice: itemTotal - itemDiscount,
      };
    });

    const totalCost = saleItems.reduce((sum, item) => sum + item.unitCostPrice * item.quantity, 0);
    const netProfit = grandTotal - totalCost;

    const transaction: SaleTransaction = {
      id: `tx-${Date.now()}`,
      invoiceNo: `INV-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      customerId: custId,
      customerName: custName,
      customerPhone: custPhone,
      items: saleItems,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      grandTotal,
      totalCost,
      netProfit,
      paymentMethod,
      handledByRole: currentRole,
      staffName: currentRole === 'Staff' ? 'স্টাফ কাউন্টার' : 'সুপার এডমিন',
    };

    onProcessSale(transaction);
    clearCart();
    setSelectedCustomerId('');
    setGuestName('');
    setGuestPhone('');
  };

  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
              পয়েন্ট অব সেল (ক্যাশ মেমো)
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              দ্রুত ঔষধ নির্বাচন করুন এবং বিল মেমো তৈরি করুন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            কার্টে আইটেম: <strong className="text-emerald-700 font-black">{cart.length} টি</strong>
          </span>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-xl font-bold transition border border-red-200"
            >
              কার্ট খালি করুন
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Side: Product Selection Grid */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          {/* Search & Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="মেডিসিনের নাম, জেনেরিক নাম বা ক্যাটাগরি লিখুন..."
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium text-slate-900"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1">ক্যাটাগরি:</span>
              {['All', 'Medicine', 'Vaccine', 'Feed', 'Supplement', 'Equipment'].map((cat) => {
                const banglaCat: Record<string, string> = {
                  All: 'সব ক্যাটাগরি',
                  Medicine: 'মেডিসিন',
                  Vaccine: 'ভ্যাকসিন',
                  Feed: 'ফিড / খাবার',
                  Supplement: 'সাপ্লিমেন্ট',
                  Equipment: 'যন্ত্রপাতি',
                };
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {banglaCat[cat] || cat}
                  </button>
                );
              })}
            </div>

            {/* Animal Target Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1">প্রাণী:</span>
              {['All', 'Cattle', 'Poultry', 'Goat/Sheep', 'Pet', 'Aqua/All'].map((animal) => {
                const banglaAnimal: Record<string, string> = {
                  All: 'সব প্রাণী',
                  Cattle: 'গরু / মহিষ',
                  Poultry: 'পোল্ট্রি / মুরগি',
                  'Goat/Sheep': 'ছাগল / ভেড়া',
                  Pet: 'পোষা প্রাণী',
                  'Aqua/All': 'মাছ / অন্যান্য',
                };
                return (
                  <button
                    key={animal}
                    onClick={() => setSelectedAnimal(animal)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                      selectedAnimal === animal
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {banglaAnimal[animal] || animal}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                <p className="text-slate-500 font-bold text-xs">কোন ওষুধ খুঁজে পাওয়া যায়নি</p>
                <p className="text-[11px] text-slate-400">সার্চ ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isOutOfStock = p.stock <= 0;
                const isLowStock = p.stock > 0 && p.stock <= p.minStockAlert;
                const isExpiring = isExpiringSoon(p.expiryDate);
                const cartItem = cart.find((item) => item.product.id === p.id);
                const inCartCount = cartItem ? cartItem.quantity : 0;

                return (
                  <button
                    key={p.id}
                    disabled={isOutOfStock}
                    onClick={() => addToCart(p)}
                    className={`text-left p-3.5 rounded-2xl border transition shadow-xs flex flex-col justify-between group relative overflow-hidden active:scale-98 ${
                      isOutOfStock
                        ? 'opacity-50 bg-slate-50 border-slate-200 cursor-not-allowed'
                        : inCartCount > 0
                        ? 'bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Top Animal Badge, Cart Count Badge & Stock Pill */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
                          {p.targetAnimal}
                        </span>

                        <div className="flex items-center gap-1">
                          {inCartCount > 0 && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs animate-in zoom-in-95 flex items-center gap-1">
                              <ShoppingCart className="w-2.5 h-2.5" />
                              <span>{inCartCount} টি</span>
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              isOutOfStock
                                ? 'bg-red-100 text-red-700'
                                : isLowStock
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isOutOfStock ? 'স্টক শেষ' : `স্টক: ${p.stock} ${p.unit}`}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-700 transition truncate">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 truncate font-medium">{p.genericName}</p>

                      {p.dosageInfo && (
                        <p className="text-[10px] text-emerald-700 bg-emerald-50 p-1 rounded-md mt-1.5 font-medium truncate">
                          ডোজ: {p.dosageInfo}
                        </p>
                      )}

                      {/* Prominent Cart Quantity Indicator Bar */}
                      {inCartCount > 0 && (
                        <div className="mt-2 text-xs font-extrabold text-emerald-900 bg-emerald-100/90 border border-emerald-300 p-1.5 rounded-xl flex items-center justify-between shadow-2xs">
                          <span className="flex items-center gap-1">
                            <ShoppingCart className="w-3.5 h-3.5 text-emerald-700" />
                            <span>কার্টে যুক্ত:</span>
                          </span>
                          <span className="bg-emerald-700 text-white px-2 py-0.5 rounded-lg text-xs font-black">
                            {inCartCount} {p.unit}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price and Expiry Footer */}
                    <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">বিক্রয় মূল্য</div>
                        <div className="text-base font-extrabold text-emerald-700">
                          ৳{p.sellingPrice.toFixed(2)}
                        </div>
                      </div>

                      <div className="text-right">
                        {isExpiring && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-red-600">
                            <Clock className="w-3 h-3" />
                            <span>মেয়াদ কম</span>
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 block font-mono">
                          মেয়াদ: {p.expiryDate}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Cart & Bill Invoice Summary */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 space-y-4 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <h2 className="font-extrabold text-slate-900 text-base">বিক্রয় মেমো (বিল)</h2>
            </div>
            <span className="text-xs text-slate-500 font-semibold">{cart.reduce((s, i) => s + i.quantity, 0)} টি আইটেম</span>
          </div>

          {/* Cart Item List */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs space-y-1">
                <ShoppingCart className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-bold text-slate-600">কার্ট সম্পূর্ণ খালি</p>
                <p className="text-[11px]">বাম পাশ থেকে মেডিসিন সিলেক্ট করুন</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-2 text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-slate-500">
                      ৳{item.product.sellingPrice.toFixed(2)} x {item.quantity} {item.product.unit}
                    </p>
                  </div>

                  {/* Qty +/- Controls */}
                  <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1 hover:bg-slate-100 text-slate-600 rounded-lg"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-extrabold text-slate-800 text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="p-1 hover:bg-slate-100 text-slate-600 rounded-lg"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Price & Remove */}
                  <div className="text-right">
                    <div className="font-bold text-slate-900">
                      ৳{(item.product.sellingPrice * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[10px] text-red-500 hover:text-red-700 font-semibold"
                    >
                      মুছুন
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Customer Link Options */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <label className="font-bold text-slate-700 block text-[11px]">
              খামারি / কাস্টমার নির্বাচন (ঐচ্ছিক):
            </label>

            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                if (e.target.value) {
                  setGuestName('');
                  setGuestPhone('');
                }
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
            >
              <option value="">সাধারণ খামারি (ওয়াক-ইন কাস্টমার)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) - বাকি: ৳{c.dueBalance}
                </option>
              ))}
            </select>

            {!selectedCustomerId && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="খামারির নাম"
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="মোবাইল নম্বর"
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
            <label className="font-bold text-slate-700 block text-[11px]">পেমেন্ট মেথড:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'Cash', label: 'নগদ ক্যাশ', icon: Banknote },
                { id: 'Mobile Banking', label: 'বিকাশ/নগদ', icon: Smartphone },
                { id: 'Card', label: 'কার্ড পেমেন্ট', icon: CreditCard },
                { id: 'Credit / Due', label: 'বাকিতে বিক্রি', icon: Tag },
              ].map((pm) => {
                const Icon = pm.icon;
                const isSel = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition ${
                      isSel
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{pm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Discount & Tax Adjustment */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  ডিসকাউন্ট (৳):
                </label>
                <input
                  type="number"
                  min="0"
                  value={discountAmount || ''}
                  onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  ট্যাক্স / ভ্যাট (৳):
                </label>
                <input
                  type="number"
                  min="0"
                  value={taxAmount || ''}
                  onChange={(e) => setTaxAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>
            </div>

            {/* Bill Summary Rows */}
            <div className="pt-3 border-t border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>সাবটোটাল:</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>ডিসকাউন্ট ছাড়:</span>
                  <span>-৳{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {taxAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>ট্যাক্স:</span>
                  <span>+৳{taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>সর্বমোট বিল:</span>
                <span className="text-emerald-700">৳{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Complete Sale Button */}
            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold rounded-2xl transition shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 active:scale-98 text-sm cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>বিল সম্পন্ন করুন (৳{grandTotal.toFixed(2)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
