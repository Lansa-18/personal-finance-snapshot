import { useState, useMemo } from "react";
import { useStore } from "@/store/useStore";
import {
  EXPENSE_CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from "@/constants/categories";
import { currentMonth, formatCurrency, getMonthOptions } from "@/lib/utils";
import type { ExpenseCategory } from "@/types";

export default function Budgets() {
  const transactions = useStore((s) => s.transactions);
  const budgets = useStore((s) => s.budgets);
  const setBudget = useStore((s) => s.setBudget);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth());

  // ── Spending per category for selected month ──
  const spending = useMemo(() => {
    const map: Record<string, number> = {};
    EXPENSE_CATEGORIES.forEach((cat) => {
      map[cat] = transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            t.category === cat &&
            t.date.startsWith(selectedMonth),
        )
        .reduce((sum, t) => sum + t.amount, 0);
    });
    return map;
  }, [transactions, selectedMonth]);

  // ── Budget limits for selected month ──
  const budgetMap = useMemo(() => {
    const map: Record<string, number> = {};
    EXPENSE_CATEGORIES.forEach((cat) => {
      const found = budgets.find(
        (b) => b.category === cat && b.month === selectedMonth,
      );
      map[cat] = found?.limit ?? 0;
    });
    return map;
  }, [budgets, selectedMonth]);

  // ── Total budget vs total spent ──
  const totals = useMemo(() => {
    const totalBudget = EXPENSE_CATEGORIES.reduce(
      (s, c) => s + budgetMap[c],
      0,
    );
    const totalSpent = EXPENSE_CATEGORIES.reduce((s, c) => s + spending[c], 0);
    return { totalBudget, totalSpent };
  }, [budgetMap, spending]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Budgets</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Set and track spending limits by category
          </p>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-surface text-sm text-text-primary
                     focus:outline-none focus:ring-2 focus:ring-income/30 focus:border-income transition-all
                     self-start sm:self-auto"
        >
          {getMonthOptions().map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Overview card */}
      <div className="bg-surface rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-primary">
            Monthly Overview
          </h3>
          <p className="text-sm text-text-secondary">
            {formatCurrency(totals.totalSpent)} of{" "}
            {formatCurrency(totals.totalBudget)}
          </p>
        </div>
        <ProgressBar spent={totals.totalSpent} limit={totals.totalBudget} />
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EXPENSE_CATEGORIES.map((cat) => (
          <BudgetCard
            key={cat}
            category={cat}
            spent={spending[cat]}
            limit={budgetMap[cat]}
            onSetLimit={(limit) => setBudget(cat, limit, selectedMonth)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Budget Card Component ──

function BudgetCard({
  category,
  spent,
  limit,
  onSetLimit,
}: {
  category: ExpenseCategory;
  spent: number;
  limit: number;
  onSetLimit: (limit: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(limit));

  const handleSave = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val) && val >= 0) {
      onSetLimit(val);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setInputValue(String(limit));
      setEditing(false);
    }
  };

  const color = CATEGORY_COLORS[category];
  const noBudget = limit === 0;

  return (
    <div className="bg-surface rounded-xl border border-border p-5 hover:shadow-md transition-shadow duration-200">
      {/* Category header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-lg">{CATEGORY_ICONS[category]}</span>
          <h3 className="text-sm font-semibold text-text-primary">
            {category}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {editing ? (
            <div className="flex items-center gap-1">
              <span className="text-sm text-text-muted">$</span>
              <input
                type="number"
                min="0"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-20 px-2 py-1 text-sm rounded border border-border bg-surface text-text-primary
                           focus:outline-none focus:ring-2 focus:ring-income/30 focus:border-income"
              />
            </div>
          ) : (
            <button
              onClick={() => {
                setInputValue(String(limit));
                setEditing(true);
              }}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              title="Click to edit budget"
            >
              {noBudget ? "Set limit" : `Limit: ${formatCurrency(limit)}`}
            </button>
          )}
        </div>
      </div>

      {noBudget ? (
        // No budget state
        <div className="text-center py-4">
          <p className="text-sm text-text-muted mb-3">
            No budget set for this category
          </p>
          <button
            onClick={() => {
              setInputValue("500");
              setEditing(true);
            }}
            className="text-sm text-income hover:underline font-medium"
          >
            + Set a budget limit
          </button>
          {spent > 0 && (
            <p className="text-xs text-text-muted mt-2">
              Current spending: {formatCurrency(spent)}
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Spending info */}
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-sm text-text-secondary">
              {formatCurrency(spent)} spent
            </p>
            <p className="text-xs text-text-muted">
              {formatCurrency(Math.max(0, limit - spent))} remaining
            </p>
          </div>

          {/* Progress bar */}
          <ProgressBar spent={spent} limit={limit} color={color} />

          {/* Over budget warning */}
          {spent > limit && (
            <p className="text-xs text-danger font-medium mt-2 flex items-center gap-1">
              ⚠️ Over budget by {formatCurrency(spent - limit)}
            </p>
          )}
        </>
      )}
    </div>
  );
}

// ── Progress Bar Component ──

function ProgressBar({
  spent,
  limit,
  color,
}: {
  spent: number;
  limit: number;
  color?: string;
}) {
  if (limit === 0) return null;

  const pct = Math.min((spent / limit) * 100, 100);
  const overBudget = spent > limit;
  const isWarning = pct >= 75 && pct < 100;

  const barColor = overBudget
    ? "#ef4444" // red
    : isWarning
      ? "#f59e0b" // amber
      : (color ?? "#22c55e"); // green or category color

  return (
    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full animate-progress transition-all duration-500"
        style={{
          width: `${Math.min(pct, 100)}%`,
          backgroundColor: barColor,
        }}
      />
    </div>
  );
}
