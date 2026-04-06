import { api } from "@/lib/api";
import type { Transaction, Wallet } from "@/lib";

export type BillingSummary = {
  wallet: Wallet;
  transactions: Transaction[];
};

export const BillingService = {
  async getSummary() {
    const { data } = await api.get<BillingSummary>("/billing/summary");
    return data;
  },
  async deposit(amount: number) {
    const { data } = await api.post<BillingSummary>("/billing/deposit", { amount });
    return data;
  },
  async withdraw(amount: number) {
    const { data } = await api.post<BillingSummary>("/billing/withdraw", { amount });
    return data;
  },
};
