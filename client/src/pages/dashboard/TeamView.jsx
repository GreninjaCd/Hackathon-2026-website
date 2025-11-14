import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';

const TeamView = () => {
  const { user, login, showModal } = useAppContext();
  const [team, setTeam] = useState(null); // Will hold the team data
  const [loading, setLoading] = useState(true);

  // State for the "Add Member" form
  const [email, setEmail] = useState('');
  
  // State for the "Create Team" form
  const [teamName, setTeamName] = useState('');

  if (!user) {
    return <p className="text-gray-300 text-center">Loading user...</p>;
  }
  
  // 1. This effect runs when the component loads
  useEffect(() => {
    // Check if the user is in a team (based on context)
    if (user.teamId) {
      const fetchMyTeam = async () => {
        try {
          // If yes, fetch the full team details
          const { data } = await axios.get('http://localhost:5000/api/teams/myteam');
          setTeam(data);
        } catch (error) {
          showModal(error.response?.data?.message || 'Could not fetch team details');
        } finally {
          setLoading(false);
        }
      };
      fetchMyTeam();
    } else {
      // If no, there's no team to fetch, so just stop loading
      setLoading(false);
    }
  }, [user, showModal]);

  // 2. Function to CREATE a team
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName) {
      showModal('Please enter a team name.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/teams', { name: teamName });
      
      // IMPORTANT: We must refresh the user's data to get the new 'teamId'
      const { data } = await axios.get('http://localhost:5000/api/auth/profile');
      const token = localStorage.getItem('token');
      login(token, data); // Re-login with the updated user (who now has a teamId)
      
      showModal('Team created successfully!', 'success');
      // The component will re-render, and the 'useEffect' will now fetch the team
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to create team');
    }
  };

  // 3. Function to ADD a member
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email) {
      showModal('Please enter an email.');
      return;
    }
    try {
      // Call the 'addMember' route with the team ID and email
      const { data } = await axios.post(
        `http://localhost:5000/api/teams/${team._id}/members`,
        { email }
      );
      setTeam(data); // Update the team state with the new member list
      setEmail(''); // Clear the input
      showModal('Member added successfully!', 'success');
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to add member');
    }
  };

  // 4. Render Loading state
  if (loading) {
    return <p className="text-gray-300 text-center">Loading team...</p>;
  }

  // 5. Render CREATE TEAM form
  // This renders if the user has no 'teamId' (and 'team' is null)
  if (!team) {
    return (
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Your Team</h2>
        <p className="text-gray-300 mb-6 text-center">
          You are not in a team yet. Create a team to get started. You can add up to 2 other members after creation.
        </p>
        <form onSubmit={handleCreateTeam} className="space-y-4">
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
  }

  // 6. Render VIEW TEAM details
  // This renders if 'team' is successfully loaded
  const isLeader = user._id === team.leader._id;
  const maxMembers = 3; // Your requirement

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">My Team</h2>
      <h3 className="text-xl font-semibold text-gray-200">{team.name}</h3>
      <p className="text-indigo-400 mb-4">Team Status: {team.paymentStatus === 'completed' ? 'Payment Verified' : 'Pending Payment'}</p>
      
      <div className="space-y-3 mb-6">
        {team.members.map((member) => (
          <div key={member._id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-white">{member.name} {member._id === user._id && '(You)'}</p>
              <p className="text-sm text-gray-400">{member.email}</p>
            </div>
            {member._id === team.leader._id && (
              <span className="text-xs font-bold text-indigo-400 bg-indigo-900 px-2 py-1 rounded-full">LEADER</span>
            )}
          </div>
        ))}
      </div>
      
      {isLeader && team.members.length < maxMembers && (
        <form onSubmit={handleAddMember} className="flex gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Invite member by email"
          />
          <Button type="submit">Invite</Button>
        </form>
      )}
      
      {team.members.length >= maxMembers && (
        <p className="text-gray-400">Your team is full ({maxMembers}/{maxMembers} members).</p>
      )}
    </div>
  );
};

export default TeamView;