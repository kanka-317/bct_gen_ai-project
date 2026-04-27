import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { signupUser } from '../api/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signupUser(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Side - Image/Hero */}
        <div className="relative hidden md:block bg-blue-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-blue-600 opacity-90"></div>
          <div className="absolute inset-0 p-12 flex flex-col justify-between z-10 text-white">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-blue-200" />
              <span className="font-bold text-2xl tracking-tight">MediScan AI</span>

            </div>
            
            <div className="mb-12">
              <h1 className="text-5xl font-bold leading-tight mb-6">
                Join the Future of<br />
                Healthcare Today.
              </h1>
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 w-max border border-white/20">
                <CheckCircle2 className="text-green-400 w-6 h-6" />
                <span className="font-medium">AI-Powered Diagnostics</span>
              </div>
            </div>
          </div>
          <img 
            src="/login_doctor.png" 
            alt="Doctor" 
            className="absolute bottom-0 left-0 w-full object-cover object-bottom h-[80%] z-0 mix-blend-luminosity opacity-80 scale-x-[-1]"
          />
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
              <Link to="/login" className="flex-1 py-2 text-sm font-semibold rounded-md text-gray-500 hover:text-gray-900 text-center">
                Existing Patient
              </Link>
              <button className="flex-1 py-2 text-sm font-semibold rounded-md bg-white shadow-sm text-blue-600">
                New Patient
              </button>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-500 mb-8">Your health, securely managed</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-lg disabled:opacity-70"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
