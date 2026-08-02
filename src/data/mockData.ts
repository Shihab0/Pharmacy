import { Product, Customer, TreatmentRecord, SaleTransaction } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Oxytetra LA Injection',
    genericName: 'Oxytetracycline Dihydrate 200mg/ml',
    category: 'Medicine',
    targetAnimal: 'Cattle',
    costPrice: 4.50,
    sellingPrice: 7.00,
    stock: 28,
    minStockAlert: 10,
    unit: '100ml Vial',
    expiryDate: '2027-05-15',
    batchNumber: 'OXY-8821',
    dosageInfo: '1 ml per 10 kg body weight IM deep',
    supplier: 'Square Vet Pharma'
  },
  {
    id: 'prod-2',
    name: 'Ivervet 1% Injectable Dewormer',
    genericName: 'Ivermectin 10mg/ml',
    category: 'Medicine',
    targetAnimal: 'Goat/Sheep',
    costPrice: 3.20,
    sellingPrice: 5.50,
    stock: 6, // LOW STOCK
    minStockAlert: 12,
    unit: '50ml Vial',
    expiryDate: '2026-09-10', // EXPIRING SOON (within ~60 days of Aug 2026)
    batchNumber: 'IVR-4412',
    dosageInfo: '1 ml per 50 kg Subcutaneous only',
    supplier: 'Renata Animal Health'
  },
  {
    id: 'prod-3',
    name: 'AgroCal-D Plus Drench',
    genericName: 'Calcium, Phosphorus & Vitamin D3 Syrup',
    category: 'Supplement',
    targetAnimal: 'Cattle',
    costPrice: 8.00,
    sellingPrice: 13.50,
    stock: 42,
    minStockAlert: 15,
    unit: '1 Litre Bottle',
    expiryDate: '2027-11-20',
    batchNumber: 'CAL-9003',
    dosageInfo: '100ml daily after milking for milk fever prevention',
    supplier: 'ACI AgroVet'
  },
  {
    id: 'prod-4',
    name: 'PPR-Vax Live Attenuated',
    genericName: 'Pest des Petits Ruminants Vaccine',
    category: 'Vaccine',
    targetAnimal: 'Goat/Sheep',
    costPrice: 1.10,
    sellingPrice: 2.20,
    stock: 120,
    minStockAlert: 30,
    unit: '100 Dose Vial',
    expiryDate: '2026-08-25', // EXPIRING VERY SOON
    batchNumber: 'PPR-0091',
    dosageInfo: 'Reconstitute in cold diluent. 1ml SC per goat',
    supplier: 'Livestock Vaccine Institute'
  },
  {
    id: 'prod-5',
    name: 'Broiler Starter Booster Feed',
    genericName: 'High Protein Poultry Feed Concentrate',
    category: 'Feed',
    targetAnimal: 'Poultry',
    costPrice: 22.00,
    sellingPrice: 29.00,
    stock: 5, // LOW STOCK
    minStockAlert: 15,
    unit: '25kg Bag',
    expiryDate: '2026-12-30',
    batchNumber: 'FEED-7711',
    dosageInfo: 'Ad libitum feeding for 0-14 days chicks',
    supplier: 'Quality Feeds Ltd'
  },
  {
    id: 'prod-6',
    name: 'Amoxy-Vet Soluble Powder',
    genericName: 'Amoxicillin Trihydrate 50% W/W',
    category: 'Medicine',
    targetAnimal: 'Poultry',
    costPrice: 6.80,
    sellingPrice: 11.00,
    stock: 35,
    minStockAlert: 10,
    unit: '100g Sachet',
    expiryDate: '2028-01-10',
    batchNumber: 'AMX-3312',
    dosageInfo: '1g per 5 Litres drinking water for 3-5 days',
    supplier: 'Novartis Animal Health'
  },
  {
    id: 'prod-7',
    name: 'SuperVet Multivitamin Bolus',
    genericName: 'Essential Trace Minerals & Vitamins A, D3, E',
    category: 'Supplement',
    targetAnimal: 'Cattle',
    costPrice: 0.80,
    sellingPrice: 1.50,
    stock: 250,
    minStockAlert: 50,
    unit: 'Bolus Strip (4s)',
    expiryDate: '2027-08-10',
    batchNumber: 'VIT-1092',
    dosageInfo: '1 bolus orally daily for ruminal support',
    supplier: 'Square Vet Pharma'
  },
  {
    id: 'prod-8',
    name: 'Automatic Continuous Syringe 5ml',
    genericName: 'Stainless Steel Adjustable Drench Gun',
    category: 'Equipment',
    targetAnimal: 'Aqua/All',
    costPrice: 18.00,
    sellingPrice: 28.00,
    stock: 8,
    minStockAlert: 3,
    unit: 'Piece',
    expiryDate: '2035-01-01',
    batchNumber: 'EQ-0012',
    dosageInfo: 'Autoclavable 0.5ml - 5ml adjustable dosage',
    supplier: 'VetTools Importers'
  },
  {
    id: 'prod-9',
    name: 'Newcastle (Ranikhet) RDV Vaccine',
    genericName: 'F Strain Newcastle Disease Vaccine',
    category: 'Vaccine',
    targetAnimal: 'Poultry',
    costPrice: 1.50,
    sellingPrice: 3.00,
    stock: 80,
    minStockAlert: 20,
    unit: '500 Dose Ampoule',
    expiryDate: '2026-09-01', // EXPIRING SOON
    batchNumber: 'NDV-5512',
    dosageInfo: '1 drop intraocular/intranasal in day-old chicks',
    supplier: 'Livestock Vaccine Institute'
  },
  {
    id: 'prod-10',
    name: 'Vet-Surgical Teat Dilator & Probe',
    genericName: 'Stainless Steel Teat Cannula Set',
    category: 'Equipment',
    targetAnimal: 'Cattle',
    costPrice: 2.50,
    sellingPrice: 4.80,
    stock: 4, // LOW STOCK
    minStockAlert: 8,
    unit: 'Set (3 Pcs)',
    expiryDate: '2035-12-31',
    batchNumber: 'EQ-9901',
    dosageInfo: 'Sterilized single-use teat catheter',
    supplier: 'VetTools Importers'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Hafizur Rahman',
    phone: '+880 1712-345678',
    address: 'Green Valley Dairy Farm, Sector 4, Rural Zone',
    farmType: 'Dairy Farm (24 Friesian Cows)',
    totalSpent: 485.00,
    dueBalance: 35.00,
    lastVisit: '2026-08-01',
    notes: 'Regular buyer of Calcium drench and mastitis treatment.'
  },
  {
    id: 'cust-2',
    name: 'Anwara Begum',
    phone: '+880 1819-876543',
    address: 'Sonali Agro Poultry Complex, Village North',
    farmType: 'Poultry Broiler Farm (1,200 Birds)',
    totalSpent: 890.50,
    dueBalance: 0.00,
    lastVisit: '2026-07-29',
    notes: 'Buys broiler starter feed and water antibiotics in bulk.'
  },
  {
    id: 'cust-3',
    name: 'Kamal Hossain',
    phone: '+880 1911-554433',
    address: 'Hillside Goat Rearing Farm',
    farmType: 'Goat & Sheep Farm (35 Black Bengal Goats)',
    totalSpent: 195.00,
    dueBalance: 12.00,
    lastVisit: '2026-08-02',
    notes: 'PPR vaccination scheduled every 6 months.'
  },
  {
    id: 'cust-4',
    name: 'Dr. Sharmin Akter (Pet Clinic)',
    phone: '+880 1622-110099',
    address: 'Town Companion Animal Hospital',
    farmType: 'Pet & Companion Care',
    totalSpent: 620.00,
    dueBalance: 0.00,
    lastVisit: '2026-07-25',
    notes: 'Prompt payer. Uses credit card for surgical supplies.'
  }
];

