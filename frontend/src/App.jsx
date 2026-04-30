import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DiagnosisForm from './pages/DiagnosisForm';
import ResultDashboard from './pages/ResultDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import About from './pages/About';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  const location = useLocation();

  if (!user) {
    // Redirect to signup for AI Doctor or Diagnosis as requested
    if (location.pathname === '/ai-doctor' || location.pathname === '/diagnose') {
      return <Navigate to="/signup" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [language, setLanguage] = React.useState(() => localStorage.getItem('settings_language') || 'English');

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  React.useEffect(() => {
    localStorage.setItem('settings_language', language);
  }, [language]);

  const themeContext = [isDarkMode, setIsDarkMode, language, setLanguage];

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home themeContext={themeContext} />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard Routes (Protected) */}
        <Route element={<DashboardLayout themeContext={themeContext} />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/diagnose" element={<ProtectedRoute><DiagnosisForm /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><ResultDashboard /></ProtectedRoute>} />
          <Route path="/ai-doctor" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
