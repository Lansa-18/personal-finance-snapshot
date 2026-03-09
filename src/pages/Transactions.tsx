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
import EmptyState from "@/components/EmptyState";
import { Trash2 } from "lucide-react";

export default function Transactions() {
  const transactions = useStore((s) => s.transactions);
  const deleteTransaction = useStore((s) => s.deleteTransaction);

  const [modalOpen, setModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const filtered = useMemo(() => {
    return [...transactions]
      .filter((t) => filterCategory === "all" || t.category === filterCategory)
      .filter((t) => filterType === "all" || t.type === filterType)
      .filter((t) => filterMonth === "all" || t.date.startsWith(filterMonth))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filterCategory, filterType, filterMonth]);

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this transaction? This cannot be undone.")) {
      deleteTransaction(id);
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
            <div className="hidden sm:grid sm:grid-cols-[1fr_9rem_9rem_7rem_5rem] gap-4 px-5 py-3 bg-surface-dim border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wider">
              <span>Description</span>
              <span>Category</span>
              <span className="text-right">Date</span>
              <span className="text-right">Amount</span>
              <span></span>
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
                    className="flex flex-col sm:grid sm:grid-cols-[1fr_9rem_9rem_7rem_5rem] gap-2 sm:gap-4 px-5 py-3.5
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
                        title="Delete transaction"
                        className="p-1.5 rounded-md transition-all text-text-muted hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
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


