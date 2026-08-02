import React, { useState, useMemo } from 'react';
import { Customer, SaleTransaction } from '../../types';
import {
  Users,
  Plus,
  Search,
  Phone,
  MapPin,
  Building,
  DollarSign,
  Receipt,
  X,
  CreditCard,
  Calendar
} from 'lucide-react';

interface CustomerViewProps {
  customers: Customer[];
  transactions: SaleTransaction[];
  onAddCustomer: (customer: Customer) => void;
  onPayDue?: (customerId: string, amount: number) => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  customers,
  transactions,
  onAddCustomer,
  onPayDue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerHistory, setSelectedCustomerHistory] = useState<Customer | null>(null);

  // Pay Due Modal
  const [payDueCustomer, setPayDueCustomer] = useState<Customer | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);

  // Add Customer Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [farmType, setFarmType] = useState('ডেইরি ফার্ম (১০টি গাভী)');
  const [dueBalance, setDueBalance] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.farmType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim() || 'স্থায়ী খামারি',
      farmType: farmType.trim() || 'সাধারণ পশুপালন',
      totalSpent: 0,
      dueBalance: dueBalance || 0,
      lastVisit: new Date().toISOString().slice(0, 10),
      notes: notes.trim(),
    };

    onAddCustomer(newCust);
    setIsModalOpen(false);

    setName('');
    setPhone('');
    setAddress('');
    setNotes('');
    setDueBalance(0);
  };

  // Transactions for selected customer
  const customerTxList = useMemo(() => {
    if (!selectedCustomerHistory) return [];
    return transactions.filter(
      (tx) =>
        tx.customerId === selectedCustomerHistory.id ||
        (tx.customerName && tx.customerName.toLowerCase() === selectedCustomerHistory.name.toLowerCase())
    );
  }, [selectedCustomerHistory, transactions]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>খামারি ও কাস্টমার ডিরেক্টরি</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            খামারির প্রোফাইল, খামারের ধরন, বাকির হিসাব এবং পূর্ববর্তী ক্রয়ের হিস্ট্রি
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-2xl shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন খামারি যোগ করুন</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="খামারির নাম, মোবাইল নম্বর বা খামারের ধরন দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
            কোনো খামারি তথ্য পাওয়া যায়নি।
          </div>
        ) : (
          filteredCustomers.map((c) => (
            <div
              key={c.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{c.name}</h3>
                    <p className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{c.farmType}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    ভিজিট: {c.lastVisit}
                  </span>
                </div>

                <div className="space-y-1 mt-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{c.address}</span>
                  </div>
                  {c.notes && (
                    <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                      "{c.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Purchase Totals & History Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">মোট কেনাকাটা</div>
                  <div className="text-sm font-extrabold text-slate-900">৳{c.totalSpent.toFixed(2)}</div>
                </div>

                {c.dueBalance > 0 && (
                  <div>
                    <div className="text-[10px] text-red-500 font-extrabold">বাকি টাকা (Due)</div>
                    <div className="text-sm font-extrabold text-red-600">৳{c.dueBalance.toFixed(2)}</div>
                  </div>
                )}

                <div className="flex items-center gap-1.5 ml-auto">
                  {c.dueBalance > 0 && onPayDue && (
                    <button
                      onClick={() => {
                        setPayDueCustomer(c);
                        setPayAmount(c.dueBalance);
                      }}
                      className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-extrabold rounded-xl transition border border-red-200 flex items-center gap-1"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>বকেয়া পরিশোধ</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedCustomerHistory(c)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-extrabold rounded-xl transition flex items-center gap-1"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>মেমো ইতিহাস</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>নতুন খামারি / কাস্টমার প্রোফাইল</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">খামারির নাম *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: আনোয়ার বেগম"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="০১৮০০-০০০০০০"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">খামারের বিবরণ / পশুর সংখ্যা</label>
                <input
                  type="text"
                  value={farmType}
                  onChange={(e) => setFarmType(e.target.value)}
                  placeholder="যেমন: ব্রয়লার খামার (১,০০০ মুরগি) বা ডেইরি"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">গ্রাম / ঠিকানা</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="গ্রাম: হরিপুর, ইউনিয়ন: শালবন"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">পূর্বের বাকির পরিমাণ (৳)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={dueBalance || ''}
                  onChange={(e) => setDueBalance(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">নোট (ঐচ্ছিক)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ভ্যাকসিন সিডিউল বা বিশেষ কোন তথ্য..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow"
                >
                  খামারি সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer History Modal */}
      {selectedCustomerHistory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-8">
            <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base">{selectedCustomerHistory.name} - বিক্রয় মেমোসমূহ</h3>
                <p className="text-xs text-emerald-100">{selectedCustomerHistory.farmType}</p>
              </div>
              <button
                onClick={() => setSelectedCustomerHistory(null)}
                className="text-emerald-100 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-96 overflow-y-auto text-xs">
              {customerTxList.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  এই খামারির কোনো কেনাকাটার রেকর্ড পাওয়া যায়নি।
                </div>
              ) : (
                customerTxList.map((tx) => (
                  <div key={tx.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{tx.invoiceNo}</span>
                      <span className="text-emerald-700">৳{tx.grandTotal.toFixed(2)}</span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      তারিখ: {new Date(tx.timestamp).toLocaleString('bn-BD')} • মেথড: {tx.paymentMethod}
                    </div>

                    <div className="pt-1 border-t border-slate-200 space-y-0.5 text-[11px] text-slate-700">
                      {tx.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.productName}</span>
                          <span>৳{item.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedCustomerHistory(null)}
                className="px-4 py-2 font-bold text-xs bg-slate-200 hover:bg-slate-300 rounded-xl"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Due Modal */}
      {payDueCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">বকেয়া জমা গ্রহণ</h3>
              <button
                onClick={() => setPayDueCustomer(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500">খামারির নাম:</p>
                <p className="text-sm font-bold text-slate-900">{payDueCustomer.name}</p>
              </div>

              <div className="bg-red-50 p-3 rounded-2xl border border-red-100 flex items-center justify-between">
                <span className="text-xs font-bold text-red-700">বর্তমান মোট বকেয়া:</span>
                <span className="text-base font-extrabold text-red-700">৳{payDueCustomer.dueBalance.toFixed(2)}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  জমা করার পরিমাণ (টাকা):
                </label>
                <input
                  type="number"
                  min={1}
                  max={payDueCustomer.dueBalance}
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setPayDueCustomer(null)}
                className="px-4 py-2 font-bold text-xs text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  if (payAmount > 0 && onPayDue) {
                    onPayDue(payDueCustomer.id, payAmount);
                    setPayDueCustomer(null);
                  }
                }}
                className="px-4 py-2 font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition"
              >
                জমা গ্রহণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
