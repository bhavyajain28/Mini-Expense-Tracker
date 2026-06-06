import Badge from '../shared/Badge';
import Button from '../shared/Button';
import EmptyState from '../shared/EmptyState';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

export default function ExpenseTable({ expenses, onEdit, onDelete, deletingId }) {
  if (expenses.length === 0) {
    return (
      <div className="card">
        <EmptyState
          title="No expenses found"
          description="Add your first expense or adjust the filters to see results."
        />
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {['Date', 'Category', 'Amount', 'Note', ''].map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge category={expense.category} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {expense.note || <span className="text-gray-300">—</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(expense)}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={deletingId === expense.id}
                      onClick={() => onDelete(expense.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
        {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} shown
      </div>
    </div>
  );
}