export const INITIAL_TREATMENT_RECORDS: TreatmentRecord[] = [
  {
    id: 'treat-1',
    date: '2026-08-01',
    farmerName: 'Hafizur Rahman',
    farmerPhone: '+880 1712-345678',
    animalType: 'Holstein Friesian Cow',
    tagOrName: 'Cow #EF-204',
    symptoms: 'High fever 104°F, acute swelling in hind quarter teat, blood in milk',
    diagnosis: 'Acute Clinical Mastitis',
    treatmentsGiven: [
      { medicineName: 'Oxytetra LA Injection', dosage: '15 ml Deep IM', durationDays: 3 },
      { medicineName: 'SuperVet Multivitamin Bolus', dosage: '2 Bolus Daily Oral', durationDays: 5 }
    ],
    vetDoctorOrTech: 'Dr. M. Alam (DVM)',
    followUpDate: '2026-08-04',
    status: 'Follow-up Needed',
    notes: 'Advised milk discarding for 7 days withdrawal period.'
  },
  {
    id: 'treat-2',
    date: '2026-07-30',
    farmerName: 'Kamal Hossain',
    farmerPhone: '+880 1911-554433',
    animalType: 'Black Bengal Goat',
    tagOrName: 'Goat #G-12',
    symptoms: 'Severe coughing, nasal discharge, watery eyes, temperature 103.5°F',
    diagnosis: 'Respiratory Tract Infection (Pneumonia risk)',
    treatmentsGiven: [
      { medicineName: 'Amoxy-Vet Soluble Powder', dosage: '2g in 1L water', durationDays: 4 },
      { medicineName: 'Ivervet 1% Injectable Dewormer', dosage: '0.8 ml Subcutaneous', durationDays: 1 }
    ],
    vetDoctorOrTech: 'Vet Tech Sumon',
    followUpDate: '2026-08-03',
    status: 'Completed',
    notes: 'Goat responded well, appetite restored.'
  },
  {
    id: 'treat-3',
    date: '2026-07-28',
    farmerName: 'Anwara Begum',
    farmerPhone: '+880 1819-876543',
    animalType: 'Broiler Flock (Flock B)',
    tagOrName: 'Shed #2 (600 Chicks)',
    symptoms: 'Sudden lethargy, huddling near heat lamp, loose greenish droppings',
    diagnosis: 'Early E. coli / Omphalitis',
    treatmentsGiven: [
      { medicineName: 'Amoxy-Vet Soluble Powder', dosage: '10g per 50L drinking water', durationDays: 5 }
    ],
    vetDoctorOrTech: 'Dr. M. Alam (DVM)',
    followUpDate: '2026-08-02',
    status: 'Completed',
    notes: 'Mortality dropped to normal. Recommended farm bio-security spray.'
  }
];

