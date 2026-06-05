const path = require('path');

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  dataDir: path.join(__dirname, '../data'),
  expensesFile: path.join(__dirname, '../data/expenses.json'),
  budgetsFile: path.join(__dirname, '../data/budgets.json'),
};
