const Question = require('../models/Question');

// @desc    Admin: Create a new question
// @route   POST /api/questions
const createQuestion = async (req, res) => {
  try {
    const { round, title, description, points, deadline, options, correctOption } = req.body;

    // Logic for Round 1 (MCQ)
    if (round === 1) {
      if (!title || !options || options.length !== 4 || correctOption === undefined) {
        return res.status(400).json({ message: 'MCQ must have a title, 4 options, and a correctOption' });
      }
      const q = await Question.create({ round, title, options, correctOption });
      return res.status(201).json(q);
    }

    // --- 1. THIS IS THE FIX ---
    // We simplify this logic. The 'handleSaveProblem' on the frontend
    // will decide whether to create or update. This function will just create.
    if (round === 2) {
      const q = await Question.create({ round, title, description, points, deadline });
      return res.status(201).json(q);
    }
    
    return res.status(400).json({ message: 'Invalid round' });

  } catch (error) {
    console.error('createQuestion error', error);
    if (error.code === 11000) {
      // This will catch if a R1 question has a duplicate title
      return res.status(400).json({ message: 'A question with this title already exists.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    List questions for a round (for users)
// @route   GET /api/questions
const listQuestions = async (req, res) => {
  try {
    const round = parseInt(req.query.round) || 1;
    const questions = await Question.find({ round }).select('-correctOption');
    res.json(questions);
  } catch (error) {
    console.error('listQuestions error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Delete a question
// @route   DELETE /api/questions/:id
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    await question.deleteOne();
    res.json({ message: 'Question removed' });
  } catch (error) {
    console.error('deleteQuestion error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Update a question
// @route   PUT /api/questions/:id
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const { title, description, deadline, options, correctOption } = req.body;

    question.title = title || question.title;
    question.description = description === undefined ? question.description : description;
    question.deadline = deadline;
    
    if (question.round === 1) {
      question.options = options || question.options;
      question.correctOption = correctOption !== undefined ? correctOption : question.correctOption;
    }

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { 
  createQuestion, 
  listQuestions, 
  deleteQuestion, 
  updateQuestion
};