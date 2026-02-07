import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...signupData } = formData;
    const result = await signup(signupData);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 p-8 sm:p-10 lg:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto h-24 w-24 bg-sky-100 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
              <span className="text-4xl">✨</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-sky-600 to-gray-700 bg-clip-text text-transparent mb-4">
              Create Account
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto">
              Join ShopHub today and start shopping!
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl mb-8 animate-pulse">
              <div className="flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">⚠️</span>
                <span className="font-semibold text-sm leading-relaxed">{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Row: Username & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-3">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-2xl text-sky-400">👤</span>
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Choose a username"
                    className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border-2 border-sky-100 rounded-2xl focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 text-lg placeholder-gray-400 shadow-lg hover:shadow-xl"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-2xl text-sky-400">📧</span>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border-2 border-sky-100 rounded-2xl focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 text-lg placeholder-gray-400 shadow-lg hover:shadow-xl"
                  />
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-3">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <span className="text-2xl text-sky-400">👨‍💼</span>
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border-2 border-sky-100 rounded-2xl focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 text-lg placeholder-gray-400 shadow-lg hover:shadow-xl"
                />
              </div>
            </div>

            {/* Second Row: Password & Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-2xl text-sky-400">🔒</span>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Minimum 6 characters"
                    className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border-2 border-sky-100 rounded-2xl focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 text-lg placeholder-gray-400 shadow-lg hover:shadow-xl"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-2xl text-sky-400">🔐</span>
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border-2 border-sky-100 rounded-2xl focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 text-lg placeholder-gray-400 shadow-lg hover:shadow-xl"
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-2xl text-sky-400">📱</span>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border-2 border-sky-100 rounded-2xl focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 text-lg placeholder-gray-400 shadow-lg hover:shadow-xl"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-3">
                Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 pt-4 flex items-start pointer-events-none">
                  <span className="text-2xl text-sky-400 mt-1">🏠</span>
                </div>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  rows="3"
                  className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border-2 border-sky-100 rounded-2xl focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 text-lg placeholder-gray-400 resize-vertical shadow-lg hover:shadow-xl"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-500 via-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold py-5 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-400 text-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-8 border-t border-sky-100 mt-8">
            <p className="text-lg text-gray-600 mb-6">
              Already have an account?
            </p>
            <Link 
              to="/login"
              className="inline-flex items-center gap-3 bg-white border-2 border-sky-300 hover:border-sky-500 text-sky-700 hover:bg-sky-50 font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
            >
              <span>🔙</span>
              <span>Login Instead</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
