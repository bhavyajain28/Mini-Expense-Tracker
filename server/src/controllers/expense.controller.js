const expenseService = require('../services/expense.service');
const { success, error } = require('../utils/response');

const getAll = (req, res, next) => {
  try {
    const expenses = expenseService.getAll();
    return success(res, expenses);
  } catch (err) {
    next(err);
  }
};

const getById = (req, res, next) => {
  try {
    const expense = expenseService.getById(req.params.id);
    if (!expense) return error(res, 'Expense not found', 404);
    return success(res, expense);
  } catch (err) {
    next(err);
  }
};

const create = (req, res, next) => {
  try {
    const expense = expenseService.create(req.body);
    return success(res, expense, 201);
  } catch (err) {
    next(err);
  }
};

const update = (req, res, next) => {
  try {
    const expense = expenseService.update(req.params.id, req.body);
    if (!expense) return error(res, 'Expense not found', 404);
    return success(res, expense);
  } catch (err) {
    next(err);
  }
};

const remove = (req, res, next) => {
  try {
    const deleted = expenseService.remove(req.params.id);
    if (!deleted) return error(res, 'Expense not found', 404);
    return success(res, { id: req.params.id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
