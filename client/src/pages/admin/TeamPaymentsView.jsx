import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';

const TeamPaymentsView = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showModal, user } = useAppContext();
  
  // 1. Function to fetch all teams
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/teams');
      setTeams(data);
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [showModal]);

  // 2. Handle verifying payment (Unchanged)
  const handleVerify = async (teamId) => {
    try {
      await axios.post(`http://localhost:5000/api/teams/${teamId}/verify-payment`);
      showModal('Payment verified!', 'success');
      // Update local state
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team._id === teamId ? { ...team, paymentStatus: 'completed' } : team
        )
      );
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to verify payment');
    }
  };

  // --- 3. ADDED: Handle Deleting a Team ---
  const handleDeleteTeam = async (teamId) => {
    // This is the new, stronger warning message
    if (!window.confirm('DANGER: Are you sure you want to delete this team? This will also delete ALL USER ACCOUNTS for all members of this team. This action cannot be undone.')) {
      return;
    }
    
    try {
      // Calls the new backend route
      await axios.delete(`http://localhost:5000/api/teams/${teamId}`);
      showModal('Team and all members removed successfully', 'success');
      // Update UI by filtering out the deleted team
      setTeams(prevTeams => prevTeams.filter(team => team._id !== teamId));
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to remove team');
    }
  };

  if (!user) {
    return <p className="text-gray-300 text-center">Loading...</p>;
  }
  
  if (loading) {
    return <p className="text-gray-300 text-center">Loading teams...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Team Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Members</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Proof</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {teams.map(team => (
              <tr key={team._id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{team.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{team.members.length} / 3</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    team.paymentStatus === 'completed' ? 'bg-green-800 text-green-200' : 'bg-yellow-800 text-yellow-200'
                  }`}>
                    {team.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {team.paymentProof ? (
                    <a 
                      href={`http://localhost:5000/${team.paymentProof.replace(/\\/g, '/')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline"
                    >
                      {team.transactionId || 'View Proof'}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                  {/* Verify Button */}
                  {team.paymentStatus === 'pending' && team.paymentProof && (
                    <Button
                      variant="primary"
                      className="py-1 px-2 text-xs"
                      onClick={() => handleVerify(team._id)}
                    >
                      Verify
                    </Button>
                  )}
                  
                  {/* --- 4. ADDED: Delete Team Button --- */}
                  <Button
                    variant="secondary"
                    className="py-1 px-2 text-xs !bg-red-800 hover:!bg-red-700"
                    onClick={() => handleDeleteTeam(team._id)}
                  >
                    Delete Team
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamPaymentsView;