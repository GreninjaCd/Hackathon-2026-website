const Question = require('../models/Question');

// Create a question
const createQuestion = async (req, res) => {
  try {
    const { round, title, description, points, deadline } = req.body;
    const q = await Question.create({ round, title, description, points, deadline });
    res.status(201).json(q);
  } catch (error) {
    console.error('createQuestion error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// List questions for a round
const listQuestions = async (req, res) => {
  try {
    const round = parseInt(req.query.round) || 1;
    const questions = await Question.find({ round });
    res.json(questions);
  } catch (error) {
    console.error('listQuestions error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createQuestion, listQuestions };
