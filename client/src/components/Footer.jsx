import React from 'react';

const Footer = ()=> {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} NIT Silchar. All rights reserved.</p>
        <p className="text-sm mt-1">CS 304 Software Engineering Project</p>
      </div>
    </footer>
  );
};

export default Footer;