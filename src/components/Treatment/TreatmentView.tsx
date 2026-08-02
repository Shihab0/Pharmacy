import React, { useState, useMemo } from 'react';
import { TreatmentRecord, Product, Role } from '../../types';
import {
  Stethoscope,
  Plus,
  Search,
  Calendar,
  User,
  Activity,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  ShieldAlert
} from 'lucide-react';

interface TreatmentViewProps {
  records: TreatmentRecord[];
  products: Product[];
  currentRole: Role;
  onAddRecord: (record: TreatmentRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const TreatmentView: React.FC<TreatmentViewProps> = ({
  records,
  products,
  currentRole,
  onAddRecord,
  onDeleteRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [animalType, setAnimalType] = useState('গরু (হলস্টেইন ফ্রিজিয়ান)');
  const [tagOrName, setTagOrName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [vetDoctorOrTech, setVetDoctorOrTech] = useState('ডাঃ মোঃ আলম (ডিভিএম)');
  const [followUpDate, setFollowUpDate] = useState('');
  const [status, setStatus] = useState<'Completed' | 'Follow-up Needed' | 'Critical'>('Follow-up Needed');
  const [notes, setNotes] = useState('');

  // Treatment Medicine Rows
  const [treatmentsGiven, setTreatmentsGiven] = useState<
    { medicineName: string; dosage: string; durationDays: number }[]
  >([{ medicineName: 'অক্সিটেট্রা এল.এ ইনজেকশন', dosage: '১৫মি.লি. মাংসে', durationDays: 3 }]);

  const isStaff = currentRole === 'Staff';

  if (isStaff) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-lg mx-auto my-12 space-y-3 shadow-sm">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">এক্সেস সুরক্ষিত (স্টাফ মোড)</h2>
        <p className="text-sm text-slate-600">
          পশু চিকিৎসা ও ডাক্তার প্রেসক্রিপশন রেজিস্টার ব্যবস্থা কেবল সুপার এডমিন বা চিকিৎসকের জন্য নির্ধারিত।
        </p>
      </div>
    );
  }

  // Filtered List
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.animalType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.tagOrName && r.tagOrName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const addTreatmentRow = () => {
    setTreatmentsGiven((prev) => [
      ...prev,
      { medicineName: products[0]?.name || 'এমোক্সি-ভেট পাউডার', dosage: '১০ গ্রাম পানিতে', durationDays: 3 },
    ]);
  };

  const removeTreatmentRow = (index: number) => {
    setTreatmentsGiven((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim() || !symptoms.trim() || !diagnosis.trim()) return;

    const newRecord: TreatmentRecord = {
      id: `treat-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      farmerName: farmerName.trim(),
      farmerPhone: farmerPhone.trim(),
      animalType: animalType.trim(),
      tagOrName: tagOrName.trim(),
      symptoms: symptoms.trim(),
      diagnosis: diagnosis.trim(),
      treatmentsGiven,
      vetDoctorOrTech: vetDoctorOrTech.trim(),
      followUpDate: followUpDate || undefined,
      status,
      notes: notes.trim(),
    };

    onAddRecord(newRecord);
    setIsModalOpen(false);

    // Reset Form
    setFarmerName('');
    setFarmerPhone('');
    setAnimalType('গরু (হলস্টেইন ফ্রিজিয়ান)');
    setTagOrName('');
    setSymptoms('');
    setDiagnosis('');
    setNotes('');
  };

  const statusBanglaMap: Record<string, string> = {
    All: 'সব রিপোর্ট',
    'Follow-up Needed': 'ফলো-আপ প্রয়োজন',
    Completed: 'সুস্থ / সম্পন্ন',
    Critical: 'জরুরি আশঙ্কাজনক',
  };

  return (
    <div className="space-y-4">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-emerald-600" />
            <span>পশু চিকিৎসা ও ডক্টর প্রেসক্রিপশন রেজিস্টার</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            খামারির গবাদিপশুর রোগ নির্ণয়, ব্যবস্থাপত্র, দোকান থেকে ওষুধ প্রদান ও ফলো-আপ ট্র্যাকার
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-2xl shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন প্রেসক্রিপশন পেশেন্ট যোগ করুন</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="খামারির নাম, পশুর জাত বা রোগের নাম দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto overflow-x-auto">
          {['All', 'Follow-up Needed', 'Completed', 'Critical'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {statusBanglaMap[st] || st}
            </button>
          ))}
        </div>
      </div>

      {/* Treatment Log List */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-400">
            <Stethoscope className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700 text-sm">কোন চিকিৎসা রেকর্ড পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400 mt-1">নতুন প্রেসক্রিপশন রেজিস্টার করতে উপরের বাটনে চাপ দিন।</p>
          </div>
        ) : (
          filteredRecords.map((r) => (
            <div
              key={r.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-3"
            >
              {/* Header metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-slate-900 text-sm">{r.farmerName}</span>
                  {r.farmerPhone && (
                    <span className="text-xs text-slate-500 font-mono">({r.farmerPhone})</span>
                  )}
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    {r.animalType} {r.tagOrName ? `• ${r.tagOrName}` : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-mono">{r.date}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                      r.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : r.status === 'Critical'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {statusBanglaMap[r.status] || r.status}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm('চিকিৎসা রেকর্ডটি ডিলিট করতে চান?')) {
                        onDeleteRecord(r.id);
                      }
                    }}
                    className="p-1 text-slate-300 hover:text-red-600 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Symptoms & Diagnosis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-0.5">রোগের লক্ষণ / উপসর্গ:</span>
                  <p className="text-slate-600">{r.symptoms}</p>
                </div>
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-900 block mb-0.5">ডাক্তারের রোগ নির্ণয় (Diagnosis):</span>
                  <p className="text-emerald-800 font-extrabold">{r.diagnosis}</p>
                </div>
              </div>

              {/* Medicines Prescribed */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 text-[11px] block">প্রদত্ত ওষুধ ও মাত্রা নির্দেশিকা:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {r.treatmentsGiven.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-slate-100 rounded-xl flex items-center justify-between text-slate-800"
                    >
                      <span className="font-extrabold">{t.medicineName}</span>
                      <span className="text-slate-600 text-[11px] font-medium">
                        {t.dosage} ({t.durationDays} দিন)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Doctor & Followup */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>চিকিৎসক: <strong className="text-slate-700">{r.vetDoctorOrTech}</strong></span>
                {r.followUpDate && (
                  <span className="text-amber-700 font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    পরবর্তী ফলো-আপ: {r.followUpDate}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Treatment Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-400" />
                <span>নতুন পশু প্রেসক্রিপশন রেজিস্টার করুন</span>
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
                {/* Farmer Name */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">খামারির নাম *</label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="যেমন: হাফিজুর রহমান"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Farmer Phone */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    placeholder="০১৭১১-০০০০০০"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Animal Type */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">পশুর ধরন / জাত *</label>
                  <input
                    type="text"
                    required
                    value={animalType}
                    onChange={(e) => setAnimalType(e.target.value)}
                    placeholder="যেমন: গাভী (হলস্টেইন), ব্লেক বেঙ্গল ছাগল"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Tag / Name / Shed */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">পশুর কান নম্বর / ট্যাগ (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={tagOrName}
                    onChange={(e) => setTagOrName(e.target.value)}
                    placeholder="যেমন: ট্যাগ #১০৪"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Symptoms */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">রোগের লক্ষণ / উপসর্গ *</label>
                  <input
                    type="text"
                    required
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="যেমন: ১০৪ ডিগ্রি তীব্র জ্বর, খাবার খাচ্ছে না, কাশি"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Diagnosis */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">রোগ নির্ণয় (Diagnosis) *</label>
                  <input
                    type="text"
                    required
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="যেমন: ওলান ফোলা (ম্যাস্টাইটিস) / নিউমোনিয়া"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-800"
                  />
                </div>
              </div>

              {/* Dynamic Medicine Selector Rows */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">প্রেসক্রাইবকৃত ওষুধসমূহ:</label>
                  <button
                    type="button"
                    onClick={addTreatmentRow}
                    className="text-emerald-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3.5 h-3.5" /> আরও ওষুধ যোগ করুন
                  </button>
                </div>

                {treatmentsGiven.map((row, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-2xl border border-slate-200">
                    <div className="col-span-5">
                      <select
                        value={row.medicineName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTreatmentsGiven((prev) =>
                            prev.map((r, i) => (i === index ? { ...r, medicineName: val } : r))
                          );
                        }}
                        className="w-full text-xs py-1.5 px-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-4">
                      <input
                        type="text"
                        placeholder="মাত্রা (যেমন: ১৫মি.লি. মাংসে)"
                        value={row.dosage}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTreatmentsGiven((prev) =>
                            prev.map((r, i) => (i === index ? { ...r, dosage: val } : r))
                          );
                        }}
                        className="w-full text-xs py-1.5 px-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="col-span-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="দিন"
                        value={row.durationDays}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setTreatmentsGiven((prev) =>
                            prev.map((r, i) => (i === index ? { ...r, durationDays: val } : r))
                          );
                        }}
                        className="w-full text-xs py-1.5 px-2 bg-white border border-slate-200 rounded-xl text-center font-bold"
                      />
                    </div>

                    <div className="col-span-1 text-right">
                      {treatmentsGiven.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTreatmentRow(index)}
                          className="text-red-500 p-1 hover:bg-slate-200 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                {/* Vet Doctor / Tech */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">দায়িত্বপ্রাপ্ত ডাক্তার</label>
                  <input
                    type="text"
                    value={vetDoctorOrTech}
                    onChange={(e) => setVetDoctorOrTech(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Followup Date */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">পরবর্তী ফলো-আপ তারিখ (ঐচ্ছিক)</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Status */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">রোগীর অবস্থা (Status)</label>
                  <div className="flex gap-2 flex-wrap">
                    {(['Follow-up Needed', 'Completed', 'Critical'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatus(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                          status === st
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {statusBanglaMap[st] || st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow transition"
                >
                  রেকর্ড সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
