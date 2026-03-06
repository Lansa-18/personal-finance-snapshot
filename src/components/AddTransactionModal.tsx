import { useState } from "react";
import type { TransactionType, Category, ExpenseCategory } from "@/types";
import { EXPENSE_CATEGORIES } from "@/constants/categories";
import { useStore } from "@/store/useStore";
import Toast from "@/components/Toast";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
}: AddTransactionModalProps) {
  const addTransaction = useStore((s) => s.addTransaction);
  const budgets = useStore((s) => s.budgets);
  const transactions = useStore((s) => s.transactions);

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [toast, setToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    const finalCategory: Category = type === "income" ? "Income" : category;
    const month = date.slice(0, 7);

    addTransaction({
      type,
      amount: numAmount,
      category: finalCategory,
      description,
      date,
    });

    // Check budget overspend for expenses
    if (type === "expense") {
      const budget = budgets.find(
        (b) => b.category === finalCategory && b.month === month,
      );
      if (budget && budget.limit > 0) {
        const currentSpend = transactions
          .filter(
            (t) =>
              t.type === "expense" &&
              t.category === finalCategory &&
              t.date.startsWith(month),
          )
          .reduce((sum, t) => sum + t.amount, 0);

        if (currentSpend + numAmount > budget.limit) {
          setToast(
            `Over budget! ${finalCategory} spending ($${(currentSpend + numAmount).toFixed(0)}) exceeds your $${budget.limit} limit.`,
          );
        }
      }
    }

    // Reset form & close
    setAmount("");
    setDescription("");
    setType("expense");
    setCategory("Food");
    setDate(new Date().toISOString().slice(0, 10));
    onClose();
  };

  return (
    <>
      {toast && (
        <Toast message={toast} type="warning" onClose={() => setToast(null)} />
      )}

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-surface rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">
              Add Transaction
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-surface-hover transition-colors text-text-muted"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Type toggle */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Type
              </label>
              <div className="flex rounded-lg bg-surface-dim p-1">
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    type === "expense"
                      ? "bg-red-500 text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    type === "income"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text-primary
                           placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-income/30
                           focus:border-income transition-all"
              />
            </div>

            {/* Category (only for expenses) */}
            {type === "expense" && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ExpenseCategory)
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text-primary
                             focus:outline-none focus:ring-2 focus:ring-income/30 focus:border-income transition-all"
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this for?"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text-primary
                           placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-income/30
                           focus:border-income transition-all"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text-primary
                           focus:outline-none focus:ring-2 focus:ring-income/30 focus:border-income transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-medium text-white transition-all duration-200
                         bg-income hover:bg-emerald-600 active:scale-[0.98] shadow-sm"
            >
              Add Transaction
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
