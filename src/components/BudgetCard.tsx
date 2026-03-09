import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/constants/categories";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import ProgressBar from "./ProgressBar";
import type { ExpenseCategory } from "@/types";

export default function BudgetCard({
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
            <input
              type="number"
              min="0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-24 px-2 py-1 text-sm rounded border border-border bg-surface text-text-primary
                         focus:outline-none focus:ring-2 focus:ring-income/30 focus:border-income"
            />
          ) : (
            <button
              onClick={() => {
                setInputValue(String(limit));
                setEditing(true);
              }}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-border
                         text-text-secondary hover:text-text-primary hover:border-income/50 hover:bg-income/5
                         transition-all"
              title="Click to edit budget limit"
            >
              <Pencil size={11} />
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