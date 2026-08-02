import React from 'react';
import { SaleTransaction, Product, Role } from '../../types';
import { isLowStock, isOutOfStock, isExpiringSoon } from '../../utils/stockUtils';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShoppingCart,
  ShieldAlert,
  ArrowUpRight,
  PackageCheck,
  Receipt
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface DashboardViewProps {
  transactions: SaleTransaction[];
  products: Product[];
  currentRole: Role;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  products,
  currentRole,
  onNavigateTab,
}) => {
  const isStaff = currentRole === 'Staff';

  if (isStaff) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-lg mx-auto my-12 space-y-3 shadow-sm">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">এক্সেস সুরক্ষিত (স্টাফ মোড)</h2>
        <p className="text-sm text-slate-600">
          ড্যাশবোর্ডের মূল হিসাব, লাভ-ক্ষতির পরিসংখ্যান এবং আর্থিক এনালিটিক্স শুধুমাত্র সুপার এডমিন দেখতে পারবেন।
        </p>
        <button
          onClick={() => onNavigateTab('pos')}
          className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
        >
          ক্যাশ মেমো / বিক্রি কাউন্টারে যান
        </button>
      </div>
    );
  }

  // Calculate Metrics
  const todayStr = new Date().toISOString().slice(0, 10);
  
  const todayTransactions = transactions.filter(
    (tx) => tx.timestamp.slice(0, 10) === todayStr
  );

  const todaySales = todayTransactions.reduce((sum, tx) => sum + tx.grandTotal, 0);
  const todayProfit = todayTransactions.reduce((sum, tx) => sum + tx.netProfit, 0);

  // Overall Total Sales & Profit
  const totalSalesAllTime = transactions.reduce((sum, tx) => sum + tx.grandTotal, 0);
  const totalProfitAllTime = transactions.reduce((sum, tx) => sum + tx.netProfit, 0);

  // Low Stock Items (stock > 0 && stock <= minStockAlert)
  const lowStockItems = products.filter(isLowStock);
  const outOfStockItems = products.filter(isOutOfStock);

  // Expiring Soon Items (within 60 days)
  const expiringItems = products.filter((p) => isExpiringSoon(p.expiryDate));

  // Weekly Sales Bar Chart Data
  const daysBangla = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const dayName = daysBangla[d.getDay()];

    const daySales = transactions
      .filter((tx) => tx.timestamp.slice(0, 10) === dateStr)
      .reduce((sum, tx) => sum + tx.grandTotal, 0);

    const dayProfit = transactions
      .filter((tx) => tx.timestamp.slice(0, 10) === dateStr)
      .reduce((sum, tx) => sum + tx.netProfit, 0);

    return {
      day: dayName,
      date: dateStr,
      বিক্রি: parseFloat(daySales.toFixed(2)),
      লাভ: parseFloat(dayProfit.toFixed(2)),
    };
  });

  return (
    <div className="space-y-5">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            ফার্মেসি ওভারভিউ ড্যাশবোর্ড
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            আজকের বিক্রি, নিট লাভ, কম স্টকের সতর্কবার্তা এবং সাম্প্রতিক মেমোর তথ্য
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('pos')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>ক্যাশ মেমো খুলুন</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Today's Sales */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">আজকের মোট বিক্রি</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              ৳{todaySales.toFixed(2)}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>আজ {todayTransactions.length} টি বিল সম্পন্ন</span>
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-black">
            ৳
          </div>
        </div>

        {/* Card 2: Net Profit */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">আজকের নিট লাভ</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1">
              ৳{todayProfit.toFixed(2)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              সর্বমোট লাভ: ৳{totalProfitAllTime.toFixed(2)}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Low Stock Alert */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-red-300 transition group"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500">কম স্টকের অ্যালার্ট</p>
            <h3 className={`text-xl sm:text-2xl font-extrabold mt-1 ${lowStockItems.length > 0 ? 'text-red-600' : 'text-slate-800'}`}>
              {lowStockItems.length} টি মেডিসিন
            </h3>
            <p className="text-[11px] text-red-600 font-medium mt-1 group-hover:underline">
              {lowStockItems.length > 0 ? 'দ্রুত রিস্টক প্রয়োজন' : 'স্টক স্বাভাবিক আছে'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Expiring Soon Alert */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-amber-300 transition group"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500">মেয়াদ উত্তীর্ণের সন্নিকটে (৬০ দিন)</p>
            <h3 className={`text-xl sm:text-2xl font-extrabold mt-1 ${expiringItems.length > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
              {expiringItems.length} টি আইটেম
            </h3>
            <p className="text-[11px] text-amber-700 font-medium mt-1 group-hover:underline">
              {expiringItems.length > 0 ? 'মেয়াদ চেক করুন' : 'কোনো ডেড স্টক নেই'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Bar Chart & Stock Warnings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT (8 Cols): Weekly Sales Chart */}
        <div className="lg:col-span-8 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">গত ৭ দিনের বিক্রি ও লাভ</h3>
              <p className="text-xs text-slate-500">প্রতিদিনের মোট বিক্রি ও নিট প্রফিট ট্রেণ্ড</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> বিক্রি
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-teal-400 inline-block" /> লাভ
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  formatter={(value: any) => [`৳${value}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="বিক্রি" fill="#059669" radius={[6, 6, 0, 0]} />
                <Bar dataKey="লাভ" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT (4 Cols): Low Stock & Expiry Quick Alerts */}
        <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>জরুরি স্টক অ্যালার্ট</span>
              </h3>
              <button
                onClick={() => onNavigateTab('inventory')}
                className="text-xs text-emerald-600 hover:underline font-bold"
              >
                সব দেখুন
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {lowStockItems.length === 0 && expiringItems.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <PackageCheck className="w-8 h-8 mx-auto text-emerald-500 mb-1" />
                  <p className="font-semibold text-slate-700">সকল প্রোডাক্টের স্টক পর্যাপ্ত আছে</p>
                </div>
              ) : (
                <>
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-red-50/60 border border-red-200 rounded-xl text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{item.name}</div>
                        <div className="text-[10px] text-red-700 font-medium">
                          অবশিষ্ট মাত্র {item.stock} {item.unit}
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded">
                        কম স্টক
                      </span>
                    </div>
                  ))}

                  {expiringItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{item.name}</div>
                        <div className="text-[10px] text-amber-800 font-medium">
                          মেয়াদ শেষ: {item.expiryDate} (ব্যাচ: {item.batchNumber})
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold bg-amber-600 text-white px-2 py-0.5 rounded">
                        মেয়াদ কম
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            জরুরি প্রাণিচিকিৎসায় যেন ব্যাঘাত না ঘটে সেজন্য সর্বদা ওষুধ রিফিল রাখুন।
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <span>সাম্প্রতিক বিক্রয় মেমো</span>
            </h3>
            <p className="text-xs text-slate-500">সর্বশেষ সম্পন্নকৃত ক্যাশ মেমোসমূহ</p>
          </div>
          <button
            onClick={() => onNavigateTab('pnl')}
            className="text-xs font-bold text-emerald-600 hover:underline"
          >
            লাভ-ক্ষতি রিপোর্ট &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-3">মেমো নম্বর</th>
                <th className="p-3">তারিখ ও সময়</th>
                <th className="p-3">খামারির নাম</th>
                <th className="p-3">আইটেম সংখ্যা</th>
                <th className="p-3">মোট টাকা</th>
                <th className="p-3">নিট লাভ</th>
                <th className="p-3">পেমেন্ট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {transactions.slice(-5).reverse().map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono font-bold text-slate-900">{tx.invoiceNo}</td>
                  <td className="p-3 text-slate-600">{new Date(tx.timestamp).toLocaleString('bn-BD')}</td>
                  <td className="p-3 font-semibold text-slate-800">{tx.customerName}</td>
                  <td className="p-3">{tx.items.length} টি</td>
                  <td className="p-3 font-extrabold text-slate-900">৳{tx.grandTotal.toFixed(2)}</td>
                  <td className="p-3 font-extrabold text-emerald-700">+৳{tx.netProfit.toFixed(2)}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[10px]">
                      {tx.paymentMethod}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
