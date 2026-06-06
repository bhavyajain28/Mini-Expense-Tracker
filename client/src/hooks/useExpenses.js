import { useState, useEffect, useCallback } from 'react';
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../api/expenses';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (payload) => {
    const created = await createExpense(payload);
    setExpenses((prev) => [created, ...prev]);
    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateExpense(id, payload);
    setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const remove = async (id) => {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return { expenses, loading, error, reload: load, add, edit, remove };
};
