import { Link, useLocation } from 'react-router-dom';
import { Activity, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

function Navbar() {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-2 rounded-lg text-white group-hover:bg-indigo-700 transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <span className="font-black text-xl tracking-tighter text-gray-900 uppercase">
              MediScan <span className="text-indigo-600">AI</span>
            </span>
          </Link>
          <div className="flex space-x-1 sm:space-x-4 items-center">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-indigo-50 rounded-md -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="ml-4 inline-flex items-center gap-2 px-4 py-2 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 border border-indigo-200 transition-all active:scale-95"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="ml-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 hover:shadow-indigo-300 active:scale-95"
            >
              <Stethoscope className="w-4 h-4" />
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
