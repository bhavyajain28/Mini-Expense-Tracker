const { readFile, writeFile } = require('../utils/fileStore');
const config = require('../config');

const getAll = () => readFile(config.budgetsFile);

const getByCategory = (category) => {
  const budgets = readFile(config.budgetsFile);
  return budgets.find((b) => b.category === category) || null;
};

const upsert = (category, budgetAmount) => {
  const budgets = readFile(config.budgetsFile);
  const index = budgets.findIndex((b) => b.category === category);
  const now = new Date().toISOString();

  if (index === -1) {
    const budget = { category, budgetAmount: parseFloat(budgetAmount), createdAt: now, updatedAt: now };
    budgets.push(budget);
    writeFile(config.budgetsFile, budgets);
    return budget;
  }

  budgets[index] = { ...budgets[index], budgetAmount: parseFloat(budgetAmount), updatedAt: now };
  writeFile(config.budgetsFile, budgets);
  return budgets[index];
};

const remove = (category) => {
  const budgets = readFile(config.budgetsFile);
  const index = budgets.findIndex((b) => b.category === category);
  if (index === -1) return false;
  budgets.splice(index, 1);
  writeFile(config.budgetsFile, budgets);
  return true;
};

module.exports = { getAll, getByCategory, upsert, remove };
