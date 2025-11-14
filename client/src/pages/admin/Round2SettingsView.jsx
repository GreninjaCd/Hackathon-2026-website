import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Round2SettingsView = () => {
  // --- 1. ALL HOOKS AT THE TOP ---
  const { user, showModal } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [roundState, setRoundState] = useState(null);
  const [problem, setProblem] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  // --- 2. 'useEffect' HOOK ---
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]); // Only depend on 'user'

  const fetchData = async () => {
    try {
      setLoading(true);
      const stateRes = await axios.get('http://localhost:5000/api/state');
      setRoundState(stateRes.data);

      try {
        const problemRes = await axios.get('http://localhost:5000/api/questions?round=2');
        if (problemRes.data.length > 0) {
          const p = problemRes.data[0];
          setProblem(p);
          setTitle(p.title);
          setDescription(p.description);
          setDeadline(p.deadline ? new Date(p.deadline).toISOString().split('T')[0] : '');
        }
      } catch (e) {
        setProblem(null);
      }
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // --- 3. HANDLER FUNCTIONS ---
  const handleSetRoundStatus = async (status) => {
    if (!window.confirm(`Are you sure you want to set Round 2 to "${status}"?`)) return;
    try {
      const { data } = await axios.post('http://localhost:5000/api/state/round2', { status });
      setRoundState(data);
      showModal(`Round 2 is now ${status}`, 'success');
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to update round state');
    }
  };

  const handleSaveProblem = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      showModal('Please provide a title and description.');
      return;
    }
    const problemData = { round: 2, title, description, deadline: deadline || null };

    try {
      if (problem) {
        await axios.put(`http://localhost:5000/api/questions/${problem._id}`, problemData);
        showModal('Round 2 Problem Statement Updated!', 'success');
      } else {
        await axios.post('http://localhost:5000/api/questions', problemData);
        showModal('Round 2 Problem Statement Created!', 'success');
      }
      fetchData(); // Refresh data
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to save problem');
    }
  };

  // --- 4. 'if' CHECKS (AFTER HOOKS) ---
  if (!user) {
    return <p className="text-gray-300 text-center">Loading...</p>;
  }

  // This is the new, crucial loading check
  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Round 2 Settings</h2>
        <p className="text-gray-300 text-center">Loading state...</p>
      </div>
    );
  }

  // --- 5. MAIN RENDER ---
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Round 2 Settings</h2>

      {/* --- ROUND CONTROL CARD --- */}
      <Card className="bg-gray-800 p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Round 2 Control</h3>
        {roundState && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">Current Status:</p>
              <span className={`text-lg font-bold ${
                roundState.round2Status === 'Active' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {roundState.round2Status}
              </span>
            </div>
            <div className="space-x-4">
              {roundState.round2Status === 'Pending' && (
                <Button onClick={() => handleSetRoundStatus('Active')} disabled={!problem}>
                  Start Round 2
                </Button>
              )}
              {roundState.round2Status === 'Active' && (
                <Button variant="secondary" className="!bg-red-800" onClick={() => handleSetRoundStatus('Completed')}>
                  End Round 2
                </Button>
              )}
              {roundState.round2Status === 'Completed' && (
                <Button variant="secondary" className="!bg-gray-600" onClick={() => handleSetRoundStatus('Pending')}>
                  Reset Round (Back to Pending)
                </Button>
              )}
            </div>
          </div>
        )}
        {!problem && (
          <p className="text-yellow-400 mt-2 text-sm">You must create a problem statement before you can start the round.</p>
        )}
      </Card>

      {/* --- PROBLEM STATEMENT FORM --- */}
      <Card className="bg-gray-800 p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">
          {problem ? 'Update Problem Statement' : 'Create Problem Statement'}
        </h3>
        <form onSubmit={handleSaveProblem} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md"
              placeholder="e.g., AI-Powered Chatbot"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Description (Problem Statement)</label>
            <textarea
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md"
              placeholder="Enter the full details of the AI/ML problem..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Submission Deadline (Optional)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md"
            />
          </div>
          <Button type="submit">
            {problem ? 'Update Problem' : 'Save Problem'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Round2SettingsView;