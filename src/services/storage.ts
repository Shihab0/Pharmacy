import { Product, Customer, TreatmentRecord, SaleTransaction, Role } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_TREATMENT_RECORDS, INITIAL_TRANSACTIONS } from '../data/mockData';

const KEYS = {
  PRODUCTS: 'agrovet_products_v1',
  CUSTOMERS: 'agrovet_customers_v1',
  TREATMENTS: 'agrovet_treatments_v1',
  TRANSACTIONS: 'agrovet_transactions_v1',
  ROLE: 'agrovet_current_role_v1'
};

export function getProducts(): Product[] {
  const data = localStorage.getItem(KEYS.PRODUCTS);
  if (!data) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
}

export function getCustomers(): Customer[] {
  const data = localStorage.getItem(KEYS.CUSTOMERS);
  if (!data) {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_CUSTOMERS;
  }
}

export function saveCustomers(customers: Customer[]): void {
  localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
}

export function getTreatmentRecords(): TreatmentRecord[] {
  const data = localStorage.getItem(KEYS.TREATMENTS);
  if (!data) {
    localStorage.setItem(KEYS.TREATMENTS, JSON.stringify(INITIAL_TREATMENT_RECORDS));
    return INITIAL_TREATMENT_RECORDS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_TREATMENT_RECORDS;
  }
}

export function saveTreatmentRecords(records: TreatmentRecord[]): void {
  localStorage.setItem(KEYS.TREATMENTS, JSON.stringify(records));
}

export function getTransactions(): SaleTransaction[] {
  const data = localStorage.getItem(KEYS.TRANSACTIONS);
  if (!data) {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveTransactions(transactions: SaleTransaction[]): void {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

export function getCurrentRole(): Role {
  const role = localStorage.getItem(KEYS.ROLE) as Role;
  return (role === 'Super Admin' || role === 'Staff') ? role : 'Super Admin';
}

export function saveCurrentRole(role: Role): void {
  localStorage.setItem(KEYS.ROLE, role);
}

export function resetToSeedData(): void {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
  localStorage.setItem(KEYS.TREATMENTS, JSON.stringify(INITIAL_TREATMENT_RECORDS));
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
}
