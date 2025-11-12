const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { submitAnswer, listSubmissionsForTeam } = require('../controllers/submissionController');

// Submit an answer
router.post(
  '/',
  protect,
  [
    check('questionId').isMongoId().withMessage('questionId must be a valid id'),
    check('answer').notEmpty().withMessage('Answer is required')
  ],
  validateRequest,
  submitAnswer
);

// List submissions for the logged-in user's team
router.get('/team', protect, listSubmissionsForTeam);

module.exports = router;
