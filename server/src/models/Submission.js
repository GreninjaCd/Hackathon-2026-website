const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  files: [{
    type: String // URLs to uploaded files
  }],
  score: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['submitted', 'evaluated'],
    default: 'submitted'
  }
}, {
  timestamps: true
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;