export type TransactionType = 'dues' | 'water_billing' | 'expenditure' | 'other_income';
export type TransactionDirection = 'income' | 'expense';
export type TransactionStatus = 'completed' | 'pending' | 'cancelled';

export interface Transaction {
  id: string;
  transactionNumber?: string;
  date: string;
  type: TransactionType | 'income' | 'expense';
  direction: TransactionDirection;
  category: string;
  amount: number;
  status?: TransactionStatus;
  description: string;
  recordedBy: string;
  recordedById?: string;
  residentName?: string;
  neighborId?: string;
  referenceNumber?: string;
  paymentMethod?: string;
  month?: string;
}

export interface TreasurySummary {
  kasRwBalance: number;
  monthlyInflow: number;
  monthlyOutflow: number;
  duesComplianceRate: number;
  totalResidents?: number;
  paidResidentsCount?: number;
  pendingDuesCount?: number;
  lastUpdated?: string;
}

export type FinancialSummary = TreasurySummary;

export interface ResidentDue {
  id: string;
  residentName: string;
  unitNumber: string;
  monthlyDuesAmount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  lastPaymentDate?: string;
  arrearsMonths: number;
  totalArrears: number;
  waterBillUnpaid?: number;
  phone?: string;
  period?: string;
}

export type ResidentDuesProfile = ResidentDue;

export interface CreateTransactionPayload {
  type: TransactionType;
  direction: TransactionDirection;
  category: string;
  amount: number;
  description: string;
  residentName?: string;
  neighborId?: string;
  paymentMethod?: string;
  month?: string;
}
