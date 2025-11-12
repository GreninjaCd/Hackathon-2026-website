import React, { useState } from 'react';
import Card from '../../components/Card';
import { Users, DollarSign, ClipboardList, FileText } from '../../components/icons';

// Import Admin sub-views
import UserManagementView from './UserManagementView';
import TeamPaymentsView from './TeamPaymentsView';
import Round1QuestionsView from './Round1QuestionsView';
import SubmissionsView from './SubmissionsView';

const AdminDashboardPage = ()=> {
  const [activeView, setActiveView] = useState('users');

  const views = {
    users: <UserManagementView />,
    payments: <TeamPaymentsView />,
    round1: <Round1QuestionsView />,
    submissions: <SubmissionsView />,
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
      <h1 className="text-3xl font-bold text-white mb-8">Organizer Dashboard</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <div className="bg-gray-800 p-4 rounded-lg space-y-2">
            <NavItem view="users" icon={<Users className="h-5 w-5" />}>
              User Management
            </NavItem>
            <NavItem view="payments" icon={<DollarSign className="h-5 w-5" />}>
              Team Management
            </NavItem>
            <NavItem view="round1" icon={<ClipboardList className="h-5 w-5" />}>
              Round 1 Questions
            </NavItem>
            <NavItem view="submissions" icon={<FileText className="h-5 w-5" />}>
              Round 2 Submissions
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

export default AdminDashboardPage;