const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../../app');

const TEST_DATA_DIR = path.join(__dirname, '../data');
const EXPENSES_FILE = path.join(TEST_DATA_DIR, 'expenses.json');
const BUDGETS_FILE = path.join(TEST_DATA_DIR, 'budgets.json');

beforeEach(() => {
  fs.writeFileSync(EXPENSES_FILE, JSON.stringify([]), 'utf8');
  fs.writeFileSync(BUDGETS_FILE, JSON.stringify([]), 'utf8');
});

afterEach(() => {
  fs.writeFileSync(EXPENSES_FILE, JSON.stringify([]), 'utf8');
  fs.writeFileSync(BUDGETS_FILE, JSON.stringify([]), 'utf8');
});

describe('GET /health', () => {
  it('returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });
});

describe('Expense CRUD', () => {
  const validExpense = {
    amount: 50.0,
    category: 'Food',
    date: '2024-01-15',
    note: 'Lunch',
  };

  it('GET /api/expenses returns empty array initially', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it('POST /api/expenses creates an expense', async () => {
    const res = await request(app).post('/api/expenses').send(validExpense);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.amount).toBe(50.0);
    expect(res.body.data.category).toBe('Food');
  });

  it('POST /api/expenses rejects negative amount', async () => {
    const res = await request(app).post('/api/expenses').send({ ...validExpense, amount: -10 });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/expenses rejects future date', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const res = await request(app)
      .post('/api/expenses')
      .send({ ...validExpense, date: futureDate.toISOString().split('T')[0] });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/expenses rejects missing category', async () => {
    const res = await request(app).post('/api/expenses').send({ amount: 50, date: '2024-01-15' });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/expenses/:id returns a specific expense', async () => {
    const createRes = await request(app).post('/api/expenses').send(validExpense);
    const id = createRes.body.data.id;
    const res = await request(app).get(`/api/expenses/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
  });

  it('GET /api/expenses/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/expenses/nonexistent-id');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('PUT /api/expenses/:id updates an expense', async () => {
    const createRes = await request(app).post('/api/expenses').send(validExpense);
    const id = createRes.body.data.id;
    const res = await request(app)
      .put(`/api/expenses/${id}`)
      .send({ ...validExpense, amount: 75.0, note: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.data.amount).toBe(75.0);
    expect(res.body.data.note).toBe('Updated');
  });

  it('DELETE /api/expenses/:id removes an expense', async () => {
    const createRes = await request(app).post('/api/expenses').send(validExpense);
    const id = createRes.body.data.id;
    const res = await request(app).delete(`/api/expenses/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
    const checkRes = await request(app).get(`/api/expenses/${id}`);
    expect(checkRes.status).toBe(404);
  });
});

describe('Budget CRUD', () => {
  const validBudget = { category: 'Food', budgetAmount: 500 };

  it('GET /api/budgets returns empty array initially', async () => {
    const res = await request(app).get('/api/budgets');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('POST /api/budgets creates a budget', async () => {
    const res = await request(app).post('/api/budgets').send(validBudget);
    expect(res.status).toBe(200);
    expect(res.body.data.category).toBe('Food');
    expect(res.body.data.budgetAmount).toBe(500);
  });

  it('PUT /api/budgets/:category updates a budget', async () => {
    await request(app).post('/api/budgets').send(validBudget);
    const res = await request(app).put('/api/budgets/Food').send({ budgetAmount: 800 });
    expect(res.status).toBe(200);
    expect(res.body.data.budgetAmount).toBe(800);
  });

  it('DELETE /api/budgets/:category removes a budget', async () => {
    await request(app).post('/api/budgets').send(validBudget);
    const res = await request(app).delete('/api/budgets/Food');
    expect(res.status).toBe(200);
  });
});
