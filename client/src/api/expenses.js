import api from './axios';

export const fetchExpenses = () => api.get('/api/expenses').then((r) => r.data.data);

export const fetchExpense = (id) => api.get(`/api/expenses/${id}`).then((r) => r.data.data);

export const createExpense = (payload) => api.post('/api/expenses', payload).then((r) => r.data.data);

export const updateExpense = (id, payload) => api.put(`/api/expenses/${id}`, payload).then((r) => r.data.data);

export const deleteExpense = (id) => api.delete(`/api/expenses/${id}`).then((r) => r.data.data);
