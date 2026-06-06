import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import { useAnalytics } from '../hooks/useAnalytics';
import { useBudgets } from '../hooks/useBudgets';
import { useFilters } from '../hooks/useFilters';
import AnalyticsCard from '../components/analytics/AnalyticsCard';
import CategoryPieChart from '../components/analytics/CategoryPieChart';
import CategoryBarChart from '../components/analytics/CategoryBarChart';
import ExpenseModal from '../components/expenses/ExpenseModal';
import BudgetProgress from '../components/budget/BudgetProgress';
import Badge from '../components/shared/Badge';
import Button from '../components/shared/Button';
import Card, { CardHeader } from '../components/shared/Card';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

const MonthlyIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const HighestIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const TotalIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default function Dashboard() {
  const { expenses, loading, add } = useExpenses();
  const { budgets } = useBudgets();
  const { filtered } = useFilters(expenses);
  const analytics = useAnalytics(expenses);
  const [modalOpen, setModalOpen] = useState(false);

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const budgetsWithSpend = budgets.map((b) => {
    const spent = expenses
      .filter((e) => e.category === b.category)
      .reduce((s, e) => s + e.amount, 0);
    return { ...b, spent };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AnalyticsCard
          title="Spent This Month"
          value={formatCurrency(analytics.monthlyTotal)}
          subtitle={`Across ${Object.keys(analytics.monthlyByCategory).length} categories`}
          icon={<MonthlyIcon />}
          color="blue"
          loading={loading}
        />
        <AnalyticsCard
          title="Highest Expense"
          value={analytics.highestExpense ? formatCurrency(analytics.highestExpense.amount) : '—'}
          subtitle={analytics.highestExpense?.category}
          icon={<HighestIcon />}
          color="purple"
          loading={loading}
        />
        <AnalyticsCard
          title="Total All Time"
          value={formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}
          subtitle={`${expenses.length} total expenses`}
          icon={<TotalIcon />}
          color="green"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Spending by Category" subtitle="All time" />
          <CategoryPieChart data={analytics.categoryData} />
        </Card>
        <Card>
          <CardHeader title="Category Comparison" subtitle="All time" />
          <CategoryBarChart data={analytics.categoryData} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Recent Expenses"
            action={
              <Link to="/expenses" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </Link>
            }
          />
          {recentExpenses.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No expenses yet</p>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((e) => (
                <div key={e.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <Badge category={e.category} />
                    <span className="text-sm text-gray-500">{formatDate(e.date)}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(e.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Budget Status"
            action={
              <Link to="/budgets" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Manage
              </Link>
            }
          />
          {budgetsWithSpend.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No budgets set</p>
          ) : (
            <div className="space-y-4">
              {budgetsWithSpend.map((b) => (
                <div key={b.category}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge category={b.category} />
                    <span className="text-xs text-gray-500">
                      {formatCurrency(b.spent)} / {formatCurrency(b.budgetAmount)}
                    </span>
                  </div>
                  <BudgetProgress spent={b.spent} budget={b.budgetAmount} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={add}
      />
    </div>
  );
}
