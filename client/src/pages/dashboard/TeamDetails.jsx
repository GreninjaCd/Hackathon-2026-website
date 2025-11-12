import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';

const TeamDetails = () => {
  const { user, showModal } = useAppContext();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(''); // For the 'add member' form

  // 1. Fetch team details when component mounts
  useEffect(() => {
    const fetchMyTeam = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/teams/myteam');
        setTeam(data);
      } catch (error) {
        showModal(error.response?.data?.message || 'Could not fetch team details');
      } finally {
        setLoading(false);
      }
    };

    fetchMyTeam();
  }, [showModal]);

  // 2. Handle adding a new member
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
      // The backend now returns the updated team, so we can just set it
      setTeam(data);
      setEmail(''); // Clear the input
      showModal('Member added successfully!', 'success');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add member';
      showModal(message);
    }
  };

  if (loading) {
    return <p className="text-center p-10">Loading team details...</p>;
  }
  
  if (!team) {
    return <p className="text-center p-10 text-red-400">Error: Could not load your team.</p>;
  }

  // Check if the current logged-in user is the team leader
  const isLeader = user._id === team.leader._id;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h2 className="text-3xl font-bold text-white mb-6">{team.name}</h2>
        <h3 className="text-xl font-semibold text-indigo-400 mb-4">Team Members ({team.members.length} / 3)</h3>
        <ul className="space-y-4">
          {team.members.map((member) => (
            <li key={member._id} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-white font-semibold">{member.name}</p>
                <p className="text-gray-400 text-sm">{member.email}</p>
              </div>
              {member._id === team.leader._id && (
                <span className="text-xs font-bold text-indigo-400 bg-indigo-900 px-2 py-1 rounded-full">LEADER</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Show the "Add Member" card ONLY if the user is the leader AND the team is not full */}
      {isLeader && team.members.length < 3 && (
        <div className="p-8 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Add Team Member</h3>
          <p className="text-gray-400 mb-4 text-sm">
            Enter the email of a registered user to add them to your team.
            </p>
          <form onSubmit={handleAddMember} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter member's email"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <Button type="submit" className="w-full justify-center">
              Add Member
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;