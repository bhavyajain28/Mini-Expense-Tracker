import { useState } from 'react';
import { useBudgets } from '../hooks/useBudgets';
import { useExpenses } from '../hooks/useExpenses';
import BudgetCard from '../components/budget/BudgetCard';
import BudgetForm from '../components/budget/BudgetForm';
import Modal from '../components/shared/Modal';
import Button from '../components/shared/Button';
import Card, { CardHeader } from '../components/shared/Card';
import EmptyState from '../components/shared/EmptyState';
import Input from '../components/shared/Input';

export default function Budgets() {
  const { budgets, loading, error, save, remove } = useBudgets();
  const { expenses } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editError, setEditError] = useState('');
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  const getSpent = (category) =>
    expenses.filter((e) => e.category === category).reduce((s, e) => s + e.amount, 0);

  const handleSave = async (category, budgetAmount) => {
    await save(category, budgetAmount);
    setShowForm(false);
  };

  const handleEditOpen = (budget) => {
    setEditingBudget(budget);
    setEditAmount(String(budget.budgetAmount));
    setEditError('');
  };

  const handleEditSave = async () => {
    if (!editAmount || parseFloat(editAmount) <= 0) {
      setEditError('Budget must be a positive number');
      return;
    }
    setSaving(true);
    try {
      await save(editingBudget.category, parseFloat(editAmount));
      setEditingBudget(null);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Remove budget for ${category}?`)) return;
    setDeletingCategory(category);
    try {
      await remove(category);
    } finally {
      setDeletingCategory(null);
    }
  };

  const existingCategories = budgets.map((b) => b.category);

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        Failed to load budgets: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{budgets.length} budget{budgets.length !== 1 ? 's' : ''} set</p>
        <Button onClick={() => setShowForm(true)} disabled={existingCategories.length === 8}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Set Budget
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader title="New Budget" />
          <BudgetForm
            onSubmit={handleSave}
            existingCategories={existingCategories}
            onCancel={() => setShowForm(false)}
          />
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-7 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-2 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : budgets.length === 0 && !showForm ? (
        <div className="card">
          <EmptyState
            title="No budgets set"
            description="Set a monthly budget for each spending category to track your limits."
            action={
              <Button onClick={() => setShowForm(true)}>
                Set Your First Budget
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => (
            <BudgetCard
              key={b.category}
              budget={b}
              spent={getSpent(b.category)}
              onEdit={handleEditOpen}
              onDelete={handleDelete}
              deletingCategory={deletingCategory}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={!!editingBudget}
        onClose={() => setEditingBudget(null)}
        title={`Edit Budget — ${editingBudget?.category}`}
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Monthly Budget"
            type="number"
            step="0.01"
            min="0.01"
            value={editAmount}
            onChange={(e) => { setEditAmount(e.target.value); setEditError(''); }}
            error={editError}
          />
          <div className="flex gap-3">
            <Button onClick={handleEditSave} loading={saving} className="flex-1">
              Update
            </Button>
            <Button variant="secondary" onClick={() => setEditingBudget(null)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
