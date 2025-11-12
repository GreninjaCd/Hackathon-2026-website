import React from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Award } from '../../components/icons';

const ResultsView = ()=> (
  <div>
    <h2 className="text-2xl font-bold text-white mb-6">Results & Certificates</h2>
    <p className="text-gray-300 mb-6">Your results and earned certificates will appear here after the competition concludes.</p>
    
    {/* Example of an earned certificate */}
    <Card className="bg-gray-700 p-4 mb-4">
      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
        <Award className="h-5 w-5 text-indigo-400" />
        <span>Participation Certificate</span>
      </h3>
      <p className="text-gray-400 mt-2">Awarded for registering and participating in Hackathon 2026.</p>
      <Button variant="outline" className="mt-4">Download</Button>
    </Card>

    {/* Example of a locked certificate */}
    <Card className="bg-gray-700 p-4 opacity-60">
      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
        <Award className="h-5 w-5 text-gray-400" />
        <span>Appreciation Certificate</span>
      </h3>
      <p className="text-gray-400 mt-2">Awarded for placing in the top 75%.</p>
      <Button variant="outline" className="mt-4" disabled>Locked</Button>
    </Card>
  </div>
);

export default ResultsView;