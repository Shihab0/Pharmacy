import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, AnimalTarget, Role } from '../../types';
import { isLowStock, isOutOfStock, isExpiringSoon } from '../../utils/stockUtils';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  X,
  Layers,
  LayoutGrid,
  List,
  RefreshCw,
  PlusCircle,
  MinusCircle,
  AlertCircle,
  BarChart2,
  DollarSign
} from 'lucide-react';

interface InventoryViewProps {
  products: Product[];
  currentRole: Role;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  currentRole,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [alertFilter, setAlertFilter] = useState<'All' | 'Low Stock' | 'Out of Stock' | 'Expiring Soon'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Quick Stock Adjust Modal State
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
  const [adjustReason, setAdjustReason] = useState<string>('নতুন স্টক ক্রয় / রিস্টক');

  // Delete Confirmation State
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<{
    name: string;
    genericName: string;
    category: ProductCategory;
    targetAnimal: AnimalTarget;
    costPrice: number;
    sellingPrice: number;
    stock: number;
    minStockAlert: number;
    unit: string;
    expiryDate: string;
    batchNumber: string;
    dosageInfo: string;
    supplier: string;
  }>({
    name: '',
    genericName: '',
    category: 'Medicine',
    targetAnimal: 'Cattle',
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    minStockAlert: 10,
    unit: '১০০মি.লি. ফাইল',
    expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
    batchNumber: 'BATCH-01',
    dosageInfo: '',
    supplier: '',
  });

  const isStaff = currentRole === 'Staff';

  // Helper for Expiring Soon (within 60 days)
  const isExpiringSoon = (expiryDateStr: string) => {
    if (!expiryDateStr) return false;
    const today = new Date();
    const expiry = new Date(expiryDateStr);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 60;
  };

  // Inventory Metrics
  const metrics = useMemo(() => {
    let totalItems = products.length;
    let totalStockQty = 0;
    let totalCostValuation = 0;
    let totalRetailValuation = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let expiringCount = 0;

    products.forEach((p) => {
      totalStockQty += p.stock;
      totalCostValuation += p.stock * p.costPrice;
      totalRetailValuation += p.stock * p.sellingPrice;

      if (isOutOfStock(p)) {
        outOfStockCount++;
      } else if (isLowStock(p)) {
        lowStockCount++;
      }

      if (isExpiringSoon(p.expiryDate)) {
        expiringCount++;
      }
    });

    return {
      totalItems,
      totalStockQty,
      totalCostValuation,
      totalRetailValuation,
      lowStockCount,
      outOfStockCount,
      expiringCount,
    };
  }, [products]);

  // Filtered List
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.genericName.toLowerCase().includes(q) ||
        p.batchNumber.toLowerCase().includes(q) ||
        (p.supplier && p.supplier.toLowerCase().includes(q));

      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;

      let matchesAlert = true;
      if (alertFilter === 'Low Stock') {
        matchesAlert = p.stock > 0 && p.stock <= p.minStockAlert;
      } else if (alertFilter === 'Out of Stock') {
        matchesAlert = p.stock <= 0;
      } else if (alertFilter === 'Expiring Soon') {
        matchesAlert = isExpiringSoon(p.expiryDate);
      }

      return matchesSearch && matchesCat && matchesAlert;
    });
  }, [products, searchQuery, categoryFilter, alertFilter]);

  // Modal actions
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      genericName: '',
      category: 'Medicine',
      targetAnimal: 'Cattle',
      costPrice: 50,
      sellingPrice: 80,
      stock: 50,
      minStockAlert: 10,
      unit: '১০০মি.লি. ফাইল',
      expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
      batchNumber: `BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      dosageInfo: '',
      supplier: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      genericName: p.genericName,
      category: p.category,
      targetAnimal: p.targetAnimal,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      stock: p.stock,
      minStockAlert: p.minStockAlert,
      unit: p.unit,
      expiryDate: p.expiryDate,
      batchNumber: p.batchNumber,
      dosageInfo: p.dosageInfo || '',
      supplier: p.supplier || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.genericName.trim()) return;

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        ...formData,
      });
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...formData,
      };
      onAddProduct(newProduct);
    }

    setIsModalOpen(false);
  };

  // Quick Stock Adjustment
  const handleApplyQuickStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct || adjustQty <= 0) return;

    const delta = adjustType === 'add' ? adjustQty : -adjustQty;
    const newStock = Math.max(0, adjustingProduct.stock + delta);

    onUpdateProduct({
      ...adjustingProduct,
      stock: newStock,
    });

    setAdjustingProduct(null);
  };

  // Delete product confirmation
  const confirmDelete = (productId: string) => {
    onDeleteProduct(productId);
    setDeletingProductId(null);
  };

  if (isStaff) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-lg mx-auto my-12 space-y-3 shadow-sm">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">এক্সেস সীমিত (স্টাফ মোড)</h2>
        <p className="text-sm text-slate-600">
          স্টাফ মোডে নতুন প্রোডাক্ট যোগ করা, এডিট করা বা কেনা দাম দেখা সুরক্ষিত রাখা হয়েছে।
        </p>
        <p className="text-xs text-slate-400">
          স্টোক ও মালামাল এন্ট্রি করতে উপরের বার থেকে <strong className="text-slate-700">সুপার এডমিন (Super Admin)</strong> মোডে সুইচ করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {/* App Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                স্টক ও ইনভেন্টরি কন্ট্রোল
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                প্রোডাক্ট সংযোজন, রিস্টক, ফিল্টার এবং মোট মালামালের হিসাব
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-xs font-extrabold rounded-2xl shadow-md shadow-emerald-900/10 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন মেডিসিন / প্রোডাক্ট যোগ করুন</span>
        </button>
      </div>

      {/* Top Valuation & Stock Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Stock Value */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">স্টকের কেনা মূল্য</span>
            <span className="p-1.5 rounded-xl bg-teal-50 text-teal-600">
              <BarChart2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-900">
            ৳{metrics.totalCostValuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            বিক্রি মূল্য: ৳{metrics.totalRetailValuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>

        {/* Total Items */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">মোট প্রোডাক্ট টাইপ</span>
            <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
              <Layers className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-900">
            {metrics.totalItems} <span className="text-xs text-slate-400 font-normal">টি আইটেম</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            মোট সংখ্যা: {metrics.totalStockQty} টি
          </div>
        </div>

        {/* Low Stock Items */}
        <div
          onClick={() => setAlertFilter(alertFilter === 'Low Stock' ? 'All' : 'Low Stock')}
          className={`p-4 rounded-2xl border shadow-sm space-y-1 cursor-pointer transition ${
            alertFilter === 'Low Stock'
              ? 'bg-amber-500/10 border-amber-400'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700">কম স্টকের সতর্কবার্তা</span>
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-amber-800">
            {metrics.lowStockCount} <span className="text-xs text-amber-600 font-medium">টি মেডিসিন</span>
          </div>
          <div className="text-[10px] text-amber-600/80 font-medium">
            স্টক শেষ: {metrics.outOfStockCount} টি
          </div>
        </div>

        {/* Expiring Soon */}
        <div
          onClick={() => setAlertFilter(alertFilter === 'Expiring Soon' ? 'All' : 'Expiring Soon')}
          className={`p-4 rounded-2xl border shadow-sm space-y-1 cursor-pointer transition ${
            alertFilter === 'Expiring Soon'
              ? 'bg-red-500/10 border-red-400'
              : 'bg-white border-slate-200 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-red-700">মেয়াদ উত্তীর্ণের সন্নিকটে</span>
            <span className="p-1.5 rounded-xl bg-red-100 text-red-700">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-red-800">
            {metrics.expiringCount} <span className="text-xs text-red-600 font-medium">টি ব্যাচ</span>
          </div>
          <div className="text-[10px] text-red-500 font-medium">ফিল্টার দেখতে ক্লিক করুন</div>
        </div>
      </div>

      {/* Control Bar: Search, Category & View Toggle */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="মেডিসিনের নাম, জেনেরিক বা ব্যাচ নম্বর দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-800 placeholder-slate-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Badges & View Switcher */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto text-xs">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 font-bold"
          >
            <option value="All">সব ক্যাটাগরি</option>
            <option value="Medicine">মেডিসিন</option>
            <option value="Vaccine">ভ্যাকসিন</option>
            <option value="Feed">ফিড / খাবার</option>
            <option value="Supplement">সাপ্লিমেন্ট</option>
            <option value="Equipment">যন্ত্রপাতি</option>
          </select>

          {/* Alert Status Pills */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-0.5">
            {[
              { id: 'All', label: 'সব' },
              { id: 'Low Stock', label: 'কম স্টক' },
              { id: 'Out of Stock', label: 'স্টক শেষ' },
              { id: 'Expiring Soon', label: 'মেয়াদ কম' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setAlertFilter(filter.id as any)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition whitespace-nowrap ${
                  alertFilter === filter.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Grid vs Table View Toggle */}
          <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>কার্ড</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'table' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>টেবিল</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product List Content */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">কোনো প্রোডাক্ট পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            অনুগ্রহ করে ফিল্টার পরিবর্তন করুন অথবা নতুন মেডিসিন যোগ করতে উপরের বাটনে ক্লিক করুন।
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('All');
              setAlertFilter('All');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
          >
            ফিল্টার রিকভার করুন
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* APP GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredProducts.map((p) => {
            const isLow = p.stock > 0 && p.stock <= p.minStockAlert;
            const isOut = p.stock <= 0;
            const isExp = isExpiringSoon(p.expiryDate);

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  isOut
                    ? 'border-red-300 bg-red-50/10'
                    : isLow
                    ? 'border-amber-300 bg-amber-50/10'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                {/* Header Row */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {p.category}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {p.targetAnimal}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-sm leading-snug truncate" title={p.name}>
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{p.genericName}</p>
                    </div>

                    {/* Stock Status Pill */}
                    <div className="text-right shrink-0">
                      <div
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                          isOut
                            ? 'bg-red-600 text-white shadow-xs'
                            : isLow
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {isOut ? (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            <span>স্টক শেষ</span>
                          </>
                        ) : isLow ? (
                          <>
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>{p.stock} {p.unit}</span>
                          </>
                        ) : (
                          <span>{p.stock} {p.unit}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dosage note */}
                  {p.dosageInfo && (
                    <p className="text-[10px] text-emerald-700 bg-emerald-50/60 p-1.5 rounded-lg border border-emerald-100/80 mt-2 font-medium">
                      <strong className="font-bold">ডোজ:</strong> {p.dosageInfo}
                    </p>
                  )}
                </div>

                {/* Price & Batch Details */}
                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400">খুচরা মূল্য</div>
                      <div className="text-sm font-extrabold text-emerald-700">৳{p.sellingPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400">ক্রয় মূল্য</div>
                      <div className="text-sm font-bold text-slate-700">৳{p.costPrice.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
                    <span className="flex items-center gap-1">
                      {isExp && <Clock className="w-3 h-3 text-red-500" />}
                      <span className={isExp ? 'text-red-600 font-bold' : ''}>
                        মেয়াদ: {p.expiryDate}
                      </span>
                    </span>
                    <span className="font-mono text-[10px]">ব্যাচ: {p.batchNumber}</span>
                  </div>
                </div>

                {/* Quick Action Buttons Bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setAdjustingProduct(p);
                      setAdjustQty(10);
                      setAdjustType('add');
                    }}
                    className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-[11px] rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>স্টক এডজাস্ট</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition border border-slate-200"
                      title="এডিট করুন"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingProductId(p.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-slate-200"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">প্রোডাক্ট ও জেনেরিক</th>
                  <th className="p-3.5">ক্যাটাগরি</th>
                  <th className="p-3.5">ক্রয় মূল্য</th>
                  <th className="p-3.5">বিক্রয় মূল্য</th>
                  <th className="p-3.5">বর্তমান স্টক</th>
                  <th className="p-3.5">মেয়াদ ও ব্যাচ</th>
                  <th className="p-3.5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= p.minStockAlert;
                  const isOut = p.stock <= 0;
                  const isExp = isExpiringSoon(p.expiryDate);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                        <div className="text-[11px] text-slate-500">{p.genericName}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {p.category}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            {p.targetAnimal}
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5 font-bold text-slate-700">
                        ৳{p.costPrice.toFixed(2)}
                      </td>

                      <td className="p-3.5 font-extrabold text-emerald-700">
                        ৳{p.sellingPrice.toFixed(2)}
                      </td>

                      <td className="p-3.5">
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isOut
                              ? 'bg-red-600 text-white'
                              : isLow
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {p.stock} {p.unit}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className={`font-semibold ${isExp ? 'text-red-600 font-bold' : 'text-slate-800'}`}>
                          {p.expiryDate}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">ব্যাচ: {p.batchNumber}</div>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setAdjustingProduct(p);
                              setAdjustQty(10);
                              setAdjustType('add');
                            }}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="স্টক রিফিল"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                            title="এডিট"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProductId(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                            title="ডিলেট"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUICK STOCK ADJUSTMENT MODAL */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base">দ্রুত স্টক পরিবর্তন</h3>
              </div>
              <button
                onClick={() => setAdjustingProduct(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyQuickStock} className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-extrabold text-slate-900 text-sm">{adjustingProduct.name}</div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>বর্তমান স্টক:</span>
                  <span className="font-extrabold text-emerald-700 text-xs">
                    {adjustingProduct.stock} {adjustingProduct.unit}
                  </span>
                </div>
              </div>

              {/* Adjust Type Toggle */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">পরিবর্তনের ধরন</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
                      adjustType === 'add'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>যোগ / রিস্টক করুন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('deduct')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
                      adjustType === 'deduct'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <MinusCircle className="w-4 h-4" />
                    <span>কমান / ক্ষতিসাধন</span>
                  </button>
                </div>
              </div>

              {/* Quantity Input & Preset Buttons */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">পরিমাণ ({adjustingProduct.unit})</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />

                <div className="flex gap-1.5 mt-2">
                  {[5, 10, 20, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAdjustQty(preset)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 rounded-lg transition"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">কারণ / বিবরণ</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="নতুন স্টক ক্রয় / রিস্টক">নতুন স্টক ক্রয় / চালান প্রাপ্তি</option>
                  <option value="ইনভেন্টরি অডিট সংশোধন">ইনভেন্টরি অডিট সংশোধন</option>
                  <option value="নষ্ট / মেয়াদোত্তীর্ণ অপসারণ">নষ্ট বা মেয়াদোত্তীর্ণ প্রোডাক্ট বাদ</option>
                  <option value="ফেরত প্রাপ্তি">কাস্টমার / সাপ্লায়ার ফেরত</option>
                </select>
              </div>

              {/* New Result Preview */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex justify-between items-center font-bold">
                <span>নতুন স্টক আপডেট:</span>
                <span className="text-sm">
                  {Math.max(0, adjustingProduct.stock + (adjustType === 'add' ? adjustQty : -adjustQty))}{' '}
                  {adjustingProduct.unit}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow transition"
                >
                  স্টক সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>{editingProduct ? 'প্রোডাক্ট তথ্য সংশোধন' : 'নতুন ভেটেরিনারি মেডিসিন যোগ করুন'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">প্রোডাক্ট এর নাম (Brand Name) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: অক্সিটেট্রা এল.এ ইনজেকশন"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                {/* Generic */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">জেনেরিক / মূল উপাদান (Generic) *</label>
                  <input
                    type="text"
                    required
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="যেমন: Oxytetracycline 200mg/ml"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ক্যাটাগরি *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Medicine">মেডিসিন</option>
                    <option value="Vaccine">ভ্যাকসিন</option>
                    <option value="Feed">ফিড / খাবার</option>
                    <option value="Supplement">সাপ্লিমেন্ট</option>
                    <option value="Equipment">যন্ত্রপাতি</option>
                  </select>
                </div>

                {/* Target Animal */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ব্যবহার্য প্রাণী *</label>
                  <select
                    value={formData.targetAnimal}
                    onChange={(e) => setFormData({ ...formData, targetAnimal: e.target.value as AnimalTarget })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Cattle">গরু / মহিষ</option>
                    <option value="Poultry">পোল্ট্রি / মুরগি</option>
                    <option value="Goat/Sheep">ছাগল / ভেড়া</option>
                    <option value="Pet">পোষা প্রাণী</option>
                    <option value="Aqua/All">মাছ / সাধারণ সকল</option>
                  </select>
                </div>

                {/* Cost Price */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    ক্রয় মূল্য (৳) <span className="text-amber-600 font-normal">(কেনা দাম)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                {/* Selling Price */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    বিক্রয় মূল্য (৳) <span className="text-emerald-600 font-normal">(খুচরা)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                {/* Initial Stock Quantity */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">প্রাথমিক স্টক পরিমাণ</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                {/* Packaging Unit */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">একক (Unit)</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="যেমন: ১০০মি.লি. ফাইল, ২৫কেজি বস্তা"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                {/* Min Stock Alert */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">কম স্টক অ্যালার্ট লেভেল</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">মেয়াদ উত্তীর্ণের তারিখ</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                {/* Batch Number */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ব্যাচ নম্বর</label>
                  <input
                    type="text"
                    required
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                {/* Supplier */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">সাপ্লায়ার / ফার্মাসিউটিক্যালস</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="যেমন: একমি ভেটেরিনারি / স্কয়ার ফার্মা"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                {/* Dosage Directions */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">ডোজ নির্দেশিকা (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={formData.dosageInfo}
                    onChange={(e) => setFormData({ ...formData, dosageInfo: e.target.value })}
                    placeholder="যেমন: প্রতি ১০ কেজি ওজনে ১ মি.লি. মাংসে ইনজেকশন"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow transition"
                >
                  {editingProduct ? 'পরিবর্তন সেভ করুন' : 'প্রোডাক্ট যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">প্রোডাক্টটি ডিলিট করবেন?</h3>
              <p className="text-xs text-slate-500 mt-1">
                আপনি কি নিশ্চিত যে এই মেডিসিনটি ইনভেন্টরি থেকে সম্পূর্ণ মুছে ফেলতে চান?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-xs"
              >
                বাতিল
              </button>
              <button
                onClick={() => confirmDelete(deletingProductId)}
                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition text-xs shadow-md shadow-red-900/10"
              >
                হ্যাঁ, ডিলিট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
