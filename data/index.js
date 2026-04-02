// ─── USER ────────────────────────────────────────────────────────────────────
export const BANK = {
  name: 'TheAdage Bank',
  tagline: 'BANKING REDEFINED',
  shortName: 'TAB',
  support: '0748232218',
  email: 'support@theadagebank.co.ke',
  website: 'theadagebank.co.ke',
};

export const USER = {
  name: 'Sharon Bellah',
  email: 'sharon.bellah@gmail.com',
  initials: 'SB',
  memberType: 'Premium Member',
  phone: '+254 712 345 678',
  idNumber: '12345678',
  address: '14 Westlands Road, Nairobi',
  branch: 'Westlands Branch',
  branchCode: 'WL001',
  branchAddress: 'Westlands Commercial Centre, Nairobi',
  branchPhone: '+254 20 374 5000',
  customerSince: 'March 2019',
  relationship: 'Relationship Manager: Alice Kamau',
  // Demo credentials
  username: 'bellah',
  password: 'demo1234',
};

// ─── ACCOUNTS ────────────────────────────────────────────────────────────────
export const ACCOUNTS = [
  {
    id: 'acc1',
    name: 'Savings Account',
    number: '6789',
    balance: 52500,
    icon: 'cash',
    spentPct: 0.3,
    monthSpend: 15750,
    monthLimit: 52500,
  },
  {
    id: 'acc2',
    name: 'Current Account',
    number: '4321',
    balance: 10200,
    icon: 'business',
    spentPct: 0.72,
    monthSpend: 7344,
    monthLimit: 10200,
  },
];

export const TOTAL_BALANCE = ACCOUNTS.reduce((s, a) => s + a.balance, 0);


export const CARDS = [
  { id: 'c1', cardType: 'Debit Card',  network: 'VISA',       last4: '1234', holder: 'SHARON BELLAH', accountId: 'acc1', accountName: 'Savings Account',  expiry: '12/28' },
  { id: 'c2', cardType: 'Debit Card',  network: 'MASTERCARD', last4: '5678', holder: 'SHARON BELLAH', accountId: 'acc2', accountName: 'Current Account', expiry: '09/27' },
];

//TRANSACTIONS 
const Y = new Date().getFullYear();
const M = new Date().toLocaleString('en-GB', { month: 'short' });
const PM = new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('en-GB', { month: 'short' });

export const TRANSACTIONS = [
  { id: 't1',  name: 'Salary Credit',    date: `${M} 30, ${Y}`,  amount: 85000,  icon: 'briefcase',   category: 'Income' },
  { id: 't2',  name: 'Java Coffee',      date: `${M} 29, ${Y}`,  amount: -550,   icon: 'cafe',        category: 'Food & Drink' },
  { id: 't3',  name: 'Grocery Store',    date: `${M} 28, ${Y}`,  amount: -4230,  icon: 'basket',      category: 'Shopping' },
  { id: 't4',  name: 'Electricity Bill', date: `${M} 27, ${Y}`,  amount: -800,   icon: 'flash',       category: 'Utilities' },
  { id: 't5',  name: 'Amazon Purchase',  date: `${M} 26, ${Y}`,  amount: -1200,  icon: 'cube',        category: 'Shopping' },
  { id: 't6',  name: 'Netflix',          date: `${M} 25, ${Y}`,  amount: -1500,  icon: 'tv',          category: 'Entertainment' },
  { id: 't7',  name: 'Freelance Pay',    date: `${M} 24, ${Y}`,  amount: 12000,  icon: 'laptop',      category: 'Income' },
  { id: 't8',  name: 'Uber Ride',        date: `${M} 23, ${Y}`,  amount: -350,   icon: 'car',         category: 'Transport' },
  { id: 't9',  name: 'Pharmacy',         date: `${M} 22, ${Y}`,  amount: -900,   icon: 'medkit',      category: 'Health' },
  { id: 't10', name: 'Rent Refund',      date: `${M} 21, ${Y}`,  amount: 5000,   icon: 'home',        category: 'Income' },
  { id: 't11', name: 'Loan Repayment',   date: `${M} 20, ${Y}`,  amount: -4200,  icon: 'trending-up', category: 'Loan' },
  { id: 't12', name: 'Savings Deposit',  date: `${M} 19, ${Y}`,  amount: -10000, icon: 'wallet',      category: 'Savings' },
  { id: 't13', name: 'M-Pesa Received',  date: `${PM} 30, ${Y}`, amount: 5000,   icon: 'phone-portrait', category: 'M-Pesa' },
  { id: 't14', name: 'Salary Credit',    date: `${PM} 28, ${Y}`, amount: 85000,  icon: 'briefcase',   category: 'Income' },
  { id: 't15', name: 'DSTV',             date: `${PM} 15, ${Y}`, amount: -2500,  icon: 'tv',          category: 'Entertainment' },
];

