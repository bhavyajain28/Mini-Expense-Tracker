import Card from '../shared/Card';
import { Skeleton } from '../shared/Skeleton';

export default function AnalyticsCard({ title, value, subtitle, icon, color = 'blue', loading }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-4 w-28 mb-3" />
        <Skeleton className="h-8 w-36 mb-2" />
        <Skeleton className="h-3 w-20" />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 truncate">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-500 truncate">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`ml-4 p-3 rounded-xl ${colorMap[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
