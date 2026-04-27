import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loginUser, resetPassword } from '../api/api';

const Login = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('login'); // 'login' or 'reset'
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [resetData, setResetData] = useState({ email: '', new_password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (view === 'login') {
        const response = await loginUser(formData);
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: response.name,
            email: response.email,
          }),
        );

        if (response.patient_details) {
          localStorage.setItem('patientData', JSON.stringify(response.patient_details));
        }

        navigate('/dashboard', { replace: true });
      } else {
        await resetPassword(resetData);
        setSuccess('Password reset successfully. You can now login.');
        setView('login');
      }
    } catch (err) {
      setError(err.response?.data?.detail || `Failed to ${view === 'login' ? 'login' : 'reset password'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-outfit">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Side - Image/Hero */}
        <div className="relative hidden md:block bg-blue-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90"></div>
          <div className="absolute inset-0 p-12 flex flex-col justify-between z-10 text-white">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-blue-200" />
              <span className="font-bold text-2xl tracking-tight">MediScan AI</span>

            </div>
            
            <div className="mb-12">
              <h1 className="text-5xl font-bold leading-tight mb-6">
                Protect Yourself and Your Family —<br />
                Easy Online Appointments.
              </h1>
            </div>
          </div>
          <img 
            src="/login_doctor.png" 
            alt="Doctor" 
            className="absolute bottom-0 right-0 w-full object-cover object-bottom h-[80%] z-0 mix-blend-luminosity opacity-80"
          />
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {view === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
                    <button className="flex-1 py-2 text-sm font-semibold rounded-md bg-white shadow-sm text-blue-600">
                      Existing Patient
                    </button>
                    <Link to="/signup" className="flex-1 py-2 text-sm font-semibold rounded-md text-gray-500 hover:text-gray-900 text-center">
                      New Patient
                    </Link>
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Login to start your session</h2>
                  <p className="text-gray-500 mb-8">Secure, quick, and easy</p>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg text-sm font-medium border border-green-100">
                      {success}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div className="flex items-center justify-between">
                      <button 
                        type="button"
                        onClick={() => setView('reset')}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Reset Password
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-lg disabled:opacity-70"
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button 
                    onClick={() => setView('login')}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </button>

                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                  <p className="text-gray-500 mb-8">Enter your email and a new password</p>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
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
                          value={resetData.email}
                          onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                          placeholder="••••••••"
                          value={resetData.new_password}
                          onChange={(e) => setResetData({ ...resetData, new_password: e.target.value })}
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
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
