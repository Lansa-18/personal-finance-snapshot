import { useState, useMemo } from "react";
import { useStore } from "@/store/useStore";
import {
  ALL_CATEGORIES,
  CATEGORY_BG_COLORS,
  CATEGORY_ICONS,
} from "@/constants/categories";
import { formatDate, formatCurrency, getMonthOptions } from "@/lib/utils";
import AddTransactionModal from "@/components/AddTransactionModal";
import type { Category, TransactionType } from "@/types";

export default function Transactions() {
  const transactions = useStore((s) => s.transactions);
  const deleteTransaction = useStore((s) => s.deleteTransaction);

  const [modalOpen, setModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return [...transactions]
      .filter((t) => filterCategory === "all" || t.category === filterCategory)
      .filter((t) => filterType === "all" || t.type === filterType)
      .filter((t) => filterMonth === "all" || t.date.startsWith(filterMonth))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filterCategory, filterType, filterMonth]);

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteTransaction(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const isEmpty = transactions.length === 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Transactions</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-income text-white text-sm font-medium
                     hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-sm self-start sm:self-auto"
        >
          + Add Transaction
        </button>
      </div>

      {isEmpty ? (
        <EmptyState onAdd={() => setModalOpen(true)} />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-surface text-sm text-text-primary
                         focus:outline-none focus:ring-2 focus:ring-income/30 focus:border-income transition-all"
            >
              <option value="all">All Months</option>
              {getMonthOptions().map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value as Category | "all")
              }
              className="px-3 py-2 rounded-lg border border-border bg-surface text-sm text-text-primary
                         focus:outline-none focus:ring-2 focus:ring-income/30 focus:border-income transition-all"
            >
              <option value="all">All Categories</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as TransactionType | "all")
              }
              className="px-3 py-2 rounded-lg border border-border bg-surface text-sm text-text-primary
                         focus:outline-none focus:ring-2 focus:ring-income/30 focus:border-income transition-all"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            {(filterCategory !== "all" ||
              filterType !== "all" ||
              filterMonth !== "all") && (
              <button
                onClick={() => {
                  setFilterCategory("all");
                  setFilterType("all");
                  setFilterMonth("all");
                }}
                className="px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary
                           hover:bg-surface-hover transition-all"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Transaction list */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            {/* Table header (desktop) */}
            <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 bg-surface-dim border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wider">
              <span>Description</span>
              <span>Category</span>
              <span className="text-right">Date</span>
              <span className="text-right">Amount</span>
              <span className="w-10"></span>
            </div>

            {filtered.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-text-muted">
                No transactions match your filters.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((t) => (
                  <div
                    key={t.id}
                    className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_auto_auto_auto] gap-2 sm:gap-4 px-5 py-3.5
                               hover:bg-surface-hover transition-colors group"
                  >
                    {/* Description */}
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {CATEGORY_ICONS[t.category]}
                      </span>
                      <p className="text-sm font-medium text-text-primary truncate">
                        {t.description}
                      </p>
                    </div>

                    {/* Category badge */}
                    <div className="flex items-center">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_BG_COLORS[t.category]}`}
                      >
                        {t.category}
                      </span>
                    </div>

                    {/* Date */}
                    <p className="text-sm text-text-secondary text-right whitespace-nowrap">
                      {formatDate(t.date)}
                    </p>

                    {/* Amount */}
                    <p
                      className={`text-sm font-semibold text-right whitespace-nowrap ${
                        t.type === "income" ? "text-income" : "text-danger"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </p>

                    {/* Delete */}
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className={`text-xs px-2 py-1 rounded-md transition-all ${
                          deleteConfirm === t.id
                            ? "bg-red-500 text-white"
                            : "text-text-muted hover:text-danger hover:bg-red-50 opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {deleteConfirm === t.id ? "Confirm?" : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="text-6xl mb-4">💳</div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">
        No transactions yet
      </h2>
      <p className="text-sm text-text-secondary mb-6 text-center max-w-sm">
        Add your first transaction to start tracking where your money goes.
      </p>
      <button
        onClick={onAdd}
        className="px-6 py-2.5 rounded-lg bg-income text-white font-medium hover:bg-emerald-600 transition-all shadow-sm"
      >
        + Add Your First Transaction
      </button>
    </div>
  );
}
