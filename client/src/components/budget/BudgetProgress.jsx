export default function BudgetProgress({ spent, budget }) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const isOver = spent > budget;
  const isNear = pct >= 80 && !isOver;

  const barColor = isOver ? 'bg-red-500' : isNear ? 'bg-amber-400' : 'bg-emerald-500';

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{pct.toFixed(0)}% used</span>
        {isOver && <span className="text-red-600 font-medium">Over budget!</span>}
        {isNear && !isOver && <span className="text-amber-600 font-medium">Nearly full</span>}
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
