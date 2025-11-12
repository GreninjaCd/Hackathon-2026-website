import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import axios from 'axios'; // 1. Import axios

const LoginPage = () => {
  // 2. Get the 'login' function from our updated context
  const { login, showModal } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. This one function handles ALL logins (admin or participant)
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showModal('Please fill in all fields.');
      return;
    }

    try {
      // 4. Call your single backend login route
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password }
      );

      // 5. Your backend sends back the token and user data
      const { token, ...userData } = response.data;

      // 6. We save this in our context. This is the moment you "log in".
      login(token, userData);

      // 7. Now we check the role and redirect
      if (userData.role === 'admin') {
        navigate('/admin'); // Redirect admin
      } else {
        navigate('/dashboard'); // Redirect participant
      }
      
    } catch (error) {
      // Handles "Invalid email or password" from your backend
      const message = error.response?.data?.message || "Login failed. Please try again.";
      showModal(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
        </div>
        
        {/* 8. The form now calls our single 'handleLogin' function */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm rounded-t-md"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm rounded-b-md"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            {/* 9. One single button. Much cleaner! */}
            <Button type="submit" className="w-full justify-center text-lg">
              Sign In
            </Button>
          </div>
        </form>
        <div className="text-sm text-center">
          <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;