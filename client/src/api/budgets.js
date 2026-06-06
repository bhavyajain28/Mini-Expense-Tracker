import api from './axios';

export const fetchBudgets = () => api.get('/api/budgets').then((r) => r.data.data);

export const saveBudget = (payload) => api.post('/api/budgets', payload).then((r) => r.data.data);

export const updateBudget = (category, budgetAmount) =>
  api.put(`/api/budgets/${category}`, { budgetAmount }).then((r) => r.data.data);

export const deleteBudget = (category) =>
  api.delete(`/api/budgets/${category}`).then((r) => r.data.data);
