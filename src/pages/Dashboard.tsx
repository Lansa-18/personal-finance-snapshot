import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useStore } from "@/store/useStore";
import {
  EXPENSE_CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_BG_COLORS,
  CATEGORY_ICONS,
} from "@/constants/categories";
import {
  currentMonth,
  lastNMonths,
  formatMonth,
  formatDate,
  formatCurrency,
  getMonthOptions,
} from "@/lib/utils";
import AddTransactionModal from "@/components/AddTransactionModal";
import EmptyState from "@/components/EmptyState";
import type { Category } from "@/types";

export default function Dashboard() {
  const transactions = useStore((s) => s.transactions);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth());
  const [modalOpen, setModalOpen] = useState(false);

  // ── Monthly aggregates ──
  const monthlyData = useMemo(() => {
    const filtered = transactions.filter((t) =>
      t.date.startsWith(selectedMonth),
    );
    const income = filtered
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expenses = filtered
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const net = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    return { income, expenses, net, savingsRate };
  }, [transactions, selectedMonth]);

  // ── 6-month area chart data ──
  const areaChartData = useMemo(() => {
    return lastNMonths(6).map((month) => {
      const filtered = transactions.filter((t) => t.date.startsWith(month));
      return {
        month: formatMonth(month),
        Income: filtered
          .filter((t) => t.type === "income")
          .reduce((s, t) => s + t.amount, 0),
        Expenses: filtered
          .filter((t) => t.type === "expense")
          .reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions]);

  // ── Pie chart data ──
  const pieChartData = useMemo(() => {
    return EXPENSE_CATEGORIES.map((cat) => ({
      name: cat,
      value: transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            t.category === cat &&
            t.date.startsWith(selectedMonth),
        )
        .reduce((s, t) => s + t.amount, 0),
    })).filter((d) => d.value > 0);
  }, [transactions, selectedMonth]);

  // ── Recent transactions ──
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [transactions]);

  const summaryCards = [
    {
      label: "Total Income",
      value: formatCurrency(monthlyData.income),
      color: "text-income",
      bg: "bg-emerald-50",
      icon: "💰",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(monthlyData.expenses),
      color: "text-danger",
      bg: "bg-red-50",
      icon: "💸",
    },
    {
      label: "Net Balance",
      value: formatCurrency(monthlyData.net),
      color: monthlyData.net >= 0 ? "text-income" : "text-danger",
      bg: monthlyData.net >= 0 ? "bg-emerald-50" : "bg-red-50",
      icon: "📊",
    },
    {
      label: "Savings Rate",
      value: `${monthlyData.savingsRate.toFixed(1)}%`,
      color: monthlyData.savingsRate >= 20 ? "text-income" : "text-warning",
      bg: monthlyData.savingsRate >= 20 ? "bg-emerald-50" : "bg-amber-50",
      icon: "🏦",
    },
  ];

  const isEmpty = transactions.length === 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Your financial overview at a glance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-surface text-sm text-text-primary
                       focus:outline-none focus:ring-2 focus:ring-income/30 focus:border-income transition-all"
          >
            {getMonthOptions().map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-income text-white text-sm font-medium
                       hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-sm"
          >
            + Add Transaction
          </button>
        </div>
      </div>

      {isEmpty ? (
        <EmptyState
          onAdd={() => setModalOpen(true)}
          icon="📊"
          title="No data yet"
          description="Start tracking your finances by adding your first transaction."
        />
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="bg-surface rounded-xl border border-border p-5 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-text-secondary font-medium">
                    {card.label}
                  </p>
                  <span
                    className={`text-2xl w-10 h-10 flex items-center justify-center rounded-lg ${card.bg}`}
                  >
                    {card.icon}
                  </span>
                </div>
                <p className={`text-2xl font-bold mt-2 ${card.color}`}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Area chart */}
            <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                Income vs Expenses (6 Months)
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={areaChartData}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={CATEGORY_COLORS.Income}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={CATEGORY_COLORS.Income}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="expenseGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    formatter={(value: number | undefined) =>
                      formatCurrency(value ?? 0)
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="Income"
                    stroke={CATEGORY_COLORS.Income}
                    fill="url(#incomeGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="Expenses"
                    stroke="#ef4444"
                    fill="url(#expenseGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="bg-surface rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                Expense Breakdown
              </h3>
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      paddingAngle={3}
                      label={({ name, percent, x, y, textAnchor }) => (
                        <text
                          x={x}
                          y={y}
                          textAnchor={textAnchor}
                          fontSize={10}
                          fill={
                            CATEGORY_COLORS[(name as Category) ?? ""] ?? "#666"
                          }
                        >
                          {`${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        </text>
                      )}
                    >
                      {pieChartData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={CATEGORY_COLORS[entry.name as Category]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number | undefined) =>
                        formatCurrency(value ?? 0)
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-70 text-text-muted text-sm">
                  No expenses this month
                </div>
              )}
            </div>
          </div>

          {/* Recent transactions */}
          <div className="bg-surface rounded-xl border border-border">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">
                Recent Transactions
              </h3>
            </div>
            <div className="divide-y divide-border">
              {recentTransactions.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center justify-center gap-1 w-32 shrink-0 ${CATEGORY_BG_COLORS[t.category]}`}
                    >
                      {CATEGORY_ICONS[t.category]} {t.category}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {t.description}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatDate(t.date)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${t.type === "income" ? "text-income" : "text-danger"}`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </p>
                </div>
              ))}
            </div>
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
