import React from 'react';
import { Role } from '../types';
import { ShieldAlert, ShieldCheck, RefreshCw, Smartphone, Stethoscope } from 'lucide-react';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (newRole: Role) => void;
  onResetData: () => void;
  pwaInstallable: boolean;
  onInstallPWA: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onResetData,
  pwaInstallable,
  onInstallPWA,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Left: App Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
            <Stethoscope className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-none">
                এগ্রোভেট <span className="text-emerald-400">ফার্মেসি</span>
              </span>
              <span className="bg-emerald-950 text-emerald-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-800/60">
                PWA অ্যাপ
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              পশু চিকিৎসা ও ফার্মেসি ম্যানেজমেন্ট সফটওয়্যার
            </p>
          </div>
        </div>

        {/* Right: Role Switcher & Reset Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {pwaInstallable && (
            <button
              onClick={onInstallPWA}
              className="flex items-center gap-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-xl transition shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ইনস্টল অ্যাপ</span>
            </button>
          )}

          {/* RBAC Role Switcher Pill */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-2xl border border-slate-700/80">
            <button
              onClick={() => onRoleChange('Staff')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                currentRole === 'Staff'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="স্টাফ মোড: শুধুমাত্র সেলস ও খামারি এন্ট্রি"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>স্টাফ</span>
            </button>
            <button
              onClick={() => onRoleChange('Super Admin')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                currentRole === 'Super Admin'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="এডমিন মোড: সম্পূর্ণ এক্সেস ও রিপোর্ট"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">এডমিন</span>
              <span className="sm:hidden">এডমিন</span>
            </button>
          </div>

          {/* Reset Seed Data Button */}
          <button
            onClick={onResetData}
            title="ডাটা রিকভারি / রিসেট"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden md:inline text-[11px] font-semibold">রিসেট ডাটা</span>
          </button>
        </div>
      </div>
    </header>
  );
};
