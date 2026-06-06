import { useState } from 'react';
import { Select } from '../shared/Input';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { CATEGORIES } from '../../utils/categories';

export default function BudgetForm({ onSubmit, existingCategories = [], onCancel }) {
  const [category, setCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const available = CATEGORIES.filter((c) => !existingCategories.includes(c));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!category) errs.category = 'Category is required';
    if (!budgetAmount || parseFloat(budgetAmount) <= 0)
      errs.budgetAmount = 'Budget must be a positive number';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      await onSubmit(category, parseFloat(budgetAmount));
      setCategory('');
      setBudgetAmount('');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {apiError}
        </div>
      )}
      <Select
        label="Category"
        value={category}
        onChange={(e) => { setCategory(e.target.value); setErrors((p) => ({ ...p, category: undefined })); }}
        error={errors.category}
        required
      >
        <option value="">Select a category</option>
        {available.map((c) => <option key={c} value={c}>{c}</option>)}
      </Select>
      <Input
        label="Monthly Budget"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        value={budgetAmount}
        onChange={(e) => { setBudgetAmount(e.target.value); setErrors((p) => ({ ...p, budgetAmount: undefined })); }}
        error={errors.budgetAmount}
        required
      />
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} className="flex-1">
          Set Budget
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
