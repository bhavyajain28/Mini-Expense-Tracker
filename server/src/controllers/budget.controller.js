const budgetService = require('../services/budget.service');
const { success, error } = require('../utils/response');

const getAll = (req, res, next) => {
  try {
    const budgets = budgetService.getAll();
    return success(res, budgets);
  } catch (err) {
    next(err);
  }
};

const upsert = (req, res, next) => {
  try {
    const { category, budgetAmount } = req.body;
    const budget = budgetService.upsert(category, budgetAmount);
    return success(res, budget, 200);
  } catch (err) {
    next(err);
  }
};

const updateByCategory = (req, res, next) => {
  try {
    const { category } = req.params;
    const { budgetAmount } = req.body;
    const budget = budgetService.upsert(category, budgetAmount);
    return success(res, budget);
  } catch (err) {
    next(err);
  }
};

const remove = (req, res, next) => {
  try {
    const deleted = budgetService.remove(req.params.category);
    if (!deleted) return error(res, 'Budget not found', 404);
    return success(res, { category: req.params.category });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, upsert, updateByCategory, remove };
