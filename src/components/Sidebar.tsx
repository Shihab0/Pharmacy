import React from 'react';
import { Role } from '../types';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  TrendingUp,
  Stethoscope,
  Users,
  Lock,
  X,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

export type NavTab = 'dashboard' | 'pos' | 'inventory' | 'pnl' | 'treatments' | 'customers';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentRole: Role;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  mobileOpen,
  onCloseMobile,
}) => {
  const isStaff = currentRole === 'Staff';

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      adminOnly: true,
      description: 'Sales overview & stock alerts'
    },
    {
      id: 'pos' as NavTab,
      label: 'POS (Billing)',
      icon: ShoppingCart,
      adminOnly: false,
      description: 'Fast billing & checkout'
    },
    {
      id: 'inventory' as NavTab,
      label: 'Inventory',
      icon: Package,
      adminOnly: true,
      description: 'Stock & pricing CRUD'
    },
    {
      id: 'pnl' as NavTab,
      label: 'P&L Report',
      icon: TrendingUp,
      adminOnly: true,
      description: 'Cost, revenue & profit'
    },
    {
      id: 'treatments' as NavTab,
      label: 'Treatment Logs',
      icon: Stethoscope,
      adminOnly: true,
      description: 'Animal medical history'
    },
    {
      id: 'customers' as NavTab,
      label: 'Customer Directory',
      icon: Users,
      adminOnly: false,
      description: 'Farmer profiles & history'
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Mobile Header Close */}
          <div className="flex items-center justify-between md:hidden pb-3 border-b border-slate-800">
            <span className="font-bold text-white text-base">Navigation</span>
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Role Banner in Sidebar */}
          <div
            className={`p-3 rounded-xl border text-xs font-medium ${
              isStaff
                ? 'bg-blue-950/40 border-blue-800/60 text-blue-200'
                : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1 font-semibold text-sm">
              {isStaff ? (
                <ShieldAlert className="w-4 h-4 text-blue-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
              <span>{currentRole} Mode</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              {isStaff
                ? 'Access restricted to POS and Customer info. Cost prices & profit margins are hidden.'
                : 'Full access to Inventory CRUD, Financial Reports, and Treatment Records.'}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems
              .filter((item) => !isStaff || !item.adminOnly)
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition group ${
                      isActive
                        ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-900/30'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                      <div className="text-left">
                        <div className="leading-none">{item.label}</div>
                        <div className={`text-[10px] mt-1 ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
          </nav>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          <p className="font-medium text-slate-400">AgroVet Pharmacy PWA</p>
          <p className="mt-0.5">Version 2.4 • Offline Ready</p>
        </div>
      </aside>
    </>
  );
};
