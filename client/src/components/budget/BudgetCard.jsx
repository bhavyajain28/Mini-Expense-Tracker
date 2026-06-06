import Badge from '../shared/Badge';
import Button from '../shared/Button';
import BudgetProgress from './BudgetProgress';
import { formatCurrency } from '../../utils/currency';

export default function BudgetCard({ budget, spent, onEdit, onDelete, deletingCategory }) {
  const remaining = budget.budgetAmount - spent;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <Badge category={budget.category} />
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(budget)}>
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={deletingCategory === budget.category}
            onClick={() => onDelete(budget.category)}
          >
            Remove
          </Button>
        </div>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-xl font-bold text-gray-900">{formatCurrency(spent)}</span>
        <span className="text-sm text-gray-400">/ {formatCurrency(budget.budgetAmount)}</span>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        {remaining >= 0
          ? `${formatCurrency(remaining)} remaining`
          : `${formatCurrency(Math.abs(remaining))} over budget`}
      </p>
      <BudgetProgress spent={spent} budget={budget.budgetAmount} />
    </div>
  );
}
