import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Code, Menu, X } from './icons';
import Button from './Button';

const Navbar = () => {
  // 1. (CHANGED) Get the new context values
  const { isLoggedIn, user, logout } = useAppContext();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/'); // Redirect to home on logout
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ... (Your logo/brand link is unchanged) ... */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-white flex items-center space-x-2">
              <Code className="h-8 w-8 text-indigo-400" />
              <span className="font-bold text-xl">Hackathon 2026</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/">Home</NavLink>
              
              {/* 2. (CHANGED) Replaced 'auth.isLoggedIn' with 'isLoggedIn' */}
              {!isLoggedIn && (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <Button onClick={() => navigate('/register')} variant="primary" className="ml-4">
                    Register Now
                  </Button>
                </>
              )}
              {/* 3. (CHANGED) Replaced 'auth.isLoggedIn' and 'auth.role' */}
              {isLoggedIn && (
                <>
                  {/* Use 'user?.role' for safety, as user might be null briefly */}
                  <NavLink to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                    Dashboard
                  </NavLink>
                  <Button onClick={handleLogout} variant="secondary" className="ml-4">
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
          {/* ... (Your mobile menu button is unchanged) ... */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink to="/">Home</MobileNavLink>
          
          {/* 4. (CHANGED) Replaced 'auth.isLoggedIn' */}
          {!isLoggedIn && (
            <>
              <MobileNavLink to="/login">Login</MobileNavLink>
              <MobileNavLink to="/register">Register</MobileNavLink>
            </>
          )}
          {/* 5. (CHANGED) Replaced 'auth.isLoggedIn' and 'auth.role' */}
          {isLoggedIn && (
            <>
              <MobileNavLink to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                Dashboard
              </MobileNavLink>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;