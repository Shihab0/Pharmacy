import React, { useState, useMemo } from 'react';
import { SaleTransaction, Role } from '../../types';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  Download,
  ShieldAlert,
  ArrowUpRight,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';

interface ProfitLossViewProps {
  transactions: SaleTransaction[];
  currentRole: Role;
}

export const ProfitLossView: React.FC<ProfitLossViewProps> = ({ transactions, currentRole }) => {
  const [timeRange, setTimeRange] = useState<'Today' | 'This Week' | 'This Month' | 'All Time'>('All Time');

  const isStaff = currentRole === 'Staff';

  if (isStaff) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-lg mx-auto my-12 space-y-3 shadow-sm">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">এক্সেস সুরক্ষিত (স্টাফ মোড)</h2>
        <p className="text-sm text-slate-600">
          লাভ-ক্ষতির হিসাব, কেনার খরচ ও প্রফিট মার্জিন সংক্রান্ত তথ্য স্টাফ মোডে গোপন রাখা হয়েছে।
        </p>
      </div>
    );
  }

  // Filter transactions by timeRange
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((tx) => {
      const txDate = new Date(tx.timestamp);
      if (timeRange === 'Today') {
        return txDate.toDateString() === now.toDateString();
      } else if (timeRange === 'This Week') {
        const diffDays = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
      } else if (timeRange === 'This Month') {
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      }
      return true; // All Time
    });
  }, [transactions, timeRange]);

  // Aggregate Financial Totals
  const totalGrossRevenue = filteredTransactions.reduce((sum, tx) => sum + tx.subtotal, 0);
  const totalDiscounts = filteredTransactions.reduce((sum, tx) => sum + tx.discount, 0);
  const totalNetRevenue = filteredTransactions.reduce((sum, tx) => sum + tx.grandTotal, 0);
  const totalCOGS = filteredTransactions.reduce((sum, tx) => sum + tx.totalCost, 0);
  const totalNetProfit = totalNetRevenue - totalCOGS;
  const profitMarginPercent = totalNetRevenue > 0 ? (totalNetProfit / totalNetRevenue) * 100 : 0;

  // Itemized Product Profitability Analysis
  const productProfitabilityMap = useMemo(() => {
    const map: Record<
      string,
      {
        id: string;
        name: string;
        generic: string;
        unit: string;
        qtySold: number;
        revenue: number;
        cost: number;
        profit: number;
      }
    > = {};

    filteredTransactions.forEach((tx) => {
      tx.items.forEach((item) => {
        if (!map[item.productId]) {
          map[item.productId] = {
            id: item.productId,
            name: item.productName,
            generic: item.genericName,
            unit: item.unit,
            qtySold: 0,
            revenue: 0,
            cost: 0,
            profit: 0,
          };
        }

        const entry = map[item.productId];
        entry.qtySold += item.quantity;
        entry.revenue += item.totalPrice;
        entry.cost += item.unitCostPrice * item.quantity;
        entry.profit += item.totalPrice - item.unitCostPrice * item.quantity;
      });
    });

    return Object.values(map).sort((a, b) => b.profit - a.profit);
  }, [filteredTransactions]);

  // Export to CSV
  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Invoice No,Timestamp,Customer,Grand Total (BDT),Total Cost (BDT),Net Profit (BDT)\n';

    filteredTransactions.forEach((tx) => {
      csvContent += `"${tx.invoiceNo}","${tx.timestamp}","${tx.customerName}",${tx.grandTotal},${tx.totalCost},${tx.netProfit}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AgroVet_PL_Report_${timeRange.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const rangeLabels: Record<string, string> = {
    Today: 'আজকের',
    'This Week': 'এই সপ্তাহের',
    'This Month': 'এই মাসের',
    'All Time': 'সর্বকালের',
  };

  return (
    <div className="space-y-5">
      {/* Title & Date Range Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <span>লাভ-ক্ষতি ও আর্থিক রিপোর্ট</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            বিক্রয় আয়, কেনা খরচ (COGS), ডিসকাউন্ট এবং ওষুধ ভিত্তিক নিট প্রফিটের হিসাব
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Time Range Selector */}
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold">
            {(['Today', 'This Week', 'This Month', 'All Time'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  timeRange === range
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {rangeLabels[range]}
              </button>
            ))}
          </div>

          <button
            onClick={exportCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV ডাউনলোড</span>
          </button>
        </div>
      </div>

      {/* P&L Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">মোট বিক্রয় আয়</p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            ৳{totalNetRevenue.toFixed(2)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            মূল সাবটোটাল: ৳{totalGrossRevenue.toFixed(2)} (ছাড়: ৳{totalDiscounts.toFixed(2)})
          </p>
        </div>

        {/* Total Cost of Goods Sold (COGS) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">বিক্রিত পণ্যের ক্রয় খরচ</p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-700 mt-1">
            ৳{totalCOGS.toFixed(2)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            বিক্রি হওয়া মালামালের মূল কেনা দাম
          </p>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <p className="text-xs font-bold text-emerald-800">নিট প্রফিট (লাভ)</p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1">
            +৳{totalNetProfit.toFixed(2)}
          </h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            মোট আয় থেকে কেনা খরচ বাদে নিট লাভ
          </p>
        </div>

        {/* Net Profit Margin % */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">লাভের শতাংশ (প্রফিট মার্জিন)</p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-teal-700 mt-1">
            {profitMarginPercent.toFixed(1)}%
          </h3>
          <p className="text-[11px] text-teal-600 font-medium mt-1">
            গড় মার্জিন মুনাফা হার
          </p>
        </div>
      </div>

      {/* Item-wise Profitability Table */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>ওষুধভিত্তিক লাভ বিশ্লেষণ ({rangeLabels[timeRange]})</span>
            </h3>
            <p className="text-xs text-slate-500">
              সর্বাধিক বিক্রিত ও লাভজনক ফার্মাসিউটিক্যাল মেডিসিনের তালিকা
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-3">মেডিসিন / প্রোডাক্ট</th>
                <th className="p-3">বিক্রিত পরিমাণ</th>
                <th className="p-3">মোট বিক্রয় আয়</th>
                <th className="p-3">মোট ক্রয় খরচ</th>
                <th className="p-3">নিট প্রফিট</th>
                <th className="p-3">মার্জিন %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {productProfitabilityMap.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    নির্বাচিত সময়সীমার মধ্যে কোনো বিক্রয় রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                productProfitabilityMap.map((item) => {
                  const marginPct = item.revenue > 0 ? ((item.profit / item.revenue) * 100).toFixed(1) : '0';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                        <div className="text-[11px] text-slate-500">{item.generic}</div>
                      </td>
                      <td className="p-3 font-bold text-slate-800">
                        {item.qtySold} {item.unit}
                      </td>
                      <td className="p-3 font-bold text-slate-900">৳{item.revenue.toFixed(2)}</td>
                      <td className="p-3 text-slate-600">৳{item.cost.toFixed(2)}</td>
                      <td className="p-3 font-extrabold text-emerald-700">+৳{item.profit.toFixed(2)}</td>
                      <td className="p-3 font-bold text-teal-700">{marginPct}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
