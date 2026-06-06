import { Select } from '../shared/Input';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { CATEGORIES } from '../../utils/categories';

export default function ExpenseFilters({ filters, onUpdate, onReset }) {
  return (
    <div className="card p-4">
      <div className="flex flex-wrap gap-3 items-end">
        <Select
          label="Category"
          value={filters.category}
          onChange={(e) => onUpdate('category', e.target.value)}
          className="min-w-[160px]"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Input
          label="From"
          type="date"
          value={filters.startDate}
          onChange={(e) => onUpdate('startDate', e.target.value)}
          className="min-w-[150px]"
        />
        <Input
          label="To"
          type="date"
          value={filters.endDate}
          onChange={(e) => onUpdate('endDate', e.target.value)}
          className="min-w-[150px]"
        />
        <Button variant="ghost" onClick={onReset} className="mb-0.5">
          Reset
        </Button>
      </div>
    </div>
  );
}
