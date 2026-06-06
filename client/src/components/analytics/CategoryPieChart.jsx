import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCategoryColor } from '../../utils/categories';
import { formatCurrency } from '../../utils/currency';
import EmptyState from '../shared/EmptyState';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-900">{d.name}</p>
      <p className="text-gray-600">{formatCurrency(d.value)}</p>
      <p className="text-gray-400">{d.payload.percent}%</p>
    </div>
  );
};

export default function CategoryPieChart({ data }) {
  if (!data?.length) {
    return <EmptyState title="No data" description="Add expenses to see the breakdown." />;
  }

  const total = data.reduce((s, d) => s + d.total, 0);
  const chartData = data.map((d) => ({
    name: d.category,
    value: d.total,
    percent: ((d.total / total) * 100).toFixed(1),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
