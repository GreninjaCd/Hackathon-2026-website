import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Round1View = () => {
  const { user, showModal } = useAppContext();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [hackathonState, setHackathonState] = useState(null);
  const [team, setTeam] = useState(null);
  const [mySubmission, setMySubmission] = useState(null); // 1. State for user's score
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Silent fetch function for polling
  const fetchHackathonState = async () => {
    try {
      const stateRes = await axios.get('http://localhost:5000/api/state');
      setHackathonState(stateRes.data);
    } catch (error) {
      console.error("Failed to poll state:", error);
    }
  };

  // Initial data load
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const stateRes = await axios.get('http://localhost:5000/api/state');
      setHackathonState(stateRes.data);

      const teamRes = await axios.get('http://localhost:5000/api/teams/myteam');
      setTeam(teamRes.data);
      
      try {
        // Try to get the user's past submission
        const subRes = await axios.get('http://localhost:5000/api/quiz/my-submission/1');
        setMySubmission(subRes.data.submission);
        setTotalQuestions(subRes.data.totalQuestions);
      } catch (subError) {
        // This is OK, it just means they haven't taken the quiz yet
        setMySubmission(null);
      }

    } catch (error) {
      // Errors expected if user has no team
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    // Poll for updates every 10 seconds
    const intervalId = setInterval(fetchHackathonState, 10000);
    // Clean up
    return () => clearInterval(intervalId);
  }, []);

  const handleStartQuiz = async () => {
    if (!window.confirm("Are you sure you want to start the quiz? This will begin your 30-minute timer and can only be done once.")) {
      return;
    }
    
    try {
      const { data } = await axios.get('http://localhost:5000/api/quiz/start/1');
      // On success, navigate to the quiz page and pass the data
      navigate('/quiz/1', { state: { quizData: data } });
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to start quiz');
    }
  };

  if (loading) {
    return <p className="text-gray-300 text-center">Loading Round 1 status...</p>;
  }
  
  if (!team) {
    return <p className="text-yellow-400 text-center">You must be on a team to participate in Round 1.</p>;
  }
  
  if (team.paymentStatus !== 'completed') {
    return <p className="text-yellow-400 text-center">Your team's payment must be verified to start Round 1.</p>;
  }
  
  if (!hackathonState || hackathonState.round1Status === 'Pending') {
    return <p className="text-gray-300 text-center">Round 1 has not started yet. Please check back later.</p>;
  }
  
  if (hackathonState.round1Status === 'Completed') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Round 1: Results</h2>
        <p className="text-green-400 text-center mb-6">Round 1 is complete.</p>
        {mySubmission ? (
          <Card className="bg-gray-800 p-6 text-center">
            <h3 className="text-lg text-gray-300">Your Score</h3>
            <p className="text-4xl font-bold text-white my-2">{mySubmission.score} / {totalQuestions}</p>
            <h3 className="text-lg text-gray-300 mt-4">Your Team's Average Score</h3>
            <p className="text-2xl font-bold text-indigo-400">{team.round1FinalScore.toFixed(2)}</p>
          </Card>
        ) : (
          <p className="text-yellow-400 text-center">You did not submit an entry for Round 1.</p>
        )}
      </div>
    );
  }

  // --- 4. SHOW RESULTS IF USER HAS ALREADY TAKEN THE QUIZ ---
  if (mySubmission) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Round 1: Submitted</h2>
        <p className="text-green-400 text-center mb-6">You have successfully submitted the quiz.</p>
        <Card className="bg-gray-800 p-6 text-center">
          <h3 className="text-lg text-gray-300">Your Score</h3>
          <p className="text-4xl font-bold text-white my-2">{mySubmission.score} / {totalQuestions}</p>
          <p className="text-gray-400 text-sm">Waiting for other team members to finish...</p>
          <h3 className="text-lg text-gray-300 mt-4">Current Team Average</h3>
          <p className="text-2xl font-bold text-indigo-400">{team.round1FinalScore.toFixed(2)}</p>
        </Card>
      </div>
    );
  }

  if (!hackathonState || hackathonState.round1Status === 'Pending') {
    return <p className="text-gray-300 text-center">Round 1 has not started yet. Please check back later.</p>;
  }
  
  // If we get here, Round 1 is 'Active' and payment is verified.
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Round 1: Online Screening</h2>
      <p className="text-gray-300 mb-4">
        This is a 30-minute, 30-question quiz. Your 30-minute timer will begin as soon as you click "Start Quiz".
      </p>
      <p className="text-yellow-400 font-semibold mb-6">
        Once started, this attempt cannot be paused or retaken. Each team member must take the quiz individually. Your team's score will be the average of all members' scores.
      </p>
      <Button onClick={handleStartQuiz} className="text-lg px-8 py-3">
        Start Quiz
      </Button>
    </div>
  );
};

export default Round1View;