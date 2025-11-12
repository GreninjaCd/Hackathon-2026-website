import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { Award } from '../components/icons';

const HomePage = ()=> {
  const navigate = useNavigate();

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <header className="bg-gray-900 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">
            Hackathon 2026
          </h1>
          <p className="mt-4 text-xl text-indigo-300">
            A National-Level Coding Competition by NIT Silchar
          </p>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
            Tackle real-world problems using Artificial Intelligence, Machine Learning, and other emerging technologies.
          </p>
          <div className="mt-10">
            <Button onClick={()=> navigate('/register')} className="px-8 py-3 text-lg">
              Register Your Team Now
            </Button>
            <p className="mt-3 text-sm text-gray-400">Deadline: 30th December 2025</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mt-[-8rem] space-y-16">
        {/* Introduction Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-6">About the Event</h2>
            <p className="text-gray-300 text-lg mb-4">
              This Hackathon aims to provide a national platform for students, researchers, and tech-enthusiasts to showcase their coding and problem-solving skills.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <p>Hosted by the National Institute of Technology, Silchar, an Institute of National Importance, this event brings together the brightest minds to foster collaborative problem-solving and encourage innovation in AI/ML-driven solutions.</p>
              <p>Participants will get exposure to real-life problem-solving environments and the chance to network with peers, faculty, and industry experts, all while competing for a prestigious title and prize pool.</p>
            </div>
          </Card>
        </section>

        {/* Competition Rounds Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Competition Structure</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">Round 1: Online Screening</h3>
                <p className="text-sm text-indigo-400 font-medium">January 2026 (Second Week)</p>
                <p className="mt-4 text-gray-300">A screening round with MCQs, aptitude, and basic coding questions to test your fundamentals. Top performers (Top 75% or 50%+ marks) will advance.</p>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">Round 2: Online AI/ML</h3>
                <p className="text-sm text-indigo-400 font-medium">February 2026 (First Week)</p>
                <p className="mt-4 text-gray-300">Qualified teams will receive problem statements based on coding and AI/ML application. This is where you showcase your technical depth and creativity.</p>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">Round 3: Offline Finale</h3>
                <p className="text-sm text-indigo-400 font-medium">February 2026 (Last Week)</p>
                <p className="mt-4 text-gray-300">The final hackathon challenge! Top teams will compete in a real-time problem-solving event at the NIT Silchar campus.</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Prizes Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Prizes & Recognition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-2 border-yellow-400">
              <Award className="h-16 w-16 text-yellow-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white mt-4">1st Prize</h3>
              <p className="text-4xl font-extrabold text-yellow-400 mt-2">₹50,000</p>
              <p className="text-gray-300 mt-1">+ Certificate of Achievement</p>
            </Card>
            <Card className="text-center p-8 border-2 border-gray-400">
              <Award className="h-16 w-16 text-gray-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white mt-4">2nd Prize</h3>
              <p className="text-4xl font-extrabold text-gray-400 mt-2">₹40,000</p>
              <p className="text-gray-300 mt-1">+ Certificate of Achievement</p>
            </Card>
            <Card className="text-center p-8 border-2 border-yellow-600">
              <Award className="h-16 w-16 text-yellow-600 mx-auto" />
              <h3 className="text-2xl font-bold text-white mt-4">3rd Prize</h3>
              <p className="text-4xl font-extrabold text-yellow-600 mt-2">₹30,000</p>
              <p className="text-gray-300 mt-1">+ Certificate of Achievement</p>
            </Card>
          </div>
          <Card className="mt-8 p-6">
            <h4 className="text-xl font-semibold text-white text-center">All participants will be recognized!</h4>
            <ul className="list-disc list-inside text-gray-300 max-w-2xl mx-auto mt-4 space-y-2">
              <li><span className="font-semibold">Outstanding Performance Certificate:</span> Top 10% of participants (those scoring ≥80%).</li>
              <li><span className="font-semibold">Appreciation Certificate:</span> Participants securing at least 50% marks or ranking in the top 75%.</li>
              <li><span className="font-semibold">Participation Certificate:</span> All registered participants.</li>
            </ul>
          </Card>
        </section>

        {/* Registration & Perks Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="grid md:grid-cols-2 gap-8">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white">Registration Details</h3>
              <ul className="text-gray-300 mt-4 space-y-3">
                <li className="flex items-center space-x-3">
                  <span className="text-indigo-400 font-semibold">Team Size:</span>
                  <span>Up to 3 members (UG/PG/PhD)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-indigo-400 font-semibold">Deadline:</span>
                  <span>30th December 2025</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-indigo-400 font-semibold">Fee:</span>
                  <span>Rs. 2000 per team</span>
                </li>
              </ul>
              <button 
                onClick={() => navigate('/register')} 
                className="w-full mt-6 text-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 px-4 py-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Register Your Team
              </button>
            </div>
            <div className="bg-gray-800 p-8 rounded-b-lg md:rounded-r-lg">
              <h3 className="text-2xl font-bold text-white">Perks for Finalists</h3>
              <ul className="text-gray-300 mt-4 space-y-3 list-disc list-inside">
                <li>Free accommodation during the final round.</li>
                <li>Opportunity to explore local attractions.</li>
                <li>Academic Interaction & Gala Dinner with esteemed academicians.</li>
              </ul>
            </div>
          </Card>
        </section>
        
        {/* Contact Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Have Questions?</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                For any queries or clarifications, please contact the event coordinators:
                <br />
                <span className="font-semibold text-indigo-300">CR, Sec A & B, B.Tech (CSE), 3rd year, NIT Silchar</span>
            </p>
        </section>
      </main>
    </div>
  );
};

export default HomePage;