import React, { useState } from 'react';
import { ShieldCheck, UserCheck, LogIn, X, Lock, Sparkles, Check, Plus, Trash2, Mail, UserX, AlertCircle } from 'lucide-react';
import { Role } from '../../types';
import { User } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  isAuthenticated: boolean;
  currentRole: Role;
  staffEmails: string[];
  onAddStaffEmail: (email: string) => void;
  onRemoveStaffEmail: (email: string) => void;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
  onDemoLogin: (role: Role) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  isAuthenticated,
  currentRole,
  staffEmails,
  onAddStaffEmail,
  onRemoveStaffEmail,
  onSignInWithGoogle,
  onSignOut,
  onDemoLogin,
}) => {
  const [newEmailInput, setNewEmailInput] = useState('');
  const [showManageStaff, setShowManageStaff] = useState(false);

  if (!isOpen) return null;

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmailInput.trim()) {
      onAddStaffEmail(newEmailInput.trim().toLowerCase());
      setNewEmailInput('');
    }
  };

  const userEmail = user?.email?.toLowerCase();
  const isAdminUser = userEmail === 'atahershihab151@gmail.com' || (currentRole === 'Super Admin' && isAuthenticated);
  const isRegisteredStaff = userEmail && staffEmails.includes(userEmail);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title Header */}
        <div className="text-center space-y-1.5 mb-5 shrink-0">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">ফার্মেসি সিস্টেম লগইন</h2>
          <p className="text-xs text-slate-400">
            এডমিন বা স্টাফ হিসেবে লগইন করে সফ্টওয়্যার ড্যাশবোর্ড ও মেমো পরিচালনা করুন।
          </p>
        </div>

        {/* Scrollable Form Body */}
        <div className="space-y-4 overflow-y-auto pr-1 no-scrollbar">
          {/* Currently Logged In Banner */}
          {user ? (
            <div className="bg-slate-800/90 border border-slate-700/80 p-3.5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-9 h-9 rounded-full border border-emerald-400 object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-xs font-bold text-white truncate max-w-[170px]">
                      {user.displayName || user.email}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> গুগলে সংযুক্ত
                    </div>
                  </div>
                </div>

                <button
                  onClick={onSignOut}
                  className="text-xs text-red-400 hover:bg-slate-700 px-2.5 py-1.5 rounded-xl transition font-semibold"
                >
                  লগআউট
                </button>
              </div>

              {/* Verified Role Tag */}
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">নির্ধারিত রোল:</span>
                {isAdminUser ? (
                  <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-black text-[11px] border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    সুপার এডমিন (Super Admin)
                  </span>
                ) : isRegisteredStaff ? (
                  <span className="bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full font-black text-[11px] border border-blue-500/30 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    কাউন্টার স্টাফ (Staff)
                  </span>
                ) : (
                  <span className="bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full font-bold text-[11px] border border-amber-500/30 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    রেজিস্টার্ড নয়
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Google Sign-In Primary CTA */
            <button
              onClick={onSignInWithGoogle}
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold p-3.5 rounded-2xl shadow-lg shadow-blue-900/30 transition border border-blue-400/30 text-xs sm:text-sm active:scale-98"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>গুগল একাউন্ট (Google Auth) দিয়ে লগইন</span>
            </button>
          )}

          {/* Unregistered Email Notice */}
          {user && !isAdminUser && !isRegisteredStaff && (
            <div className="bg-amber-950/50 border border-amber-800/80 p-3 rounded-2xl text-amber-200 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>আপনার ইমেইলটি স্টাফ হিসেবে রেজিস্টার্ড নয়</span>
              </p>
              <p className="text-[11px] text-amber-300/80">
                এডমিনের কাছে অনুরোধ করে ইমেইল যুক্ত করুন অথবা নিচে টেস্ট ডেমো লগইন করুন।
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-slate-900 px-2 text-slate-500 font-bold">ডেমো টেস্ট অথবা ড্যাশবোর্ড প্রবেশ</span>
            </div>
          </div>

          {/* Demo Login Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={() => onDemoLogin('Super Admin')}
              className={`w-full p-3 rounded-2xl border transition text-left flex items-center justify-between ${
                currentRole === 'Super Admin' && isAuthenticated
                  ? 'bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-white">
                    সুপার এডমিন ডেমো লগইন (Super Admin)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    এডমিন একাউন্ট (সকল ফিচার অন)
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/30">
                লগইন
              </span>
            </button>

            <button
              onClick={() => onDemoLogin('Staff')}
              className={`w-full p-3 rounded-2xl border transition text-left flex items-center justify-between ${
                currentRole === 'Staff' && isAuthenticated
                  ? 'bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/20'
                  : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-white">
                    কাউন্টার স্টাফ ডেমো লগইন (Staff)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    কাউন্টার মেমো, খামারি ও ওষুধ বিক্রয়
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-extrabold bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg border border-blue-500/30">
                লগইন
              </span>
            </button>
          </div>

          {/* Admin Staff Email Management Section (Only visible to Admin) */}
          {isAdminUser && (
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => setShowManageStaff(!showManageStaff)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center justify-between w-full p-2 bg-slate-800/50 rounded-xl"
              >
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>অনুমোদিত স্টাফ ইমেইল তালিকা সেটিং ({staffEmails.length})</span>
                </span>
                <span>{showManageStaff ? '▲' : '▼'}</span>
              </button>

              {showManageStaff && (
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-3">
                  <form onSubmit={handleAddEmail} className="flex gap-2">
                    <input
                      type="email"
                      placeholder="নতুন স্টাফের ইমেইল লিখুন..."
                      value={newEmailInput}
                      onChange={(e) => setNewEmailInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>যোগ করুন</span>
                    </button>
                  </form>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {staffEmails.length === 0 ? (
                      <p className="text-[11px] text-slate-500 text-center py-2">কোনো স্টাফ ইমেইল রেজিস্টার্ড নেই</p>
                    ) : (
                      staffEmails.map((email) => (
                        <div key={email} className="flex items-center justify-between bg-slate-900 px-2.5 py-1.5 rounded-xl text-xs border border-slate-800">
                          <span className="text-slate-300 font-medium truncate max-w-[220px]">{email}</span>
                          <button
                            onClick={() => onRemoveStaffEmail(email)}
                            className="text-slate-500 hover:text-red-400 p-1 rounded transition"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
