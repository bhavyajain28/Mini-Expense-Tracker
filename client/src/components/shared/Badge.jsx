import { getCategoryColor } from '../../utils/categories';

export default function Badge({ label, category }) {
  const color = category ? getCategoryColor(category) : '#6b7280';
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {label || category}
    </span>
  );
}
