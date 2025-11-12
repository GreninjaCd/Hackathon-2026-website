const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  round: {
    type: Number,
    required: true,
    enum: [1, 2]
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;