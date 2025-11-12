import React from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Round2View = ()=> (
  <div>
    <h2 className="text-2xl font-bold text-white mb-2">Round 2: AI/ML Challenge</h2>
    <p className="text-indigo-400 mb-6">Status: Locked (Requires Round 1 qualification)</p>
    <p className="text-gray-300 mb-4">
      Problem statements based on coding and AI/ML applications will be posted here. Your team will have one week (February 1st week) to build and submit your solution.
    </p>
    <Card className="bg-gray-700 p-4">
      <h3 className="text-lg font-semibold text-white">Problem Statement 1</h3>
      <p className="text-gray-400 mt-2">--- Locked ---</p>
      <Button disabled={true} className="cursor-not-allowed opacity-50 mt-4">
        Submit Solution
      </Button>
    </Card>
  </div>
);

export default Round2View;