import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Round2View = () => {
  // --- 1. ALL HOOKS MUST BE AT THE TOP ---
  const { user, showModal } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [hackathonState, setHackathonState] = useState(null);
  const [team, setTeam] = useState(null);
  const [problem, setProblem] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [didAdvance, setDidAdvance] = useState(false);

  // Form state for submission
  const [file, setFile] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState('');

  // --- 2. 'useEffect' HOOK (RUNS AFTER 'user' IS LOADED) ---
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          // A. Get global hackathon state
          const stateRes = await axios.get('http://localhost:5000/api/state');
          setHackathonState(stateRes.data);
          
          // B. Get user's team
          const teamRes = await axios.get('http://localhost:5000/api/teams/myteam');
          setTeam(teamRes.data);

          // C. Check if team advanced (only if R1 is done)
          if (stateRes.data.round1Status === 'Completed') {
            const resultsRes = await axios.get('http://localhost:5000/api/teams/results/1');
            const rankedTeams = resultsRes.data;
            const qualifyingCount = Math.ceil(rankedTeams.length * 0.30);
            
            const myRank = rankedTeams.findIndex(t => t._id === user.teamId) + 1;
            if (myRank > 0 && myRank <= qualifyingCount) {
              setDidAdvance(true);
            }
          }

          // D. Get Round 2 problem (if it's active)
          if (stateRes.data.round2Status === 'Active') {
            try {
              const problemRes = await axios.get('http://localhost:5000/api/questions?round=2');
              if (problemRes.data.length > 0) {
                setProblem(problemRes.data[0]);
              }
            } catch (e) { /* no problem posted yet */ }
          }
          
          // E. Check for existing Round 2 submission
          try {
            const subRes = await axios.get('http://localhost:5000/api/submissions/myteam/2');
            setMySubmission(subRes.data);
          } catch (e) { /* no submission yet */ }

        } catch (error) {
          // This will fail if user has no team, which is fine
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]); // This hook depends on 'user'

  // --- 3. SUBMISSION HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showModal('Please select a .zip file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('projectFile', file); // Matches backend 'upload.single('projectFile')'
    formData.append('submissionNotes', submissionNotes);

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/submissions/round2',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setMySubmission(data.submission);
      showModal('Submission successful!', 'success');
    } catch (error) {
      showModal(error.response?.data?.message || 'Submission failed');
    }
  };

  // --- 4. RENDER LOGIC (ALL 'return' STATEMENTS ARE AFTER HOOKS) ---

  if (!user) {
    return <p className="text-gray-300 text-center">Loading user...</p>;
  }

  if (loading) {
    return <p className="text-gray-300 text-center">Loading Round 2 status...</p>;
  }

  // Case 1: Round 1 isn't finished yet
  if (!team || !hackathonState || hackathonState.round1Status !== 'Completed') {
    return <p className="text-gray-300 text-center">Round 1 is not yet complete. Please check back later.</p>;
  }

  // Case 2: User did NOT advance
  if (!didAdvance) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Round 2: AI/ML</h2>
        <p className="text-yellow-400 text-center">
          Thank you for participating. Your team did not advance to Round 2.
        </p>
      </div>
    );
  }

  // --- From here on, the user ADVANCED ---

  // Case 3: Round 2 hasn't started
  if (hackathonState.round2Status === 'Pending') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Round 2: AI/ML</h2>
        <p className="text-green-400 text-center">
          Congratulations on advancing! Round 2 has not started yet. The problem statement will appear here soon.
        </p>
      </div>
    );
  }
  
  // Case 4: Round 2 is over
  // --- 1. THIS IS THE UPDATED SECTION ---
  // Case 4: Round 2 is over
  if (hackathonState.round2Status === 'Completed') {
    // We now check the 'isFinalist' flag on the team object
    if (team.isFinalist) {
      return (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Congratulations, Finalist!</h2>
          <Card className="bg-green-800 p-8 text-center">
            <p className="text-3xl font-bold text-white mb-4">🎉 You're Going to the Finale! 🎉</p>
            <p className="text-green-200 text-lg mb-6">
              Your team has been selected as a finalist for the offline finale.
            </p>
            <h3 className="text-xl font-semibold text-white">Event Details</h3>
            <div className="text-green-100 mt-2">
              <p><strong>Location:</strong> NIT Silchar Campus (Venue TBD)</p>
              <p><strong>Date:</strong> February 2026 (Last Week)</p>
              <p>Further details will be emailed to your team leader.</p>
            </div>
          </Card>
        </div>
      );
    } else {
      // They are not a finalist
      return (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Round 2: Completed</h2>
          <Card className="bg-gray-800 p-8 text-center">
            <p className="text-2xl font-bold text-white mb-4">Thank You For Your Submission</p>
            <p className="text-yellow-400">
              Your team was not selected to advance to the final round. We were impressed by your work and hope to see you again next year!
            </p>
          </Card>
        </div>
      );
    }
  }
  
  // --- If we get here, Round 2 is 'Active' ---

  if (!problem) {
    return <p className="text-yellow-400 text-center">Round 2 is active, but the problem statement has not been posted yet.</p>;
  }

  // Case 5: Show the problem statement and submission form
  const isLeader = user._id === team.leader._id;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Round 2: {problem.title}</h2>
      
      <Card className="bg-gray-800 p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Problem Statement</h3>
        <p className="text-gray-300 whitespace-pre-wrap">{problem.description}</p>
        <p className="text-red-400 font-semibold mt-4">
          Deadline: {new Date(problem.deadline).toLocaleString()}
        </p>
      </Card>

      {/* Check if team has ALREADY submitted */}
      {mySubmission ? (
        <Card className="bg-green-800 p-6">
          <h3 className="text-xl font-semibold text-white mb-2">Submission Received</h3>
          <p className="text-green-200">
            Your team's submission was received on {new Date(mySubmission.createdAt).toLocaleString()}.
          </p>
          <p className="text-green-200 mt-2">File: {mySubmission.projectZipFile}</p>
        </Card>
      ) : (
        // Show the submission form
        <Card className="bg-gray-800 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Submit Your Project</h3>
          {!isLeader && (
            <p className="text-yellow-400 text-center mb-4">Only your team leader ({team.leader.name}) can submit the project.</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Submission File (.zip only)</label>
              <input 
                type="file" 
                accept=".zip"
                onChange={(e) => setFile(e.target.files[0])}
                disabled={!isLeader}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Submission Notes (Optional)</label>
              <textarea
                rows="3"
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                disabled={!isLeader}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md disabled:opacity-50"
                placeholder="Add any notes for the reviewers..."
              />
            </div>
            <Button type="submit" disabled={!isLeader}>
              Submit Project
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default Round2View;