import React from 'react';
import { Role } from '../types';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  TrendingUp,
  Stethoscope,
  Users,
  Lock
} from 'lucide-react';

export type NavTab = 'pos' | 'inventory' | 'dashboard' | 'pnl' | 'treatments' | 'customers';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentRole: Role;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  currentRole,
}) => {
  const isStaff = currentRole === 'Staff';

  const navItems = [
    {
      id: 'pos' as NavTab,
      label: 'ক্যাশ মেমো',
      shortLabel: 'বিক্রি',
      icon: ShoppingCart,
      adminOnly: false,
    },
    {
      id: 'inventory' as NavTab,
      label: 'স্টক ম্যানেজমেন্ট',
      shortLabel: 'স্টক',
      icon: Package,
      adminOnly: true,
    },
    {
      id: 'dashboard' as NavTab,
      label: 'ড্যাশবোর্ড',
      shortLabel: 'ড্যাশবোর্ড',
      icon: LayoutDashboard,
      adminOnly: true,
    },
    {
      id: 'pnl' as NavTab,
      label: 'লাভ-ক্ষতি',
      shortLabel: 'লাভ-ক্ষতি',
      icon: TrendingUp,
      adminOnly: true,
    },
    {
      id: 'treatments' as NavTab,
      label: 'চিকিৎসা রেজিস্টার',
      shortLabel: 'চিকিৎসা',
      icon: Stethoscope,
      adminOnly: true,
    },
    {
      id: 'customers' as NavTab,
      label: 'খামারি / কাস্টমার',
      shortLabel: 'খামারি',
      icon: Users,
      adminOnly: false,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800/80 shadow-2xl backdrop-blur-lg">
      <div className="max-w-4xl mx-auto px-2 py-1.5 flex items-center justify-around gap-1">
        {navItems
          .filter((item) => !isStaff || !item.adminOnly)
          .map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-150 relative ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/10 font-extrabold scale-105'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {/* Active Dot Indicator */}
                {isActive && (
                  <span className="absolute -top-1 w-2 h-2 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400" />
                )}

                <div className="relative">
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                </div>

                <span className="text-[10px] sm:text-xs font-semibold mt-1 tracking-tight truncate max-w-full">
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
};
