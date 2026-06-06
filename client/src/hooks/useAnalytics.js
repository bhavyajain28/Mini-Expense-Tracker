import { useMemo } from 'react';
import { isCurrentMonth } from '../utils/date';

export const useAnalytics = (expenses) => {
  return useMemo(() => {
    const monthlyExpenses = expenses.filter((e) => isCurrentMonth(e.date));

    const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

    const highestExpense = expenses.length
      ? expenses.reduce((max, e) => (e.amount > max.amount ? e : max), expenses[0])
      : null;

    const categoryTotals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryTotals)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);

    const monthlyByCategory = monthlyExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    return { monthlyTotal, highestExpense, categoryTotals, categoryData, monthlyByCategory };
  }, [expenses]);
};
