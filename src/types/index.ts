export type TransactionType = "income" | "expense";

export type Category =
  | "Housing"
  | "Food"
  | "Transport"
  | "Entertainment"
  | "Income";

export type ExpenseCategory = Exclude<Category, "Income">;

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
}

export interface Budget {
  category: ExpenseCategory;
  limit: number;
  month: string; // YYYY-MM
}

export interface GlobalBudget {
  month: string; // YYYY-MM
  limit: number;
}
