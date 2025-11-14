import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';

const SubmissionsView = () => {
  // --- 1. ALL HOOKS AT THE TOP ---
  const { user, showModal } = useAppContext();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 2. 'useEffect' HOOK ---
  useEffect(() => {
    // Check for 'user' before fetching
    if (user) {
      const fetchSubmissions = async () => {
        try {
          setLoading(true);
          // Call the new backend route
          const { data } = await axios.get('http://localhost:5000/api/submissions/round/2');
          setSubmissions(data);
        } catch (error) {
          showModal(error.response?.data?.message || 'Failed to fetch submissions');
        } finally {
          setLoading(false);
        }
      };
      fetchSubmissions();
    }
  }, [user, showModal]); // Depend on 'user'

  const handleAdvance = async (teamId) => {
    if (!window.confirm("Are you sure you want to advance this team to the finale?")) {
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/teams/${teamId}/advance`);
      showModal('Team advanced to finale!', 'success');
      setSubmissions(prevSubmissions =>
        prevSubmissions.map(sub =>
          sub.team._id === teamId
            ? { ...sub, team: { ...sub.team, isFinalist: true } } // Set isFinalist to true
            : sub
        )
      );
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to advance team');
    }
  };

  // --- 3. 'if' CHECKS (AFTER HOOKS) ---
  if (!user) {
    return <p className="text-gray-300 text-center">Loading...</p>;
  }

  if (loading) {
    return <p className="text-gray-300 text-center">Loading submissions...</p>;
  }

  // --- 4. MAIN RENDER ---
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Round 2 Submissions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Submitted By</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">File</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {submissions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-3 text-center text-gray-400">
                  No submissions for Round 2 yet.
                </td>
              </tr>
            ) : (
              submissions.map(sub => (
                <tr key={sub._id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-white">{sub.team.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{sub.user.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{new Date(sub.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <a 
                      href={`http://localhost:5000/${sub.projectZipFile.replace(/\\/g, '/')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline"
                    >
                      Download .zip
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{sub.submissionNotes || 'N/A'}</td>
                  {/* 3. ADD NEW ACTION CELL */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {sub.team.isFinalist ? (
                      // Team is already a finalist
                      <Button
                        variant="secondary"
                        className="py-1 px-2 text-xs"
                        disabled
                      >
                        Advanced
                      </Button>
                    ) : (
                      // Show the 'Advance' button
                      <Button
                        variant="primary"
                        className="py-1 px-2 text-xs"
                        onClick={() => handleAdvance(sub.team._id)}
                      >
                        Advance to Finale
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionsView;