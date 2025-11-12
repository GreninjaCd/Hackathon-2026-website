import React, { useState } from 'react';
import Card from '../../components/Card';
import { Users, DollarSign, ClipboardList, Code, Award } from '../../components/icons';

// Import your sub-views
import TeamView from './TeamView';
import PaymentView from './PaymentView';
import Round1View from './Round1View';
import Round2View from './Round2View';
import ResultsView from './ResultsView';

const DashboardPage = ()=> {
  const [activeView, setActiveView] = useState('team');

  const views = {
    team: <TeamView />,
    payment: <PaymentView />,
    round1: <Round1View />,
    round2: <Round2View />,
    results: <ResultsView />,
  };

  const NavItem = ({ view, icon, children })=> (
    <button
      onClick={()=> setActiveView(view)}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-all ${
        activeView === view
          ? 'bg-indigo-600 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-8">Participant Dashboard</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <div className="bg-gray-800 p-4 rounded-lg space-y-2">
            <NavItem view="team" icon={<Users className="h-5 w-5" />}>
              My Team
            </NavItem>
            <NavItem view="payment" icon={<DollarSign className="h-5 w-5" />}>
              Payment
            </NavItem>
            <NavItem view="round1" icon={<ClipboardList className="h-5 w-5" />}>
              Round 1: Screening
            </NavItem>
            <NavItem view="round2" icon={<Code className="h-5 w-5" />}>
              Round 2: AI/ML
            </NavItem>
            <NavItem view="results" icon={<Award className="h-5 w-5" />}>
              Results & Certificates
            </NavItem>
          </div>
        </aside>
        <main className="md:w-3/4">
          <Card className="p-6 md:p-8 min-h-[400px]">
            {views[activeView]}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;