import React, { useState } from 'react'; // 1. Import useState
import { useAppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import axios from 'axios'; // 2. Import axios

const RegisterPage = () => {
  const { showModal } = useAppContext();
  const navigate = useNavigate();

  // 3. Add state to hold all form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    phone: '', // Added this field (see explanation below)
    password: '',
    confirmPassword: '',
  });

  // 4. Create a handler to update state on input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 5. (REPLACED) The new handleSubmit function that calls the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, college, phone, password, confirmPassword } = formData;

    // Frontend validation
    if (password !== confirmPassword) {
      showModal("Passwords do not match.");
      return;
    }
    if (!name || !email || !college || !phone || !password) {
      showModal("Please fill in all fields.");
      return;
    }

    try {
      // This is the connection to your backend API route
      await axios.post(
        'http://localhost:5000/api/auth/register',
        {
          name,
          email,
          college,
          phone,
          password,
        }
      );

      // If successful:
      showModal("Registration successful! Please log in.", "success");
      navigate('/login');

    } catch (error) {
      // Handles backend errors (e.g., "User already exists")
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      showModal(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* 6. Added 'value' and 'onChange' to all inputs */}
            <input
              name="name"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="college"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="College / Institution Name"
              value={formData.college}
              onChange={handleChange}
            />
            {/* 7. Added the 'phone' input field (see explanation) */}
            <input
              name="phone"
              type="tel"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              name="confirmPassword" // Changed 'confirm-password' to 'confirmPassword'
              type="password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div>
            <Button type="submit" className="w-full justify-center text-lg">
              Register
            </Button>
          </div>
        </form>
        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;