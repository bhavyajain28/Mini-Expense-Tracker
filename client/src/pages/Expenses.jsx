import { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useFilters } from '../hooks/useFilters';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ExpenseModal from '../components/expenses/ExpenseModal';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import Button from '../components/shared/Button';
import { SkeletonTable } from '../components/shared/Skeleton';
import { exportToCSV } from '../utils/csv';

export default function Expenses() {
  const { expenses, loading, error, add, edit, remove } = useExpenses();
  const { filters, filtered, updateFilter, resetFilters } = useFilters(expenses);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleClose = () => {
    setEditingExpense(null);
    setModalOpen(false);
  };

  const handleSubmit = async (data) => {
    if (editingExpense) {
      await edit(editingExpense.id, data);
    } else {
      await add(data);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    setDeletingId(id);
    try {
      await remove(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = () => exportToCSV(filtered);

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        Failed to load expenses: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{filtered.length} expense{filtered.length !== 1 ? 's' : ''}</p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport} disabled={filtered.length === 0}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </Button>
          <Button onClick={() => setModalOpen(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </Button>
        </div>
      </div>

      <ExpenseFilters filters={filters} onUpdate={updateFilter} onReset={resetFilters} />

      {loading ? (
        <SkeletonTable />
      ) : (
        <ExpenseTable
          expenses={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}

      <ExpenseModal
        isOpen={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        expense={editingExpense}
      />
    </div>
  );
}
