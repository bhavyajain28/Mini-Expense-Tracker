import { useState } from 'react';
import Input, { Select, Textarea } from '../shared/Input';
import Button from '../shared/Button';
import { CATEGORIES } from '../../utils/categories';
import { todayISO } from '../../utils/date';

const emptyForm = { amount: '', category: '', date: todayISO(), note: '' };

const validate = (form) => {
  const errors = {};
  if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
    errors.amount = 'Amount must be a positive number';
  if (!form.category) errors.category = 'Category is required';
  if (!form.date) errors.date = 'Date is required';
  else if (form.date > todayISO()) errors.date = 'Date cannot be in the future';
  return errors;
};

export default function ExpenseForm({ onSubmit, initialValues, onCancel, submitLabel = 'Save Expense' }) {
  const [form, setForm] = useState(initialValues || emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      await onSubmit({ ...form, amount: parseFloat(form.amount) });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {apiError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {apiError}
        </div>
      )}
      <Input
        label="Amount"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        value={form.amount}
        onChange={(e) => set('amount', e.target.value)}
        error={errors.amount}
        required
      />
      <Select
        label="Category"
        value={form.category}
        onChange={(e) => set('category', e.target.value)}
        error={errors.category}
        required
      >
        <option value="">Select a category</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </Select>
      <Input
        label="Date"
        type="date"
        value={form.date}
        max={todayISO()}
        onChange={(e) => set('date', e.target.value)}
        error={errors.date}
        required
      />
      <Textarea
        label="Note"
        placeholder="Optional note..."
        value={form.note}
        onChange={(e) => set('note', e.target.value)}
      />
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} className="flex-1">
          {submitLabel}
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
