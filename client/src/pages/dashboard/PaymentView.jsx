import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';

const PaymentView = () => {
  const { user, showModal } = useAppContext();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [transactionId, setTransactionId] = useState('');
  const [file, setFile] = useState(null); // To hold the selected file

  // 1. Fetch the user's team to check their status
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
    if (user && user.teamId) {
      fetchMyTeam();
    } else {
      setLoading(false);
    }
  }, [user, showModal]);

  // 2. Handle the form submission
  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!transactionId || !file) {
      showModal('Please provide both a transaction ID and a proof file.');
      return;
    }

    // We must use FormData to send a file
    const formData = new FormData();
    formData.append('transactionId', transactionId);
    formData.append('proof', file); // 'proof' must match the backend upload.single('proof')

    try {
      // 3. Send the form data to the backend
      const { data } = await axios.post(
        'http://localhost:5000/api/payments/submit-proof',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      showModal(data.message, 'success');
      // Update local state to show "Awaiting verification"
      setTeam(prev => ({ ...prev, paymentStatus: 'pending', transactionId: 'Submitted', paymentProof: 'true' }));
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to submit proof');
    }
  };

  if (loading) {
    return <p className="text-gray-300 text-center">Loading payment status...</p>;
  }

  // If user is not in a team
  if (!team) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Payment</h2>
        <p className="text-gray-300">You must create or join a team before you can make a payment.</p>
      </div>
    );
  }

  // If team is ALREADY verified
  if (team.paymentStatus === 'completed') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Team Payment (Rs. 2000)</h2>
        <div className="bg-green-900 border-l-4 border-green-500 text-green-100 p-4 rounded-lg mb-6">
          <p className="font-bold">Payment Verified</p>
          <p>Your team is fully registered and eligible to compete. Good luck!</p>
        </div>
      </div>
    );
  }
  
  // If team has ALREADY SUBMITTED proof but is waiting
  if (team.paymentProof) {
     return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Team Payment (Rs. 2000)</h2>
        <div className="bg-yellow-900 border-l-4 border-yellow-500 text-yellow-100 p-4 rounded-lg mb-6">
          <p className="font-bold">Proof Submitted</p>
          <p>Your payment proof is awaiting admin verification. This may take up to 24 hours.</p>
        </div>
      </div>
    );
  }

  // If payment is pending and no proof submitted, show the form
  const isLeader = user._id === team.leader._id;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Team Payment (Rs. 2000)</h2>
      
      {!isLeader && (
         <p className="text-yellow-400 mb-6">Please ask your team leader ({team.leader.name}) to complete the payment.</p>
      )}

      <h3 className="text-lg font-semibold text-gray-200 mb-2">Payment Details</h3>
      <p className="text-gray-300 mb-4">Please deposit Rs. 2000 per team to the account below and upload a screenshot or transaction ID.</p>
      <div className="bg-gray-700 p-4 rounded-lg text-gray-300 space-y-1">
        <p><strong>Account Holder:</strong> Malaya D. Baruah</p>
        <p><strong>Account Number:</strong> 1234567890</p>
        <p><strong>Bank:</strong> SBI, NIT Silchar</p>
        <p><strong>IFSC Code:</strong> SBIN0007061</p>
      </div>
      
      {/* Show form only to the leader */}
      {isLeader && (
        <form onSubmit={handleSubmitProof} className="mt-6 space-y-4">
          <input 
            type="text" 
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
            placeholder="Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
          <input 
            type="file" 
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            onChange={(e) => setFile(e.target.files[0])} // Get the first file
          />
          <Button type="submit">Submit Payment Proof</Button>
        </form>
      )}
    </div>
  );
};

export default PaymentView;