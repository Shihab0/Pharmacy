import React, { useState, useEffect } from 'react';
import { Role, Product, Customer, TreatmentRecord, SaleTransaction } from './types';
import { User } from 'firebase/auth';
import {
  subscribeToAuth,
  signInWithGoogle,
  logoutUser,
  testConnection,
  seedInitialFirestoreData,
  subscribeProducts,
  saveProductToFirestore,
  deleteProductFromFirestore,
  subscribeCustomers,
  saveCustomerToFirestore,
  subscribeTreatmentRecords,
  saveTreatmentRecordToFirestore,
  deleteTreatmentRecordFromFirestore,
  subscribeTransactions,
  saveTransactionToFirestore,
} from './lib/firebase';
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

import { ShopLandingPage } from './components/Landing/ShopLandingPage';
import { AuthModal } from './components/Auth/AuthModal';

import { POSView } from './components/POS/POSView';
import { InventoryView } from './components/Inventory/InventoryView';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ProfitLossView } from './components/Reports/ProfitLossView';
import { TreatmentView } from './components/Treatment/TreatmentView';
import { CustomerView } from './components/Customers/CustomerView';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('Super Admin');
  const [activeTab, setActiveTab] = useState<NavTab>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Authentication & Access Control States
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [staffEmails, setStaffEmails] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('agrovet_staff_emails');
      return saved ? JSON.parse(saved) : ['staff@agrovet.com', 'sakil@agrovet.com'];
    } catch {
      return ['staff@agrovet.com', 'sakil@agrovet.com'];
    }
  });

  // Application Data State
  const [products, setProducts] = useState<Product[]>(getProducts);
  const [customers, setCustomers] = useState<Customer[]>(getCustomers);
  const [treatmentRecords, setTreatmentRecords] = useState<TreatmentRecord[]>(getTreatmentRecords);
  const [transactions, setTransactions] = useState<SaleTransaction[]>(getTransactions);

  // Receipt Modal State
  const [latestTransaction, setLatestTransaction] = useState<SaleTransaction | null>(null);

  // PWA Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Load persisted role
    const savedRole = getCurrentRole();
    setCurrentRole(savedRole);

    // Listen to Firebase Auth
    const unsubscribeAuth = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const email = currentUser.email?.toLowerCase();
        if (email === 'atahershihab151@gmail.com') {
          setCurrentRole('Super Admin');
          saveCurrentRole('Super Admin');
          setIsAuthenticated(true);
        } else if (email && staffEmails.includes(email)) {
          setCurrentRole('Staff');
          saveCurrentRole('Staff');
          setIsAuthenticated(true);
        } else {
          // Unregistered email
          setIsAuthenticated(false);
        }
      }
    });

    // Test Firestore Connection & Seed Initial Data if necessary
    testConnection().then((isConnected) => {
      if (isConnected) {
        seedInitialFirestoreData();
      }
    });

    // Subscribe to Firestore Realtime Data
    const unsubProducts = subscribeProducts((firestoreProds) => {
      if (firestoreProds && firestoreProds.length > 0) {
        setProducts(firestoreProds);
        saveProducts(firestoreProds);
      }
    });

    const unsubCustomers = subscribeCustomers((firestoreCusts) => {
      if (firestoreCusts && firestoreCusts.length > 0) {
        setCustomers(firestoreCusts);
        saveCustomers(firestoreCusts);
      }
    });

    const unsubTreatments = subscribeTreatmentRecords((firestoreTreats) => {
      if (firestoreTreats && firestoreTreats.length > 0) {
        setTreatmentRecords(firestoreTreats);
        saveTreatmentRecords(firestoreTreats);
      }
    });

    const unsubTransactions = subscribeTransactions((firestoreTxs) => {
      if (firestoreTxs && firestoreTxs.length > 0) {
        setTransactions(firestoreTxs);
        saveTransactions(firestoreTxs);
      }
    });

    // Listen for PWA install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      unsubscribeAuth();
      unsubProducts();
      unsubCustomers();
      unsubTreatments();
      unsubTransactions();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, [staffEmails]);

  // Manage Staff Emails
  const handleAddStaffEmail = (email: string) => {
    const updated = Array.from(new Set([...staffEmails, email.toLowerCase()]));
    setStaffEmails(updated);
    try {
      localStorage.setItem('agrovet_staff_emails', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed saving staff emails', e);
    }
  };

  const handleRemoveStaffEmail = (email: string) => {
    const updated = staffEmails.filter((e) => e !== email.toLowerCase());
    setStaffEmails(updated);
    try {
      localStorage.setItem('agrovet_staff_emails', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed saving staff emails', e);
    }
  };

  // Firebase Google Login Handlers
  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      setIsAuthModalOpen(false);
      setActiveTab('pos');
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      setActiveTab('landing');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  // Demo Login Handler
  const handleDemoLogin = (role: Role) => {
    setCurrentRole(role);
    saveCurrentRole(role);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setActiveTab('pos');
  };

  // Handle Navigation Tab Request with Auth Check
  const handleTabChange = (targetTab: NavTab) => {
    if (targetTab === 'landing') {
      setActiveTab('landing');
      return;
    }

    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    // Role restrictions: Staff cannot access admin tabs
    if (currentRole === 'Staff' && ['dashboard', 'inventory', 'pnl'].includes(targetTab)) {
      alert('এই সেকশনটি শুধুমাত্র এডমিন ব্যবহার করতে পারবেন।');
      return;
    }

    setActiveTab(targetTab);
  };

  // Sync role changes manually
  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    saveCurrentRole(newRole);

    if (newRole === 'Staff' && ['dashboard', 'inventory', 'pnl'].includes(activeTab)) {
      setActiveTab('pos');
    }
  };

  // Reset Data to Seeds
  const handleResetData = () => {
    if (confirm('আপনি কি এগ্রোভেট ফার্মেসির ডাটা রিসেট করে ডিফল্ট ডেমো ডাটাতে ফিরে যেতে চান?')) {
      resetToSeedData();
      const p = getProducts();
      const c = getCustomers();
      const t = getTreatmentRecords();
      const tx = getTransactions();
      setProducts(p);
      setCustomers(c);
      setTreatmentRecords(t);
      setTransactions(tx);

      // Sync reset data to Firestore as well
      p.forEach(saveProductToFirestore);
      c.forEach(saveCustomerToFirestore);
      t.forEach(saveTreatmentRecordToFirestore);
      tx.forEach(saveTransactionToFirestore);
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
  const handleProcessSale = (transaction: SaleTransaction) => {
    // 1. Deduct Inventory Stock
    const updatedProducts = products.map((prod) => {
      const soldItem = transaction.items.find((item) => item.productId === prod.id);
      if (soldItem) {
        const updatedProd = {
          ...prod,
          stock: Math.max(0, prod.stock - soldItem.quantity),
        };
        saveProductToFirestore(updatedProd);
        return updatedProd;
      }
      return prod;
    });

    setProducts(updatedProducts);
    saveProducts(updatedProducts);

    // 2. Save Transaction to state & Firestore
    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    saveTransactionToFirestore(transaction);

    // 3. Update Customer Total Spent if customer linked
    if (transaction.customerId) {
      const updatedCustomers = customers.map((c) => {
        if (c.id === transaction.customerId) {
          const updatedCust = {
            ...c,
            totalSpent: c.totalSpent + transaction.grandTotal,
            lastVisit: new Date().toISOString().slice(0, 10),
          };
          saveCustomerToFirestore(updatedCust);
          return updatedCust;
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
  const handleAddProduct = (newProduct: Product) => {
    const updated = [...products, newProduct];
    setProducts(updated);
    saveProducts(updated);
    saveProductToFirestore(newProduct);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    setProducts(updated);
    saveProducts(updated);
    saveProductToFirestore(updatedProduct);
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    saveProducts(updated);
    deleteProductFromFirestore(productId);
  };

  // Treatment CRUD
  const handleAddTreatmentRecord = (record: TreatmentRecord) => {
    const updated = [record, ...treatmentRecords];
    setTreatmentRecords(updated);
    saveTreatmentRecords(updated);
    saveTreatmentRecordToFirestore(record);
  };

  const handleDeleteTreatmentRecord = (id: string) => {
    const updated = treatmentRecords.filter((r) => r.id !== id);
    setTreatmentRecords(updated);
    saveTreatmentRecords(updated);
    deleteTreatmentRecordFromFirestore(id);
  };

  // Customer CRUD
  const handleAddCustomer = (customer: Customer) => {
    const updated = [...customers, customer];
    setCustomers(updated);
    saveCustomers(updated);
    saveCustomerToFirestore(customer);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white relative overflow-x-hidden max-w-full">
      {/* Top App Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onResetData={handleResetData}
        pwaInstallable={!!deferredPrompt}
        onInstallPWA={handleInstallPWA}
        user={user}
        onSignInWithGoogle={handleSignInWithGoogle}
        onSignOut={handleSignOut}
        onOpenLanding={() => setActiveTab('landing')}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* PWA / Offline Status Banner */}
      <PWAInstallBanner />

      {/* Main Interactive App Body */}
      {activeTab === 'landing' ? (
        <main className="flex-1 pb-24 sm:pb-28 w-full">
          <ShopLandingPage
            products={products}
            onLoginClick={() => setIsAuthModalOpen(true)}
          />
        </main>
      ) : (
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
      )}

      {/* App Fixed Bottom Navigation Bar - Only shown when logged in */}
      {isAuthenticated && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          currentRole={currentRole}
        />
      )}

      {/* Auth & Role Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        isAuthenticated={isAuthenticated}
        currentRole={currentRole}
        staffEmails={staffEmails}
        onAddStaffEmail={handleAddStaffEmail}
        onRemoveStaffEmail={handleRemoveStaffEmail}
        onSignInWithGoogle={handleSignInWithGoogle}
        onSignOut={handleSignOut}
        onDemoLogin={handleDemoLogin}
      />

      {/* Printable Receipt Modal */}
      <ReceiptModal
        transaction={latestTransaction}
        onClose={() => setLatestTransaction(null)}
      />
    </div>
  );
}

