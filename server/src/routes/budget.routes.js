const { Router } = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/budget.controller');
const validate = require('../middleware/validate');

const router = Router();

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Education', 'Other'];

const budgetValidation = [
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('budgetAmount')
    .isFloat({ gt: 0 })
    .withMessage('Budget amount must be a positive number'),
];

const amountValidation = [
  body('budgetAmount')
    .isFloat({ gt: 0 })
    .withMessage('Budget amount must be a positive number'),
];

router.get('/', controller.getAll);
router.post('/', budgetValidation, validate, controller.upsert);
router.put('/:category', amountValidation, validate, controller.updateByCategory);
router.delete('/:category', controller.remove);

module.exports = router;
