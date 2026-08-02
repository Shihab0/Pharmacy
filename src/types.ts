export type Role = 'Super Admin' | 'Staff';

export type ProductCategory = 'Medicine' | 'Vaccine' | 'Feed' | 'Supplement' | 'Equipment';

export type AnimalTarget = 'Cattle' | 'Poultry' | 'Goat/Sheep' | 'Pet' | 'Aqua/All';

export interface Product {
  id: string;
  name: string;
  genericName: string;
  category: ProductCategory;
  targetAnimal: AnimalTarget;
  costPrice: number; // Buying price (Admin ONLY)
  sellingPrice: number; // Selling price
  stock: number;
  minStockAlert: number;
  unit: string; // e.g. '100ml Vial', 'Bolus Strip', '25kg Bag', 'Tablet'
  expiryDate: string; // YYYY-MM-DD
  batchNumber: string;
  dosageInfo?: string;
  supplier?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discountPercentage: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  genericName: string;
  unit: string;
  quantity: number;
  unitSellingPrice: number;
  unitCostPrice: number; // Stored for accurate historical profit reporting
  totalPrice: number;
}

export interface SaleTransaction {
  id: string;
  invoiceNo: string;
  timestamp: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  totalCost: number; // Sum of unitCostPrice * qty
  netProfit: number; // grandTotal - totalCost
  paymentMethod: 'Cash' | 'Mobile Banking' | 'Card' | 'Credit / Due';
  handledByRole: Role;
  staffName: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  farmType: string; // e.g., 'Dairy Farm (15 Cows)', 'Poultry Farm (500 Birds)', 'Household Pet'
  totalSpent: number;
  dueBalance: number;
  lastVisit: string;
  notes?: string;
}

export interface TreatmentRecord {
  id: string;
  date: string;
  farmerName: string;
  farmerPhone: string;
  animalType: string; // e.g., 'Holstein Fresian Cow', 'Boer Goat', 'Broiler Chickens'
  tagOrName?: string; // e.g., 'Tag #104' or 'Tommy'
  symptoms: string;
  diagnosis: string;
  treatmentsGiven: {
    medicineName: string;
    dosage: string;
    durationDays: number;
  }[];
  vetDoctorOrTech: string;
  followUpDate?: string;
  status: 'Completed' | 'Follow-up Needed' | 'Critical';
  notes?: string;
}
