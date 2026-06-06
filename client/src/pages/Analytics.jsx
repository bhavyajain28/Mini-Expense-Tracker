import { useExpenses } from '../hooks/useExpenses';
import { useAnalytics } from '../hooks/useAnalytics';
import { useFilters } from '../hooks/useFilters';
import AnalyticsCard from '../components/analytics/AnalyticsCard';
import CategoryPieChart from '../components/analytics/CategoryPieChart';
import CategoryBarChart from '../components/analytics/CategoryBarChart';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import Card, { CardHeader } from '../components/shared/Card';
import Badge from '../components/shared/Badge';
import { SkeletonCard } from '../components/shared/Skeleton';
import { formatCurrency } from '../utils/currency';

const TrendUpIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const CalIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

export default function Analytics() {
  const { expenses, loading } = useExpenses();
  const { filters, filtered, updateFilter, resetFilters } = useFilters(expenses);
  const analytics = useAnalytics(filtered);

  return (
    <div className="space-y-6">
      <ExpenseFilters filters={filters} onUpdate={updateFilter} onReset={resetFilters} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AnalyticsCard
            title="Total Spent"
            value={formatCurrency(filtered.reduce((s, e) => s + e.amount, 0))}
            subtitle={`${filtered.length} expenses`}
            icon={<TrendUpIcon />}
            color="blue"
          />
          <AnalyticsCard
            title="Highest Expense"
            value={analytics.highestExpense ? formatCurrency(analytics.highestExpense.amount) : '—'}
            subtitle={analytics.highestExpense?.category || 'No data'}
            icon={<CalIcon />}
            color="purple"
          />
          <AnalyticsCard
            title="Categories"
            value={analytics.categoryData.length}
            subtitle="with spending"
            icon={<ListIcon />}
            color="amber"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Spending Distribution" subtitle="By category" />
          <CategoryPieChart data={analytics.categoryData} />
        </Card>
        <Card>
          <CardHeader title="Category Totals" subtitle="Bar comparison" />
          <CategoryBarChart data={analytics.categoryData} />
        </Card>
      </div>

      {analytics.categoryData.length > 0 && (
        <Card>
          <CardHeader title="Category Breakdown" subtitle="Ranked by total spending" />
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase py-2 pr-4">Category</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase py-2 pr-4">Total</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {analytics.categoryData.map((d) => {
                  const total = filtered.reduce((s, e) => s + e.amount, 0);
                  const pct = total > 0 ? ((d.total / total) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={d.category}>
                      <td className="py-3 pr-4"><Badge category={d.category} /></td>
                      <td className="py-3 pr-4 text-right text-sm font-semibold text-gray-900">
                        {formatCurrency(d.total)}
                      </td>
                      <td className="py-3 text-right text-sm text-gray-500">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
