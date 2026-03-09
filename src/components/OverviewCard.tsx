import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Pencil } from "lucide-react";
import ProgressBar from "./ProgressBar";

export default function OverviewCard({
  spent,
  globalLimit,
  categorySum,
  onSetLimit,
  onClear,
}: {
  spent: number;
  globalLimit: number | null;
  categorySum: number;
  onSetLimit: (limit: number) => void;
  onClear: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const displayLimit = globalLimit ?? categorySum;

  const handleSave = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val) && val > 0) onSetLimit(val);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            Monthly Overview
          </h3>
          {globalLimit !== null && (
            <p className="text-xs text-text-muted mt-0.5">
              Global budget · category sum:{" "}
              <button
                onClick={onClear}
                className="text-text-muted hover:text-danger transition-colors underline underline-offset-2"
              >
                reset
              </button>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-text-secondary">
            {formatCurrency(spent)} of{" "}
          </p>
          {editing ? (
            <input
              type="number"
              min="1"
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
                setInputValue(String(displayLimit));
                setEditing(true);
              }}
              className="flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-md border border-border
                         text-text-secondary hover:text-text-primary hover:border-income/50 hover:bg-income/5
                         transition-all"
              title="Click to set global budget"
            >
              <Pencil size={11} />
              {formatCurrency(displayLimit)}
            </button>
          )}
        </div>
      </div>
      <ProgressBar spent={spent} limit={displayLimit} />
    </div>
  );
}