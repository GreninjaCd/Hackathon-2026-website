import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';

// We no longer need mockUsers

const UserManagementView = () => {
  const [users, setUsers] = useState([]); // 1. State to hold real users
  const [loading, setLoading] = useState(true);
  const { showModal } = useAppContext();

  // 2. Fetch users when the component loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // This calls the new route we just made.
        // Your AppContext automatically sends the auth token.
        const { data } = await axios.get('http://localhost:5000/api/auth/users');
        setUsers(data);
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch users';
        showModal(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [showModal]); // Run once when component mounts

  const handleDeleteUser = async (userId) => {
    // Show a confirmation popup
    if (!window.confirm('Are you sure you want to remove this user? This cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${userId}`);
      showModal('User removed successfully', 'success');
      // Update the UI by filtering out the deleted user
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to remove user');
    }
  };

  if (loading) {
    return <p className="text-gray-300 text-center p-4">Loading users...</p>;
  }

  // 3. Render the real user data
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">College</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {users.map(user => (
              <tr key={user._id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{user.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{user.college}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {/* We can check if 'teamId' exists, which we populated */}
                  {user.teamId ? user.teamId.name : 'N/A'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {/* We can add delete functionality later */}
                  <button 
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-500 hover:text-red-400">Delete</button> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementView;