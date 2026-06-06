import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { getCategoryColor } from '../../utils/categories';
import { formatCurrency } from '../../utils/currency';
import EmptyState from '../shared/EmptyState';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      <p className="text-gray-600">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

export default function CategoryBarChart({ data }) {
  if (!data?.length) {
    return <EmptyState title="No data" description="Add expenses to see the breakdown." />;
  }

  const chartData = data.map((d) => ({ name: d.category, total: d.total }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
        <YAxis
          tickFormatter={(v) => `$${v}`}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
        <Bar dataKey="total" radius={[6, 6, 0, 0]}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
