import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { Award } from '../../components/icons';

const Round1ResultsView = () => {
  const { user, showModal } = useAppContext();
  const [rankedTeams, setRankedTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch the ranked results
  useEffect(() => {
    if (user) {
      const fetchResults = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get('http://localhost:5000/api/teams/results/1');
          setRankedTeams(data);
        } catch (error) {
          showModal(error.response?.data?.message || 'Failed to fetch results');
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    }
  }, [user, showModal]);

  // 2. Calculate the top 30%
  const qualifyingCount = Math.ceil(rankedTeams.length * 0.30);

  if (!user) {
    return <p className="text-gray-300 text-center">Loading...</p>;
  }

  if (loading) {
    return <p className="text-gray-300 text-center">Loading results...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Round 1 Leaderboard</h2>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <p className="text-white">
          Showing <span className="font-bold">{rankedTeams.length}</span> paid teams, sorted by score and submission time.
        </p>
        <p className="text-green-400 font-semibold">
          The top {qualifyingCount} teams (Top 30%) advance to Round 2.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score (Avg)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time (Avg)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {rankedTeams.map((team, index) => (
              <tr key={team._id} className={index < qualifyingCount ? 'bg-green-900' : ''}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-white">{index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{team.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{team.round1FinalScore.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{team.round1AvgSubmissionTime.toFixed(0)} sec</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {index < qualifyingCount ? (
                    <span className="flex items-center text-green-400 font-semibold">
                      <Award className="h-4 w-4 mr-1" /> Advanced
                    </span>
                  ) : (
                    <span className="text-gray-500">Eliminated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Round1ResultsView;