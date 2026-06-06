const { v4: uuidv4 } = require('uuid');
const { readFile, writeFile } = require('../utils/fileStore');
const config = require('../config');

const getAll = () => readFile(config.expensesFile);

const getById = (id) => {
  const expenses = readFile(config.expensesFile);
  return expenses.find((e) => e.id === id) || null;
};

const create = ({ amount, category, date, note }) => {
  const expenses = readFile(config.expensesFile);
  const now = new Date().toISOString();
  const expense = {
    id: uuidv4(),
    amount: parseFloat(amount),
    category,
    date,
    note: note || '',
    createdAt: now,
    updatedAt: now,
  };
  expenses.push(expense);
  writeFile(config.expensesFile, expenses);
  return expense;
};

const update = (id, { amount, category, date, note }) => {
  const expenses = readFile(config.expensesFile);
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return null;

  expenses[index] = {
    ...expenses[index],
    amount: parseFloat(amount),
    category,
    date,
    note: note !== undefined ? note : expenses[index].note,
    updatedAt: new Date().toISOString(),
  };
  writeFile(config.expensesFile, expenses);
  return expenses[index];
};

const remove = (id) => {
  const expenses = readFile(config.expensesFile);
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return false;
  expenses.splice(index, 1);
  writeFile(config.expensesFile, expenses);
  return true;
};

module.exports = { getAll, getById, create, update, remove };
