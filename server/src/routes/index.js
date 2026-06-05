const { Router } = require('express');
const expenseRoutes = require('./expense.routes');
const budgetRoutes = require('./budget.routes');

const router = Router();

router.use('/expenses', expenseRoutes);
router.use('/budgets', budgetRoutes);

module.exports = router;
