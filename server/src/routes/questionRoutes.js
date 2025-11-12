const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createQuestion, listQuestions } = require('../controllers/questionController');

// Create question (example validation)
router.post(
  '/',
  protect,
  [
    check('round').isInt({ min: 1, max: 2 }).withMessage('Round must be 1 or 2'),
    check('title').notEmpty().withMessage('Title is required'),
    check('description').notEmpty().withMessage('Description is required'),
    check('points').isInt({ min: 0 }).withMessage('Points must be a non-negative integer'),
    check('deadline').isISO8601().withMessage('Deadline must be a valid ISO8601 date')
  ],
  validateRequest,
  createQuestion
);

// List questions by round (query ?round=1)
router.get('/', listQuestions);

module.exports = router;
