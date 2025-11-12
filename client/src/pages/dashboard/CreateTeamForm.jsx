import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';

const CreateTeamForm = () => {
  const [teamName, setTeamName] = useState('');
  const { showModal, login } = useAppContext(); // Get 'login' to refresh the user

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamName) {
      showModal('Please enter a team name.');
      return;
    }

    try {
      // 1. Call the backend 'createTeam' route
      await axios.post('http://localhost:5000/api/teams', { name: teamName });
      
      // 2. IMPORTANT: Refresh the user's data
      // We must get the new 'teamId' into our context.
      const { data } = await axios.get('http://localhost:5000/api/auth/profile');
      const token = localStorage.getItem('token');
      login(token, data); // Re-login with the updated user data
      
      showModal('Team created successfully!', 'success');
      // The TeamView will now re-render and show the TeamDetails component
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create team';
      showModal(message);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Your Team</h2>
      <p className="text-gray-300 mb-6 text-center">
        You are not in a team yet. Create a team to get started. You can add up to 2 other members after creation.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter your team name"
          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <Button type="submit" className="w-full justify-center text-lg">
          Create Team
        </Button>
      </form>
    </div>
  );
};

export default CreateTeamForm;