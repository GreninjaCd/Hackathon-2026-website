const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  round: {
    type: Number,
    required: true,
    enum: [1, 2] // Round 1 = Quiz, Round 2 = Project
  },
  
  // --- Fields for Round 1 (MCQ) ---
  title: { // This is the question text
    type: String,
    required: true
  },
  options: [{ // An array of 4 option strings
    type: String
  }],
  correctOption: { // The index of the correct option (0, 1, 2, or 3)
    type: Number
  },

  // --- Fields for Round 2 (Project) ---
  // We'll keep these for later
  description: {
    type: String
  },
  points: {
    type: Number
  },
  deadline: {
    type: Date
  }
}, {
  timestamps: true
});

// Ensure we don't have duplicate question text for the same round
questionSchema.index({ round: 1, title: 1 }, { unique: true });

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;