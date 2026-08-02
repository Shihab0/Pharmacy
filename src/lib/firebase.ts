import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, Customer, TreatmentRecord, SaleTransaction } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_TREATMENT_RECORDS, INITIAL_TRANSACTIONS } from '../data/mockData';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Auth & Firestore with custom database ID from config
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Error Handling Infrastructure
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection check
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline.');
    }
    return false;
  }
}

// Authentication Helpers
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Database Seeding Logic
export async function seedInitialFirestoreData() {
  try {
    // Check products
    const prodSnap = await getDocs(collection(db, 'products'));
    if (prodSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_PRODUCTS.forEach((p) => {
        batch.set(doc(db, 'products', p.id), p);
      });
      await batch.commit();
      console.log('Seeded initial products to Firestore');
    }

    // Check customers
    const custSnap = await getDocs(collection(db, 'customers'));
    if (custSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_CUSTOMERS.forEach((c) => {
        batch.set(doc(db, 'customers', c.id), c);
      });
      await batch.commit();
      console.log('Seeded initial customers to Firestore');
    }

    // Check treatments
    const treatSnap = await getDocs(collection(db, 'treatmentRecords'));
    if (treatSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_TREATMENT_RECORDS.forEach((t) => {
        batch.set(doc(db, 'treatmentRecords', t.id), t);
      });
      await batch.commit();
      console.log('Seeded initial treatment records to Firestore');
    }

    // Check transactions
    const txSnap = await getDocs(collection(db, 'transactions'));
    if (txSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_TRANSACTIONS.forEach((tx) => {
        batch.set(doc(db, 'transactions', tx.id), tx);
      });
      await batch.commit();
      console.log('Seeded initial transactions to Firestore');
    }
  } catch (error) {
    console.warn('Firestore seeding skipped or restricted:', error);
  }
}

// Realtime Firestore Subscriptions & Operations
export function subscribeProducts(onData: (products: Product[]) => void) {
  const path = 'products';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const products: Product[] = [];
      snapshot.forEach((docSnap) => {
        products.push(docSnap.data() as Product);
      });
      onData(products);
    },
    (error) => {
      console.error('Error listening to products:', error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveProductToFirestore(product: Product) {
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, 'products', product.id), product);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProductFromFirestore(productId: string) {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeCustomers(onData: (customers: Customer[]) => void) {
  const path = 'customers';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const customers: Customer[] = [];
      snapshot.forEach((docSnap) => {
        customers.push(docSnap.data() as Customer);
      });
      onData(customers);
    },
    (error) => {
      console.error('Error listening to customers:', error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveCustomerToFirestore(customer: Customer) {
  const path = `customers/${customer.id}`;
  try {
    await setDoc(doc(db, 'customers', customer.id), customer);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeTreatmentRecords(onData: (records: TreatmentRecord[]) => void) {
  const path = 'treatmentRecords';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const records: TreatmentRecord[] = [];
      snapshot.forEach((docSnap) => {
        records.push(docSnap.data() as TreatmentRecord);
      });
      onData(records);
    },
    (error) => {
      console.error('Error listening to treatment records:', error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveTreatmentRecordToFirestore(record: TreatmentRecord) {
  const path = `treatmentRecords/${record.id}`;
  try {
    await setDoc(doc(db, 'treatmentRecords', record.id), record);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTreatmentRecordFromFirestore(recordId: string) {
  const path = `treatmentRecords/${recordId}`;
  try {
    await deleteDoc(doc(db, 'treatmentRecords', recordId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeTransactions(onData: (transactions: SaleTransaction[]) => void) {
  const path = 'transactions';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const transactions: SaleTransaction[] = [];
      snapshot.forEach((docSnap) => {
        transactions.push(docSnap.data() as SaleTransaction);
      });
      onData(transactions);
    },
    (error) => {
      console.error('Error listening to transactions:', error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveTransactionToFirestore(transaction: SaleTransaction) {
  const path = `transactions/${transaction.id}`;
  try {
    await setDoc(doc(db, 'transactions', transaction.id), transaction);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
