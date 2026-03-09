import type { Category, ExpenseCategory } from "@/types";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Housing",
  "Food",
  "Transport",
  "Entertainment",
];

export const ALL_CATEGORIES: Category[] = [...EXPENSE_CATEGORIES, "Income"];

export const CATEGORY_COLORS: Record<Category, string> = {
  Housing: "#6366f1",
  Food: "#f59e0b",
  Transport: "#0ea5e9",
  Entertainment: "#f43f5e",
  Income: "#10b981",
};

export const CATEGORY_BG_COLORS: Record<Category, string> = {
  Housing: "bg-indigo-100 text-indigo-700",
  Food: "bg-amber-100 text-amber-700",
  Transport: "bg-sky-100 text-sky-700",
  Entertainment: "bg-rose-100 text-rose-700",
  Income: "bg-emerald-100 text-emerald-700",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  Housing: "🏠",
  Food: "🍔",
  Transport: "🚗",
  Entertainment: "🎬",
  Income: "💰",
};
