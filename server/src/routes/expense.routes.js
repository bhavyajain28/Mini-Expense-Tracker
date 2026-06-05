const { Router } = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/expense.controller');
const validate = require('../middleware/validate');

const router = Router();

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Education', 'Other'];

const expenseValidation = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO date')
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (inputDate > today) throw new Error('Date cannot be in the future');
      return true;
    }),
  body('note').optional().isString().trim(),
];

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', expenseValidation, validate, controller.create);
router.put('/:id', expenseValidation, validate, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
