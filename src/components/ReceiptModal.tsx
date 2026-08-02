import React from 'react';
import { SaleTransaction } from '../types';
import { Printer, CheckCircle2, X } from 'lucide-react';

interface ReceiptModalProps {
  transaction: SaleTransaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Ribbon */}
        <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-200" />
            <div>
              <h3 className="font-extrabold text-lg leading-tight">মেমো সম্পন্ন হয়েছে!</h3>
              <p className="text-xs text-emerald-100">বিক্রয় সফলভাবে প্রসেস করা হয়েছে</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-100 hover:text-white hover:bg-emerald-700 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Area */}
        <div id="printable-receipt" className="p-6 space-y-4 font-mono text-xs">
          {/* Store Info */}
          <div className="text-center border-b border-dashed border-slate-300 pb-3 space-y-0.5">
            <h2 className="font-sans font-black text-lg text-slate-900 tracking-tight">
              এগ্রোভেট ফার্মেসি
            </h2>
            <p className="text-slate-600 font-sans text-xs font-semibold">ভেটেরিনারি মেডিসিন ও পশুপালন চিকিৎসালয়</p>
            <p className="text-slate-500 text-[11px] font-sans">স্টেশন রোড, প্রাণী হাসপাতাল সংলগ্ন • ফোন: ০১৭১১-১১২২৩৩</p>
          </div>

          {/* Transaction Metadata */}
          <div className="grid grid-cols-2 gap-1 text-[11px] border-b border-dashed border-slate-300 pb-3">
            <div>
              <span className="text-slate-500">ইনভয়েস:</span>{' '}
              <strong className="text-slate-900">{transaction.invoiceNo}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500">তারিখ:</span>{' '}
              <span>{new Date(transaction.timestamp).toLocaleDateString('bn-BD')}</span>
            </div>
            <div>
              <span className="text-slate-500">কাস্টমার:</span>{' '}
              <span className="font-bold text-slate-800">{transaction.customerName}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500">পেমেন্ট:</span>{' '}
              <span className="font-bold text-emerald-700">{transaction.paymentMethod}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2 border-b border-dashed border-slate-300 pb-3">
            <div className="grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200 pb-1">
              <div className="col-span-6">ওষুধের নাম</div>
              <div className="col-span-2 text-center">পরিমাণ</div>
              <div className="col-span-2 text-right">দর</div>
              <div className="col-span-2 text-right">মোট</div>
            </div>

            {transaction.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 text-[11px] items-center">
                <div className="col-span-6 pr-1">
                  <div className="font-sans font-extrabold text-slate-900 truncate">{item.productName}</div>
                  <div className="text-[10px] text-slate-500 truncate">{item.unit}</div>
                </div>
                <div className="col-span-2 text-center font-bold">{item.quantity}</div>
                <div className="col-span-2 text-right">৳{item.unitSellingPrice.toFixed(2)}</div>
                <div className="col-span-2 text-right font-bold">৳{item.totalPrice.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Calculation Breakdown */}
          <div className="space-y-1 text-right text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">সাবটোটাল:</span>
              <span>৳{transaction.subtotal.toFixed(2)}</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between text-amber-700 font-bold">
                <span>ডিসকাউন্ট ছাড়:</span>
                <span>-৳{transaction.discount.toFixed(2)}</span>
              </div>
            )}
            {transaction.tax > 0 && (
              <div className="flex justify-between">
                <span>ট্যাক্স:</span>
                <span>+৳{transaction.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-800">
              <span>সর্বমোট বিল:</span>
              <span className="text-emerald-700">৳{transaction.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-2 text-[10px] text-slate-500 border-t border-dashed border-slate-300 font-sans space-y-0.5">
            <p className="font-bold text-slate-800">এগ্রোভেট ফার্মেসিতে আসার জন্য ধন্যবাদ!</p>
            <p>গবাদিপশুর যেকোনো জরুরি পরামর্শে যোগাযোগ করুন।</p>
            <p className="text-[9px] text-slate-400 mt-1">কাউন্টার: {transaction.staffName}</p>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition"
          >
            বন্ধ করুন
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট মেমো</span>
          </button>
        </div>
      </div>
    </div>
  );
};
