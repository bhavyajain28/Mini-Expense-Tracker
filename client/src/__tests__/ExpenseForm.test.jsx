import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseForm from '../components/expenses/ExpenseForm';

const renderForm = (props = {}) =>
  render(<ExpenseForm onSubmit={vi.fn()} {...props} />);

describe('ExpenseForm', () => {
  it('renders all form fields', () => {
    renderForm();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/note/i)).toBeInTheDocument();
  });

  it('shows validation error for empty amount', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(screen.getByText(/amount must be a positive number/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for missing category', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.type(screen.getByLabelText(/amount/i), '50');
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit with correct data', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderForm({ onSubmit });

    await user.clear(screen.getByLabelText(/amount/i));
    await user.type(screen.getByLabelText(/amount/i), '75.50');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Food');

    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 75.5, category: 'Food' })
      );
    });
  });

  it('renders with initial values when editing', () => {
    renderForm({
      initialValues: { amount: '100', category: 'Transport', date: '2024-01-15', note: 'Bus' },
      submitLabel: 'Update Expense',
    });
    expect(screen.getByLabelText(/amount/i)).toHaveValue(100);
    expect(screen.getByLabelText(/note/i)).toHaveValue('Bus');
    expect(screen.getByRole('button', { name: /update expense/i })).toBeInTheDocument();
  });
});

describe('Analytics calculations', () => {
  it('filters monthly expenses correctly', () => {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const expenses = [
      { id: '1', amount: 100, category: 'Food', date: thisMonth },
      { id: '2', amount: 50, category: 'Transport', date: '2020-01-01' },
    ];
    const monthly = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    expect(monthly).toHaveLength(1);
    expect(monthly[0].amount).toBe(100);
  });

  it('calculates category totals correctly', () => {
    const expenses = [
      { category: 'Food', amount: 30 },
      { category: 'Food', amount: 20 },
      { category: 'Transport', amount: 10 },
    ];
    const totals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    expect(totals.Food).toBe(50);
    expect(totals.Transport).toBe(10);
  });
});
