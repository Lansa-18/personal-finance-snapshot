import BudgetCard from "@/components/BudgetCard";
import OverviewCard from "@/components/OverviewCard";
import {
  EXPENSE_CATEGORIES
} from "@/constants/categories";
import { currentMonth, getMonthOptions } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useMemo, useState } from "react";

export default function Budgets() {
  const transactions = useStore((s) => s.transactions);
  const budgets = useStore((s) => s.budgets);
  const setBudget = useStore((s) => s.setBudget);
  const globalBudgets = useStore((s) => s.globalBudgets);
  const setGlobalBudget = useStore((s) => s.setGlobalBudget);
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

  // ── Global budget for selected month ──
  const globalBudgetLimit = useMemo(() => {
    const found = globalBudgets.find((b) => b.month === selectedMonth);
    return found?.limit ?? null;
  }, [globalBudgets, selectedMonth]);

  // ── Total budget vs total spent ──
  const totals = useMemo(() => {
    const categorySum = EXPENSE_CATEGORIES.reduce(
      (s, c) => s + budgetMap[c],
      0,
    );
    const totalBudget = globalBudgetLimit ?? categorySum;
    const totalSpent = EXPENSE_CATEGORIES.reduce((s, c) => s + spending[c], 0);
    return { totalBudget, totalSpent };
  }, [budgetMap, spending, globalBudgetLimit]);

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
      <OverviewCard
        spent={totals.totalSpent}
        globalLimit={globalBudgetLimit}
        categorySum={EXPENSE_CATEGORIES.reduce((s, c) => s + budgetMap[c], 0)}
        onSetLimit={(limit) => setGlobalBudget(limit, selectedMonth)}
        onClear={() => setGlobalBudget(0, selectedMonth)}
      />

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