//LOANS
export const LOANS = [
  {
    id: 'l1',
    name: 'Personal Loan',
    principal: 105000,
    balance: 42000,
    paid: 63000,
    monthlyPayment: 4200,
    interestRate: 14,
    nextDue: `${new Date(new Date().setMonth(new Date().getMonth()+1)).toLocaleString('en-GB',{month:'short'})} 1, ${new Date().getFullYear()}`,
    startDate: `Jan 1, ${new Date().getFullYear()}`,
    endDate: `Dec 1, ${new Date().getFullYear()+1}`,
    status: 'Active',
    repayments: [
      { month: `${new Date().toLocaleString('en-GB',{month:'short'})} ${new Date().getFullYear()}`, amount: 4200, status: 'Paid' },
      { month: `${new Date(new Date().setMonth(new Date().getMonth()-1)).toLocaleString('en-GB',{month:'short'})} ${new Date().getFullYear()}`, amount: 4200, status: 'Paid' },
      { month: `${new Date(new Date().setMonth(new Date().getMonth()-2)).toLocaleString('en-GB',{month:'short'})} ${new Date().getFullYear()}`, amount: 4200, status: 'Paid' },
      { month: `${new Date(new Date().setMonth(new Date().getMonth()+1)).toLocaleString('en-GB',{month:'short'})} ${new Date().getFullYear()}`, amount: 4200, status: 'Upcoming' },
    ],
  },
  {
    id: 'l2',
    name: 'Emergency Loan',
    principal: 20000,
    balance: 0,
    paid: 20000,
    monthlyPayment: 2000,
    interestRate: 12,
    nextDue: null,
    startDate: `Mar 1, ${new Date().getFullYear()-1}`,
    endDate: `Feb 1, ${new Date().getFullYear()}`,
    status: 'Cleared',
    repayments: [],
  },
];

export const LOAN_PRODUCTS = [
  { id: 'lp1', name: 'Personal Loan',   maxAmount: 500000, rate: 14, tenure: '12–36 months', icon: 'person' },
  { id: 'lp2', name: 'Emergency Loan',  maxAmount: 50000,  rate: 12, tenure: '1–12 months',  icon: 'flash' },
  { id: 'lp3', name: 'Business Loan',   maxAmount: 2000000,rate: 16, tenure: '12–60 months', icon: 'business' },
  { id: 'lp4', name: 'Asset Finance',   maxAmount: 5000000,rate: 18, tenure: '24–72 months', icon: 'car' },
];

// ───  ────────────────────────────────────────────────────────────
export const SAVINGS_GOALS = [
  {
    id: 's1',
    name: 'Emergency Fund',
    target: 100000,
    saved: 52500,
    monthlyContrib: 5000,
    icon: 'shield-checkmark',
    color: '#8B1C3F',
    deadline: 'Dec 2025',
  },
  {
    id: 's2',
    name: 'New Laptop',
    target: 80000,
    saved: 32000,
    monthlyContrib: 8000,
    icon: 'laptop',
    color: '#C4955A',
    deadline: 'Mar 2025',
  },
  {
    id: 's3',
    name: 'Vacation',
    target: 150000,
    saved: 18000,
    monthlyContrib: 10000,
    icon: 'airplane',
    color: '#5a6e8b',
    deadline: 'Aug 2025',
  },
];

