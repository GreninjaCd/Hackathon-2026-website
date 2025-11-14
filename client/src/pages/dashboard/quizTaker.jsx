import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';

// A simple countdown timer component
const Timer = ({ deadline, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(new Date(deadline) - new Date());

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="text-2xl font-bold text-red-400">
      Time Left: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};


const QuizTaker = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showModal } = useAppContext();
  
  const [quizData, setQuizData] = useState(state?.quizData);
  const [answers, setAnswers] = useState({}); // e.g., { 'questionId': 1 }
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!quizData) {
      // If user reloaded the page, redirect them
      showModal('Cannot resume quiz. Please go to your dashboard.');
      navigate('/dashboard');
    }
  }, [quizData, navigate, showModal]);

  const handleSelectAnswer = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async (isTimeUp = false) => {
    if (submitting) return;
    setSubmitting(true);
    
    if (!isTimeUp && !window.confirm("Are you sure you want to submit?")) {
      setSubmitting(false);
      return;
    }

    // Format answers for the backend
    const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption
    }));

    try {
      const { data } = await axios.post('http://localhost:5000/api/quiz/submit/1', {
        submissionId: quizData.submissionId,
        answers: formattedAnswers
      });
      
      showModal(`Quiz Submitted! Your score: ${data.score}/${data.totalQuestions}`, 'success');
      navigate('/dashboard');

    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to submit quiz');
      // Even if submit fails (e.g., "Time limit exceeded"), send them back
      navigate('/dashboard');
    }
  };

  if (!quizData) {
    return <p className="text-center p-10">Loading quiz...</p>; // Should be redirected
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Round 1 Quiz</h1>
        <Timer deadline={quizData.deadline} onTimeUp={() => handleSubmit(true)} />
      </div>

      <div className="space-y-8">
        {quizData.questions.map((q, index) => (
          <div key={q._id} className="bg-gray-800 p-6 rounded-lg">
            <p className="text-lg font-semibold text-white mb-4">
              Q{index + 1}: {q.title}
            </p>
            <div className="space-y-3">
              {q.options.map((option, i) => (
                <label 
                  key={i} 
                  className={`block p-4 rounded-md cursor-pointer ${
                    answers[q._id] === i ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={q._id}
                    className="hidden"
                    onChange={() => handleSelectAnswer(q._id, i)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        onClick={() => handleSubmit(false)} 
        disabled={submitting}
        className="w-full justify-center text-lg mt-8"
      >
        {submitting ? 'Submitting...' : 'Finish & Submit Quiz'}
      </Button>
    </div>
  );
};

export default QuizTaker;