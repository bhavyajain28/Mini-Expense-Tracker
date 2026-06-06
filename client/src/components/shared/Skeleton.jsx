export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="card p-6">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-36 mb-1" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr>
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="card overflow-hidden" aria-busy="true">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {['Date', 'Category', 'Amount', 'Note', 'Actions'].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {[...Array(rows)].map((_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
