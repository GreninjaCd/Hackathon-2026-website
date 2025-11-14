import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';

const ResultsView = () => {
  // --- 1. ALL HOOKS MUST BE AT THE TOP ---
  const { user, showModal } = useAppContext();
  const [rankedTeams, setRankedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hackathonState, setHackathonState] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // This hook fetches all data
  useEffect(() => {
    // 2. Add the 'if (user)' check *inside* the hook
    if (user) {
      const fetchResultsData = async () => {
        try {
          setLoading(true);
          // Get the global hackathon state
          const stateRes = await axios.get('http://localhost:5000/api/state');
          setHackathonState(stateRes.data);

          // Only fetch results if Round 1 is actually completed
          if (stateRes.data.round1Status === 'Completed') {
            const resultsRes = await axios.get('http://localhost:5000/api/teams/results/1');
            setRankedTeams(resultsRes.data);
          }
        } catch (error) {
          showModal(error.response?.data?.message || 'Failed to fetch results');
        } finally {
          setLoading(false);
        }
      };
      fetchResultsData();
    }
  }, [user, showModal]); // 3. Make the hook depend on 'user'

  // --- 3. THIS IS THE CORRECT DOWNLOAD FUNCTION ---
  const handleDownload = async (path) => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      // This 'axios' request *will* send your auth token
      const response = await axios.get(
        `http://localhost:5000/api/download?filepath=${path.replace(/\\/g, '/')}`,
        {
          responseType: 'blob', // Expect raw file data
        }
      );

      // Create a temporary URL for the downloaded data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary link
      const link = document.createElement('a');
      link.href = url;
      
      // Get the filename from the path
      const filename = path.split('\\').pop().split('/').pop();
      link.setAttribute('download', filename); // Force download
      
      // Click the link, then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up

    } catch (error) {
      showModal('Failed to download file.');
    } finally {
      setIsDownloading(false);
    }
  };

  // --- 4. ALL 'return' STATEMENTS COME AFTER HOOKS ---
  
  // Handle the 'user' still loading
  if (!user) {
    return <p className="text-gray-300 text-center">Loading user...</p>;
  }

  // Handle data loading
  if (loading) {
    return <p className="text-gray-300 text-center">Loading results...</p>;
  }

  // Show this message if the admin hasn't finished the round
  if (!hackathonState || hackathonState.round1Status !== 'Completed') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Results & Certificates</h2>
        <p className="text-gray-300 text-center">
          Round 1 results are not yet available. Please check back after the round has finished.
        </p>
      </div>
    );
  }

  // Find the user's team in the ranked list
  let myTeamRank = -1;
  let myTeamData = null;

  rankedTeams.forEach((team, index) => {
    if (team._id === user.teamId) {
      myTeamRank = index + 1;
      myTeamData = team;
    }
  });

  // Calculate the cutoff for the top 30%
  const qualifyingCount = Math.ceil(rankedTeams.length * 0.30);
  const didAdvance = myTeamRank > 0 && myTeamRank <= qualifyingCount;

  // This is the main return
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Round 1 Results</h2>
      {myTeamData ? (
        <Card className="bg-gray-800 p-8 text-center mb-8">
          
          {/* 6. REPLACED the broken icons with text */}
          <div className="text-5xl mb-4">{didAdvance ? '🎉' : '👍'}</div>
          
          <h3 className={`text-3xl font-bold mt-4 ${didAdvance ? 'text-green-400' : 'text-yellow-400'}`}>
            {didAdvance ? "Congratulations! You've Advanced!" : "Thank You For Participating!"}
          </h3>
          <p className="text-gray-300 mt-2">
            {didAdvance 
              ? `Your team has placed in the Top 30% and advanced to Round 2.` 
              : `Your team did not advance to the next round. We hope to see you next year!`}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-8 text-left">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Your Rank</p>
              <p className="text-2xl font-bold text-white">{myTeamRank} / {rankedTeams.length}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Team Score (Avg)</p>
              <p className="text-2xl font-bold text-white">{myTeamData.round1FinalScore.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-gray-800 p-8 text-center mb-8">
          <p className="text-yellow-400">
            You did not participate or your team's score was not recorded for Round 1.
          </p>
        </Card>
      )}

      {/* --- 1. THIS IS THE UPDATED CERTIFICATE CARD --- */}
      <Card className="bg-gray-800 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Certificates</h3>
        
        {/* Round 1 Certificate (for everyone who participated) */}
        {hackathonState.round1CertificatePath ? (
          <div className="mb-4">
            <p className="text-gray-300 mb-2">Thank you for your participation.</p>
            
            {/* --- 4. USE THE 'onClick' BUTTON --- */}
            <Button
              onClick={() => handleDownload(hackathonState.round1CertificatePath)}
              disabled={isDownloading}
            >
              {isDownloading ? 'Downloading...' : 'Download R1 Participation Certificate'}
            </Button>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Round 1 Certificates are not yet available.</p>
        )}
        
        {/* Round 2 Certificate (only for finalists) */}
        {didAdvance && hackathonState.round2CertificatePath && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-green-400 mb-2">Congratulations on advancing!</p>
            
            {/* --- 5. USE THE 'onClick' BUTTON --- */}
            <Button
              onClick={() => handleDownload(hackathonState.round2CertificatePath)}
              disabled={isDownloading}
            >
              {isDownloading ? 'Downloading...' : 'Download R2 Advancement Certificate'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResultsView ;