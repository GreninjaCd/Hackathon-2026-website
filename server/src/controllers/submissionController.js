const Submission = require('../models/Submission');

// Submit an answer
const submitAnswer = async (req, res) => {
  try {
    const { questionId, answer, files } = req.body;
    const teamId = req.user.teamId;
    if (!teamId) return res.status(400).json({ message: 'User not in a team' });

    const submission = await Submission.create({ team: teamId, question: questionId, answer, files });
    res.status(201).json(submission);
  } catch (error) {
    console.error('submitAnswer error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// List submissions for a team
const listSubmissionsForTeam = async (req, res) => {
  try {
    const teamId = req.user.teamId;
    if (!teamId) return res.status(400).json({ message: 'User not in a team' });

    const subs = await Submission.find({ team: teamId }).populate('question');
    res.json(subs);
  } catch (error) {
    console.error('listSubmissionsForTeam error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitAnswer, listSubmissionsForTeam };
