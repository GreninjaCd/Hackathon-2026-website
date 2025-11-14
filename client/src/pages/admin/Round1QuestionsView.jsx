import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Round1QuestionsView = () => {
  const { showModal, user } = useAppContext();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roundState, setRoundState] = useState(null);

  // State for the 'Add New' form
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);

  // --- 1. ALL HOOKS MUST COME FIRST ---
  useEffect(() => {
    // Check for 'user' before fetching
    if (user) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const stateRes = await axios.get('http://localhost:5000/api/state');
          setRoundState(stateRes.data);
          
          const qRes = await axios.get('http://localhost:5000/api/questions?round=1');
          setQuestions(qRes.data);
          
        } catch (error) {
          showModal(error.response?.data?.message || 'Failed to fetch data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user, showModal]); // Depend on 'user'

  // --- 2. YOU ARE MISSING THESE FUNCTIONS ---
  
  // Handler for option text change
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Handler for submitting the new question
  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/questions', {
        round: 1,
        title,
        options,
        correctOption: parseInt(correctOption, 10)
      });
      showModal('Question created successfully!', 'success');
      // Clear form and refetch
      setTitle('');
      setOptions(['', '', '', '']);
      setCorrectOption(0);
      
      // Manually refetch after creating
      const qRes = await axios.get('http://localhost:5000/api/questions?round=1');
      setQuestions(qRes.data);

    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to create question');
    }
  };
  
  // Handler for deleting a question
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`http://localhost:5000/api/questions/${id}`);
        showModal('Question deleted', 'success');
        // Manually refetch after deleting
        const qRes = await axios.get('http://localhost:5000/api/questions?round=1');
        setQuestions(qRes.data);
      } catch (error) {
        showModal(error.response?.data?.message || 'Failed to delete question');
      }
    }
  };

  // Handler for starting/ending the round
  const handleSetRoundStatus = async (status) => {
    if (!window.confirm(`Are you sure you want to set Round 1 to "${status}"?`)) return;
    
    try {
      const { data } = await axios.post('http://localhost:5000/api/state/round1', { status });
      setRoundState(data);
      showModal(`Round 1 is now ${status}`, 'success');
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to update round state');
    }
  };

  // --- 3. THE 'if' CHECKS COME AFTER ALL HOOKS ---
  if (!user) {
    return <p className="text-gray-300 text-center">Loading user...</p>;
  }
  
  if (loading) {
    return <p className="text-gray-300">Loading...</p>;
  }

  // --- 4. THIS IS THE FULL RENDER ---
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Round 1 Question Bank</h2>

      {/* --- ROUND CONTROL CARD --- */}
      <Card className="bg-gray-800 p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Round 1 Control</h3>
        {roundState && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">Current Status:</p>
              <span className={`text-lg font-bold ${
                roundState.round1Status === 'Active' ? 'text-green-400' :
                roundState.round1Status === 'Pending' ? 'text-yellow-400' :
                'text-red-400' // Completed status
              }`}>
                {roundState.round1Status}
              </span>
            </div>
            <div className="space-x-4">
              {roundState.round1Status === 'Pending' && (
                <Button onClick={() => handleSetRoundStatus('Active')}>
                  Start Round 1
                </Button>
              )}
              {roundState.round1Status === 'Active' && (
                <Button variant="secondary" className="!bg-red-800" onClick={() => handleSetRoundStatus('Completed')}>
                  End Round 1
                </Button>
              )}
              {roundState.round1Status === 'Completed' && (
                <Button variant="secondary" className="!bg-gray-600" onClick={() => handleSetRoundStatus('Pending')}>
                  Reset Round (Back to Pending)
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
      
      {/* --- ADD NEW QUESTION FORM --- */}
      <Card className="bg-gray-800 p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Add New Question (MCQ)</h3>
        <form onSubmit={handleCreateQuestion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Question Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md"
              placeholder="e.g., What is 2+2?"
              required
            />
          </div>
          
          {options.map((option, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-300">Option {index + 1}</label>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md"
                placeholder={`Option ${index + 1}`}
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-300">Correct Option</label>
            <select
              value={correctOption}
              onChange={(e) => setCorrectOption(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md"
            >
              <option value={0}>Option 1</option>
              <option value={1}>Option 2</option>
              <option value={2}>Option 3</option>
              <option value={3}>Option 4</option>
            </select>
          </div>
          
          <Button type="submit">Add Question</Button>
        </form>
      </Card>

      {/* --- LIST OF CURRENT QUESTIONS --- */}
      <h3 className="text-xl font-semibold text-white mb-4">Current Questions</h3>
      <div className="space-y-4">
        {!loading && questions.length === 0 && <p className="text-gray-400">No Round 1 questions created yet.</p>}
        
        {questions.map(q => (
          <Card key={q._id} className="bg-gray-700 p-4">
            <p className="text-white font-semibold">{q.title}</p>
            <ul className="list-disc list-inside text-gray-300 pl-4 mt-2">
              {q.options.map((opt, i) => (
                <li key={i} className={i === q.correctOption ? 'font-bold text-green-400' : ''}>
                  {opt} {i === q.correctOption && '(Correct)'}
                </li>
              ))}
            </ul>
            <div className="text-right space-x-2 mt-2">
              <Button 
                variant="secondary" 
                className="py-1 px-2 text-xs !bg-red-800 hover:!bg-red-700"
                onClick={() => handleDelete(q._id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Round1QuestionsView;