export enum UserRole {
  CLIENT = 'CLIENT',
  FREELANCER = 'FREELANCER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  notificationsEmail?: boolean;
  notificationsMarketing?: boolean;
  notificationsJobAlerts?: boolean;
  notificationsMessages?: boolean;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export enum BudgetType {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY',
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  budgetType: BudgetType;
  deadline?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  clientId: string;
  client?: User;
  skills?: Skill[];
  category?: Category;
  _count?: {
    bids: number;
  };
}

export interface Bid {
  id: string;
  amount: number;
  coverLetter: string;
  estimatedHours: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  freelancerId: string;
  freelancer?: User;
  projectId: string;
  project?: Job;
}

export interface Contract {
  id: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DISPUTED' | 'TERMINATED';
  amount: number;
  startedAt: string;
  endedAt?: string;
  projectId: string;
  project?: Job;
  freelancerId: string;
  freelancer?: User;
  clientId: string;
  client?: User;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'REFUND' | 'FEE';
  amount: number;
  fee?: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  userId: string;
  contractId?: string;
  createdAt: string;
  contract?: Contract;
}
