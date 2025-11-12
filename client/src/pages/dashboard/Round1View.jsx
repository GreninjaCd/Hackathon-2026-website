import React from 'react';
import Button from '../../components/Button';

const Round1View = ()=> (
  <div>
    <h2 className="text-2xl font-bold text-white mb-2">Round 1: Online Screening</h2>
    <p className="text-indigo-400 mb-6">Status: Starts January 2026 (Second Week)</p>
    <p className="text-gray-300 mb-4">
      This round will be a timed test consisting of Multiple Choice Questions, aptitude problems, and basic coding challenges.
      All team members can take the test, and the best score will be considered.
    </p>
    <p className="text-gray-300 mb-6">
      The "Start Quiz" button will be enabled here when the competition starts.
    </p>
    <Button disabled={true} className="cursor-not-allowed opacity-50">
      Quiz Starts Soon
    </Button>
  </div>
);

export default Round1View;