export default function ProgressBar({
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