export const FIXED_DEPOSITS = [
  { id: 'fd1', name: 'Fixed Deposit', amount: 50000, rate: 9.5, maturity: 'Jun 2025', interest: 4750 },
];

// ─── CONTACTS ────────────────────────────────────────────────────────────────
export const CONTACTS = [
  { id: 'cn1', name: 'Jane Smith',   initials: 'JS', color: '#7a6a5a' },
  { id: 'cn2', name: 'Mike Johnson', initials: 'MJ', color: '#5a6a7a' },
  { id: 'cn3', name: 'Sarah Lee',    initials: 'SL', color: '#8B1C3F' },
  { id: 'cn4', name: 'Tom Brown',    initials: 'TB', color: '#6a7a5a' },
  { id: 'cn5', name: 'Amy Wilson',   initials: 'AW', color: '#C4955A' },
];

// ─── SPEND BARS (weekly) ──────────────────────────────────────────────────────
export const SPEND_BARS = [
  { day: 'M', h: 40 }, { day: 'T', h: 65 }, { day: 'W', h: 30 },
  { day: 'T', h: 80 }, { day: 'F', h: 55 }, { day: 'S', h: 20 }, { day: 'S', h: 45 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
export const fmt = (n) => `KES ${Number(n).toLocaleString()}`;
export const pct = (a, b) => Math.min(Math.round((a / b) * 100), 100);

// ─── FOREX RATES (static demo — in real app fetched from API) ────────────────
export const FOREX_RATES = [
  { id: 'f1', currency: 'USD', name: 'US Dollar',       buy: 128.50, sell: 129.80, flag: '🇺🇸' },
  { id: 'f2', currency: 'EUR', name: 'Euro',             buy: 139.20, sell: 140.60, flag: '🇪🇺' },
  { id: 'f3', currency: 'GBP', name: 'British Pound',   buy: 162.40, sell: 164.10, flag: '🇬🇧' },
  { id: 'f4', currency: 'AED', name: 'UAE Dirham',      buy:  34.90, sell:  35.40, flag: '🇦🇪' },
  { id: 'f5', currency: 'ZAR', name: 'South African Rand', buy: 6.80, sell: 7.10, flag: '🇿🇦' },
  { id: 'f6', currency: 'TZS', name: 'Tanzanian Shilling', buy: 0.049, sell: 0.052, flag: '🇹🇿' },
  { id: 'f7', currency: 'UGX', name: 'Ugandan Shilling',   buy: 0.033, sell: 0.036, flag: '🇺🇬' },
  { id: 'f8', currency: 'CNY', name: 'Chinese Yuan',    buy: 17.60, sell: 18.10, flag: '🇨🇳' },
];

// ─── INTEREST RATES ───────────────────────────────────────────────────────────
export const INTEREST_RATES = [
  { label: 'Savings Account',   rate: '7.5% p.a.',  type: 'deposit' },
  { label: 'Fixed Deposit (1yr)', rate: '9.5% p.a.', type: 'deposit' },
  { label: 'Fixed Deposit (2yr)', rate: '10.5% p.a.',type: 'deposit' },
  { label: 'Personal Loan',     rate: '14% p.a.',   type: 'loan' },
  { label: 'Emergency Loan',    rate: '12% p.a.',   type: 'loan' },
  { label: 'Business Loan',     rate: '16% p.a.',   type: 'loan' },
  { label: 'Asset Finance',     rate: '18% p.a.',   type: 'loan' },
  { label: 'Mortgage',          rate: '13% p.a.',   type: 'loan' },
];

// ─── BRANCHES ─────────────────────────────────────────────────────────────────
export const BRANCHES = [
  // Nairobi
  { id: 'b1',  name: 'Westlands Branch',       county: 'Nairobi',    address: 'Westlands Commercial Centre',       phone: '+254 20 374 5000', hours: 'Mon–Fri 8am–5pm, Sat 9am–1pm' },
  { id: 'b2',  name: 'CBD Branch',             county: 'Nairobi',    address: 'Kimathi Street, Nairobi CBD',       phone: '+254 20 221 8000', hours: 'Mon–Fri 8am–5pm, Sat 9am–1pm' },
  { id: 'b3',  name: 'Karen Branch',           county: 'Nairobi',    address: 'Karen Shopping Centre',             phone: '+254 20 883 2000', hours: 'Mon–Fri 9am–5pm, Sat 9am–2pm' },
  { id: 'b4',  name: 'Eastleigh Branch',       county: 'Nairobi',    address: '1st Avenue, Eastleigh',             phone: '+254 20 765 4000', hours: 'Mon–Fri 8am–5pm, Sat 9am–1pm' },
  // Mombasa
  { id: 'b5',  name: 'Mombasa CBD Branch',     county: 'Mombasa',    address: 'Nkrumah Road, Mombasa',            phone: '+254 41 222 1000', hours: 'Mon–Fri 8am–4:30pm' },
  { id: 'b6',  name: 'Nyali Branch',           county: 'Mombasa',    address: 'Nyali Centre, Links Road',          phone: '+254 41 547 2000', hours: 'Mon–Fri 8:30am–5pm, Sat 9am–1pm' },
  // Kisumu
  { id: 'b7',  name: 'Kisumu Central Branch',  county: 'Kisumu',     address: 'Oginga Odinga Street, Kisumu',      phone: '+254 57 202 5000', hours: 'Mon–Fri 8am–5pm, Sat 9am–12pm' },
  { id: 'b8',  name: 'Kondele Branch',         county: 'Kisumu',     address: 'Kondele Shopping Complex',          phone: '+254 57 351 6000', hours: 'Mon–Fri 8am–4:30pm' },
  // Nakuru
  { id: 'b9',  name: 'Nakuru Branch',          county: 'Nakuru',     address: 'Kenyatta Avenue, Nakuru Town',      phone: '+254 51 221 3000', hours: 'Mon–Fri 8am–5pm, Sat 9am–1pm' },
  { id: 'b10', name: 'Naivasha Branch',        county: 'Nakuru',     address: 'Moi South Lake Road, Naivasha',     phone: '+254 50 202 1000', hours: 'Mon–Fri 8:30am–4:30pm' },
  // Eldoret
  { id: 'b11', name: 'Eldoret Branch',         county: 'Uasin Gishu',address: 'Uganda Road, Eldoret',              phone: '+254 53 206 3000', hours: 'Mon–Fri 8am–5pm, Sat 9am–1pm' },
  // Nyeri
  { id: 'b12', name: 'Nyeri Branch',           county: 'Nyeri',      address: 'Kimathi Way, Nyeri Town',           phone: '+254 61 203 2000', hours: 'Mon–Fri 8am–5pm' },
  // Machakos
  { id: 'b13', name: 'Machakos Branch',        county: 'Machakos',   address: 'Hospital Road, Machakos',           phone: '+254 44 202 1000', hours: 'Mon–Fri 8am–4:30pm' },
  // Kisii
  { id: 'b14', name: 'Kisii Branch',           county: 'Kisii',      address: 'Hospital Road, Kisii Town',         phone: '+254 58 302 2000', hours: 'Mon–Fri 8am–4:30pm' },
  // Garissa
  { id: 'b15', name: 'Garissa Branch',         county: 'Garissa',    address: 'Fafi Road, Garissa Town',           phone: '+254 46 202 3000', hours: 'Mon–Fri 8am–3:30pm' },
];

// ─── BANKING NEWS ─────────────────────────────────────────────────────────────
export const BANKING_NEWS = [
  { id: 'n1', title: 'CBK holds base rate at 13%', summary: 'Central Bank of Kenya maintains lending rate amid stable inflation.', date: `${M} 30, ${Y}` },
  { id: 'n2', title: 'KES strengthens against USD', summary: 'Shilling gains ground as diaspora remittances hit record high.', date: `${M} 28, ${Y}` },
  { id: 'n3', title: 'New mobile banking limits raised', summary: 'Daily transaction limits increased to KES 500,000 for verified accounts.', date: `${M} 25, ${Y}` },
];
