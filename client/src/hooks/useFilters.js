import { useState, useMemo, useEffect } from 'react';
import { startOfMonth, todayISO } from '../utils/date';

const STORAGE_KEY = 'expense_tracker_filters';

const defaultFilters = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { category: '', startDate: startOfMonth(), endDate: todayISO() };
  } catch {
    return { category: '', startDate: startOfMonth(), endDate: todayISO() };
  }
};

export const useFilters = (expenses) => {
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const matchCategory = !filters.category || e.category === filters.category;
      const matchStart = !filters.startDate || e.date >= filters.startDate;
      const matchEnd = !filters.endDate || e.date <= filters.endDate;
      return matchCategory && matchStart && matchEnd;
    });
  }, [expenses, filters]);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () =>
    setFilters({ category: '', startDate: startOfMonth(), endDate: todayISO() });

  return { filters, filtered, updateFilter, resetFilters };
};