export const INITIAL_TRANSACTIONS: SaleTransaction[] = [
  {
    id: 'tx-1001',
    invoiceNo: 'INV-20260801-01',
    timestamp: '2026-08-01T10:15:00.000Z',
    customerId: 'cust-1',
    customerName: 'Hafizur Rahman',
    customerPhone: '+880 1712-345678',
    items: [
      {
        productId: 'prod-1',
        productName: 'Oxytetra LA Injection',
        genericName: 'Oxytetracycline Dihydrate 200mg/ml',
        unit: '100ml Vial',
        quantity: 2,
        unitSellingPrice: 7.00,
        unitCostPrice: 4.50,
        totalPrice: 14.00
      },
      {
        productId: 'prod-3',
        productName: 'AgroCal-D Plus Drench',
        genericName: 'Calcium, Phosphorus & Vitamin D3 Syrup',
        unit: '1 Litre Bottle',
        quantity: 1,
        unitSellingPrice: 13.50,
        unitCostPrice: 8.00,
        totalPrice: 13.50
      }
    ],
    subtotal: 27.50,
    discount: 0,
    tax: 0,
    grandTotal: 27.50,
    totalCost: 17.00,
    netProfit: 10.50,
    paymentMethod: 'Cash',
    handledByRole: 'Staff',
    staffName: 'Jamal (Staff)'
  },
  {
    id: 'tx-1002',
    invoiceNo: 'INV-20260802-02',
    timestamp: '2026-08-02T08:30:00.000Z',
    customerId: 'cust-3',
    customerName: 'Kamal Hossain',
    customerPhone: '+880 1911-554433',
    items: [
      {
        productId: 'prod-2',
        productName: 'Ivervet 1% Injectable Dewormer',
        genericName: 'Ivermectin 10mg/ml',
        unit: '50ml Vial',
        quantity: 1,
        unitSellingPrice: 5.50,
        unitCostPrice: 3.20,
        totalPrice: 5.50
      },
      {
        productId: 'prod-7',
        productName: 'SuperVet Multivitamin Bolus',
        genericName: 'Essential Trace Minerals',
        unit: 'Bolus Strip (4s)',
        quantity: 5,
        unitSellingPrice: 1.50,
        unitCostPrice: 0.80,
        totalPrice: 7.50
      }
    ],
    subtotal: 13.00,
    discount: 1.00,
    tax: 0,
    grandTotal: 12.00,
    totalCost: 7.20,
    netProfit: 4.80,
    paymentMethod: 'Mobile Banking',
    handledByRole: 'Super Admin',
    staffName: 'Admin Manager'
  }
];
