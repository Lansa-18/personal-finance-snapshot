interface EmptyStateProps {
  onAdd: () => void;
  icon?: string;
  title?: string;
  description?: string;
}

export default function EmptyState({
  onAdd,
  icon = "💳",
  title = "No transactions yet",
  description = "Add your first transaction to start tracking where your money goes.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">{title}</h2>
      <p className="text-sm text-text-secondary mb-6 text-center max-w-sm">
        {description}
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
