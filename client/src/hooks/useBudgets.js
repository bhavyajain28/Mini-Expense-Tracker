import { useState, useEffect, useCallback } from 'react';
import { fetchBudgets, saveBudget, updateBudget, deleteBudget } from '../api/budgets';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBudgets();
      setBudgets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (category, budgetAmount) => {
    const existing = budgets.find((b) => b.category === category);
    let result;
    if (existing) {
      result = await updateBudget(category, budgetAmount);
      setBudgets((prev) => prev.map((b) => (b.category === category ? result : b)));
    } else {
      result = await saveBudget({ category, budgetAmount });
      setBudgets((prev) => [...prev, result]);
    }
    return result;
  };

  const remove = async (category) => {
    await deleteBudget(category);
    setBudgets((prev) => prev.filter((b) => b.category !== category));
  };

  const getBudgetForCategory = (category) =>
    budgets.find((b) => b.category === category) || null;

  return { budgets, loading, error, reload: load, save, remove, getBudgetForCategory };
};
