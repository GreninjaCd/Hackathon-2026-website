import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

const CertificateView = () => {
  const { user, showModal } = useAppContext();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  // File states
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/state');
      setState(data);
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to fetch state');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleUpload = async (e, round) => {
    e.preventDefault();
    const file = round === 1 ? file1 : file2;

    if (!file) {
      showModal('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('certificate', file);

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/state/certificate/${round}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setState(data.state);
      setFile1(null);
      setFile2(null);
      showModal('Certificate uploaded successfully!', 'success');

    } catch (error) {
      showModal(error.response?.data?.message || 'Upload failed');
    }
  };

  if (!user || loading) {
    return (
      <p className="text-center text-[#00e5ff] animate-pulse">
        Loading…
      </p>
    );
  }

  return (
    <div className="space-y-12 animate-fadeIn">

      <h2
        className="
          text-4xl font-extrabold mb-4
          bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
          bg-clip-text text-transparent
          drop-shadow-[0_0_25px_rgba(0,255,127,0.5)]
        "
      >
        Certificate Management
      </h2>

      {/* ---------------- ROUND 1 CERTIFICATES ---------------- */}
      <Card
        className="
          p-8 rounded-xl
          bg-[#001012]/80 backdrop-blur-md
          border border-[#00ff7f44]
          shadow-[0_0_20px_rgba(0,255,127,0.2)]
        "
      >
        <h3 className="text-2xl font-bold text-[#00ffae] mb-4">
          Round 1 – Participation Certificate
        </h3>

        {state.round1CertificatePath ? (
          <p className="text-[#00ffb0] mb-3">
            Current File: <span className="text-gray-300">{state.round1CertificatePath}</span>
          </p>
        ) : (
          <p className="text-yellow-400 mb-3">
            No template uploaded yet.
          </p>
        )}

        <form
          onSubmit={(e) => handleUpload(e, 1)}
          className="space-y-5 mt-4"
        >
          <input
            type="file"
            accept=".pdf,.png,.jpg"
            onChange={(e) => setFile1(e.target.files[0])}
            className="
              block w-full text-sm text-gray-300
              file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
              file:bg-[#00e5ff] file:text-black
              hover:file:bg-[#00c2e6]
              transition-all duration-300
            "
          />

          <Button
            type="submit"
            className="w-full py-2 text-lg"
          >
            Upload Round 1 Certificate
          </Button>
        </form>
      </Card>

      {/* ---------------- ROUND 2 CERTIFICATES ---------------- */}
      <Card
        className="
          p-8 rounded-xl
          bg-[#001012]/80 backdrop-blur-md
          border border-[#00e5ff44]
          shadow-[0_0_20px_rgba(0,229,255,0.2)]
        "
      >
        <h3 className="text-2xl font-bold text-[#00e5ff] mb-4">
          Round 2 – Advancement Certificate
        </h3>

        {state.round2CertificatePath ? (
          <p className="text-[#7af2ff] mb-3">
            Current File: <span className="text-gray-300">{state.round2CertificatePath}</span>
          </p>
        ) : (
          <p className="text-yellow-400 mb-3">
            No template uploaded yet.
          </p>
        )}

        <form
          onSubmit={(e) => handleUpload(e, 2)}
          className="space-y-5 mt-4"
        >
          <input
            type="file"
            accept=".pdf,.png,.jpg"
            onChange={(e) => setFile2(e.target.files[0])}
            className="
              block w-full text-sm text-gray-300
              file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
              file:bg-[#00ff7f] file:text-black
              hover:file:bg-[#00d86a]
              transition-all duration-300
            "
          />

          <Button
            type="submit"
            className="w-full py-2 text-lg"
          >
            Upload Round 2 Certificate
          </Button>
        </form>
      </Card>

    </div>
  );
};

export default CertificateView;
