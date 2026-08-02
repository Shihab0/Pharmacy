import React, { useState, useEffect } from 'react';
import { Role } from './types';
import {
  getProducts,
  saveProducts,
  getCustomers,
  saveCustomers,
  getTreatmentRecords,
  saveTreatmentRecords,
  getTransactions,
  saveTransactions,
  getCurrentRole,
  saveCurrentRole,
  resetToSeedData
} from './services/storage';

import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { ReceiptModal } from './components/ReceiptModal';

import { POSView } from './components/POS/POSView';
import { InventoryView } from './components/Inventory/InventoryView';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ProfitLossView } from './components/Reports/ProfitLossView';
import { TreatmentView } from './components/Treatment/TreatmentView';
import { CustomerView } from './components/Customers/CustomerView';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('Super Admin');
  const [activeTab, setActiveTab] = useState<NavTab>('pos');

  // Application Data State
  const [products, setProducts] = useState(getProducts);
  const [customers, setCustomers] = useState(getCustomers);
  const [treatmentRecords, setTreatmentRecords] = useState(getTreatmentRecords);
  const [transactions, setTransactions] = useState(getTransactions);

  // Receipt Modal State
  const [latestTransaction, setLatestTransaction] = useState<any | null>(null);

  // PWA Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Load persisted role
    const savedRole = getCurrentRole();
    setCurrentRole(savedRole);

    // Listen for PWA install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Sync role changes
  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    saveCurrentRole(newRole);

    // If Staff is selected and current tab is admin-only, redirect to POS
    if (newRole === 'Staff' && ['dashboard', 'inventory', 'pnl', 'treatments'].includes(activeTab)) {
      setActiveTab('pos');
    }
  };

  // Reset Data to Seeds
  const handleResetData = () => {
    if (confirm('আপনি কি এগ্রোভেট ফার্মেসির ডাটা রিসেট করে ডিফল্ট ডেমো ডাটাতে ফিরে যেতে চান?')) {
      resetToSeedData();
      setProducts(getProducts());
      setCustomers(getCustomers());
      setTreatmentRecords(getTreatmentRecords());
      setTransactions(getTransactions());
    }
  };

  // Install PWA trigger
  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    }
  };

  // Process POS Sale
  const handleProcessSale = (transaction: any) => {
    // 1. Deduct Inventory Stock
    const updatedProducts = products.map((prod) => {
      const soldItem = transaction.items.find((item: any) => item.productId === prod.id);
      if (soldItem) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - soldItem.quantity),
        };
      }
      return prod;
    });

    setProducts(updatedProducts);
    saveProducts(updatedProducts);

    // 2. Save Transaction
    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);

    // 3. Update Customer Total Spent if customer linked
    if (transaction.customerId) {
      const updatedCustomers = customers.map((c) => {
        if (c.id === transaction.customerId) {
          return {
            ...c,
            totalSpent: c.totalSpent + transaction.grandTotal,
            lastVisit: new Date().toISOString().slice(0, 10),
          };
        }
        return c;
      });
      setCustomers(updatedCustomers);
      saveCustomers(updatedCustomers);
    }

    // 4. Trigger Receipt Modal
    setLatestTransaction(transaction);
  };

  // Product CRUD
  const handleAddProduct = (newProduct: any) => {
    const updated = [...products, newProduct];
    setProducts(updated);
    saveProducts(updated);
  };

  const handleUpdateProduct = (updatedProduct: any) => {
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    setProducts(updated);
    saveProducts(updated);
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    saveProducts(updated);
  };

  // Treatment CRUD
  const handleAddTreatmentRecord = (record: any) => {
    const updated = [record, ...treatmentRecords];
    setTreatmentRecords(updated);
    saveTreatmentRecords(updated);
  };

  const handleDeleteTreatmentRecord = (id: string) => {
    const updated = treatmentRecords.filter((r) => r.id !== id);
    setTreatmentRecords(updated);
    saveTreatmentRecords(updated);
  };

  // Customer CRUD
  const handleAddCustomer = (customer: any) => {
    const updated = [...customers, customer];
    setCustomers(updated);
    saveCustomers(updated);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white relative">
      {/* Top App Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onResetData={handleResetData}
        pwaInstallable={!!deferredPrompt}
        onInstallPWA={handleInstallPWA}
      />

      {/* PWA / Offline Status Banner */}
      <PWAInstallBanner />

      {/* Main Interactive App Body (With bottom padding for Bottom Navigation) */}
      <main className="flex-1 p-3 sm:p-6 pb-24 sm:pb-28 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <DashboardView
            transactions={transactions}
            products={products}
            currentRole={currentRole}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'pos' && (
          <POSView
            products={products}
            customers={customers}
            currentRole={currentRole}
            onProcessSale={handleProcessSale}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            products={products}
            currentRole={currentRole}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'pnl' && (
          <ProfitLossView
            transactions={transactions}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'treatments' && (
          <TreatmentView
            records={treatmentRecords}
            products={products}
            currentRole={currentRole}
            onAddRecord={handleAddTreatmentRecord}
            onDeleteRecord={handleDeleteTreatmentRecord}
          />
        )}

        {activeTab === 'customers' && (
          <CustomerView
            customers={customers}
            transactions={transactions}
            onAddCustomer={handleAddCustomer}
          />
        )}
      </main>

      {/* App Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentRole={currentRole}
      />

      {/* Printable Receipt Modal */}
      <ReceiptModal
        transaction={latestTransaction}
        onClose={() => setLatestTransaction(null)}
      />
    </div>
  );
}
