import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Transaction, Budget, GlobalBudget, ExpenseCategory } from "@/types";

const uid = () => crypto.randomUUID();
const toMonth = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const toISO = (d: Date) => d.toISOString().slice(0, 10);

function buildSeedTransactions(): Transaction[] {
  const now = new Date();
  const m = (offset: number) => {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    return d;
  };
  const date = (offset: number, day: number) => {
    const d = m(offset);
    d.setDate(day);
    return toISO(d);
  };

  return [
    {
      id: uid(),
      type: "income",
      amount: 5200,
      category: "Income",
      description: "Monthly salary",
      date: date(0, 1),
    },
    {
      id: uid(),
      type: "expense",
      amount: 1400,
      category: "Housing",
      description: "Rent payment",
      date: date(0, 2),
    },
    {
      id: uid(),
      type: "expense",
      amount: 280,
      category: "Food",
      description: "Grocery shopping",
      date: date(0, 5),
    },
    {
      id: uid(),
      type: "expense",
      amount: 65,
      category: "Transport",
      description: "Fuel",
      date: date(0, 3),
    },
    {
      id: uid(),
      type: "income",
      amount: 5200,
      category: "Income",
      description: "Monthly salary",
      date: date(-1, 1),
    },
    {
      id: uid(),
      type: "expense",
      amount: 1400,
      category: "Housing",
      description: "Rent payment",
      date: date(-1, 2),
    },
    {
      id: uid(),
      type: "expense",
      amount: 120,
      category: "Entertainment",
      description: "Concert tickets",
      date: date(-1, 15),
    },
    {
      id: uid(),
      type: "expense",
      amount: 310,
      category: "Food",
      description: "Restaurants & groceries",
      date: date(-1, 10),
    },
    {
      id: uid(),
      type: "income",
      amount: 5200,
      category: "Income",
      description: "Monthly salary",
      date: date(-2, 1),
    },
    {
      id: uid(),
      type: "expense",
      amount: 1400,
      category: "Housing",
      description: "Rent payment",
      date: date(-2, 2),
    },
    {
      id: uid(),
      type: "expense",
      amount: 90,
      category: "Transport",
      description: "Bus pass",
      date: date(-2, 4),
    },
    {
      id: uid(),
      type: "expense",
      amount: 45,
      category: "Entertainment",
      description: "Streaming subscriptions",
      date: date(-2, 8),
    },
    {
      id: uid(),
      type: "income",
      amount: 5000,
      category: "Income",
      description: "Monthly salary",
      date: date(-3, 1),
    },
    {
      id: uid(),
      type: "expense",
      amount: 1400,
      category: "Housing",
      description: "Rent payment",
      date: date(-3, 2),
    },
    {
      id: uid(),
      type: "expense",
      amount: 250,
      category: "Food",
      description: "Weekly groceries",
      date: date(-3, 7),
    },
    {
      id: uid(),
      type: "expense",
      amount: 55,
      category: "Transport",
      description: "Uber rides",
      date: date(-3, 12),
    },
  ];
}

function buildSeedBudgets(): Budget[] {
  const now = new Date();
  const month = toMonth(now);
  const lastMonth = toMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));

  const limits: { category: ExpenseCategory; limit: number }[] = [
    { category: "Housing", limit: 1500 },
    { category: "Food", limit: 400 },
    { category: "Transport", limit: 150 },
    { category: "Entertainment", limit: 200 },
  ];

  return [
    ...limits.map((b) => ({ ...b, month })),
    ...limits.map((b) => ({ ...b, month: lastMonth })),
  ];
}

interface TransactionSlice {
  transactions: Transaction[];
  addTransaction: (data: Omit<Transaction, "id">) => Transaction;
  deleteTransaction: (id: string) => void;
}

interface BudgetSlice {
  budgets: Budget[];
  setBudget: (category: ExpenseCategory, limit: number, month: string) => void;
  globalBudgets: GlobalBudget[];
  setGlobalBudget: (limit: number, month: string) => void;
}

export type StoreState = TransactionSlice & BudgetSlice;

const SEED_TRANSACTIONS = buildSeedTransactions();
const SEED_BUDGETS = buildSeedBudgets();

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      transactions: SEED_TRANSACTIONS,

      addTransaction: (data) => {
        const transaction: Transaction = { ...data, id: uid() };
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        }));
        return transaction;
      },

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      budgets: SEED_BUDGETS,

      setBudget: (category, limit, month) =>
        set((state) => {
          const exists = state.budgets.findIndex(
            (b) => b.category === category && b.month === month,
          );
          if (exists >= 0) {
            const updated = [...state.budgets];
            updated[exists] = { category, limit, month };
            return { budgets: updated };
          }
          return { budgets: [...state.budgets, { category, limit, month }] };
        }),

      globalBudgets: [],

      setGlobalBudget: (limit, month) =>
        set((state) => {
          const exists = state.globalBudgets.findIndex(
            (b) => b.month === month,
          );
          if (exists >= 0) {
            const updated = [...state.globalBudgets];
            updated[exists] = { month, limit };
            return { globalBudgets: updated };
          }
          return { globalBudgets: [...state.globalBudgets, { month, limit }] };
        }),
    }),
    {
      name: "finance-snapshot",
      version: 1,
    },
  ),
);

export const selectTransactions = (s: StoreState) => s.transactions;
export const selectBudgets = (s: StoreState) => s.budgets;

export const selectTransactionsByMonth = (month: string) => (s: StoreState) =>
  s.transactions.filter((t) => t.date.startsWith(month));

export const selectBudgetsByMonth = (month: string) => (s: StoreState) =>
  s.budgets.filter((b) => b.month === month);
