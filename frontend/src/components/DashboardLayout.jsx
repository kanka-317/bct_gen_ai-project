import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Bell,
  Moon,
  Sun,
  Info,
  MessageCircle,
  LayoutGrid,
  User,
  Stethoscope,
  Menu,
  X,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../utils/translations';

const SidebarIcon = ({ icon: Icon, path, isActive, label, onClick }) => (
  <Link
    to={path}
    onClick={onClick}
    className={`relative flex items-center gap-3 px-5 py-3.5 transition-all group sm:gap-4 sm:px-8 sm:py-4 ${
      isActive
        ? 'text-[#5E5CE6] font-bold bg-indigo-50/50 dark:bg-indigo-500/10'
        : 'text-slate-400 hover:text-[#5E5CE6] hover:bg-slate-50 dark:hover:bg-slate-800/30'
    }`}
  >
    {isActive && (
      <motion.div
        layoutId="sidebar-active"
        className="absolute left-0 h-full w-1.5 rounded-r-xl bg-[#5E5CE6]"
        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
      />
    )}
    <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />
    <span className="text-sm font-black tracking-wide">{label}</span>
  </Link>
);

const DashboardLayout = ({ themeContext }) => {
  const [isDarkMode, setIsDarkMode, language, setLanguage] = themeContext;
  const location = useLocation();
  const navigate = useNavigate();
  const t = translations[language] || translations.English;
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: <LayoutGrid className="h-4 w-4" />, desc: 'View your health summary and stats' },
    { name: 'AI Doctor Chat', path: '/ai-doctor', icon: <MessageSquare className="h-4 w-4" />, desc: 'Consult with our advanced AI medical assistant' },
    { name: 'Disease Diagnosis', path: '/diagnose', icon: <Users className="h-4 w-4" />, desc: 'Run medical diagnostic analysis' },
    { name: 'Settings & Profile', path: '/settings', icon: <Settings className="h-4 w-4" />, desc: 'Manage your account and preferences' },
    { name: 'About MediScan AI', path: '/about', icon: <Info className="h-4 w-4" />, desc: 'Learn more about our mission and technology' },
    { name: 'Contact Support', path: '/contact', icon: <MessageCircle className="h-4 w-4" />, desc: 'Get in touch with our team' },
  ];

  const timelineData = JSON.parse(localStorage.getItem('timelineData')) || [];
  
  const searchResults = searchQuery ? [
    ...features.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())),
    ...timelineData
      .filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(item => ({
        name: item.title,
        path: `/dashboard#event-${item.id}`,
        icon: <Clock className="h-4 w-4" />,
        desc: `Timeline event from ${item.date}`
      }))
  ] : [];

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Welcome to MEDISCAN AI!', time: 'Just now', unread: true },
      { id: 2, text: 'Clinical data synchronized', time: '2 hours ago', unread: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const handleNewNotification = (e) => {
      const newNotif = {
        id: Date.now(),
        text: e.detail?.message || 'New update available',
        time: 'Just now',
        unread: true
      };
      setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    };

    const handleProfileUpdate = () => {
      setNotifications(prev => {
        // Prevent duplicate spam within 5 seconds
        if (prev.length > 0 && prev[0].text === 'Medical profile updated with new data.' && Date.now() - prev[0].id < 5000) {
          return prev;
        }
        const newNotif = {
          id: Date.now(),
          text: 'Medical profile updated with new data.',
          time: 'Just now',
          unread: true
        };
        const updated = [newNotif, ...prev];
        return updated.slice(0, 50);
      });
    };

    const handleTimelineUpdate = () => {
      setNotifications(prev => {
        if (prev.length > 0 && prev[0].text === 'New event added to your health timeline.' && Date.now() - prev[0].id < 5000) {
          return prev;
        }
        const newNotif = {
          id: Date.now(),
          text: 'New event added to your health timeline.',
          time: 'Just now',
          unread: true
        };
        const updated = [newNotif, ...prev];
        return updated.slice(0, 50); // Keep only the latest 50 notifications
      });
    };

    window.addEventListener('new-notification', handleNewNotification);
    window.addEventListener('profile-updated', handleProfileUpdate);
    window.addEventListener('timeline-updated', handleTimelineUpdate);
    return () => {
      window.removeEventListener('new-notification', handleNewNotification);
      window.removeEventListener('profile-updated', handleProfileUpdate);
      window.removeEventListener('timeline-updated', handleTimelineUpdate);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowNotifications(false);
    setShowSearchResults(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((notification) => (
      notification.id === id ? { ...notification, unread: false } : notification
    )));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('patientData');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'kanka das' };
  const patientData = JSON.parse(localStorage.getItem('patientData'));
  const displayName = patientData?.name || user?.name || 'kanka das';

  const getAvatar = () => {
    const gender = patientData?.gender?.toLowerCase();
    if (gender === 'male' || gender === 'm') {
      return '/src/assets/avatar_male.png';
    }
    return '/src/assets/avatar_female.png';
  };

  const themeClasses = {
    body: isDarkMode ? 'bg-[#0b1437]' : 'bg-[#F4F7FE]',
    header: isDarkMode ? 'bg-[#0b1437]/80 border-b border-white/5 backdrop-blur-xl' : 'bg-transparent',
    title: isDarkMode ? 'text-white' : 'text-[#2B3674]',
    search: isDarkMode ? 'bg-[#111c44] text-white border-white/10' : 'bg-white text-[#2B3674] border-slate-100',
    dropdown: isDarkMode ? 'glass-dark border-white/10 text-white' : 'bg-white border-gray-100 text-gray-800',
    shellCard: isDarkMode ? 'bg-[#111c44]/60 border-white/10 shadow-2xl shadow-black/20' : 'bg-white/70 border-white shadow-sm',
  };

  const routeTitles = {
    '/dashboard': t.overviewTitle,
    '/ai-doctor': t.aiDoctorTitle,
    '/diagnose': 'Disease Diagnosis',
    '/settings': t.settingsTitle,
    '/about': t.aboutTitle,
    '/contact': t.contactTitle,
    '/results': 'Diagnosis Results',
  };

  const pageTitle = routeTitles[location.pathname] || t.overviewTitle;

  const navSections = [
    {
      title: t.general || 'Navigation',
      items: [
        { icon: LayoutGrid, path: '/dashboard', label: t.navHome },
        { icon: Stethoscope, path: '/diagnose', label: t.navDiagnose },
        { icon: MessageSquare, path: '/ai-doctor', label: t.navAiDoctor },
      ],
    },
    {
      title: t.profile || 'Profile',
      items: [
        { icon: User, path: '/settings', label: t.profile },
        { icon: Settings, path: '/settings', label: t.settings },
      ],
    },
    {
      title: t.contactTitle || 'Support',
      items: [
        { icon: Info, path: '/about', label: t.about },
        { icon: MessageCircle, path: '/contact', label: t.contact },
      ],
    },
  ];

  const sidebarContent = (
    <>
      <div className="mb-8 flex items-center justify-between px-6 text-[#5E5CE6] sm:mb-12 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
            <div className="h-4 w-4 rounded-full border-2 border-white"></div>
          </div>
          <span className="text-lg font-black tracking-tight">MEDISCAN AI</span>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="rounded-2xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800/40 dark:hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto pb-4">
        {navSections.map((section) => (
          <div key={section.title} className="mt-8 first:mt-0">
            <div className="mb-3 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 sm:px-8">
              {section.title}
            </div>
            {section.items.map((item) => (
              <SidebarIcon
                key={item.label}
                icon={item.icon}
                path={item.path}
                isActive={
                  location.pathname === item.path || 
                  (item.path === '/diagnose' && location.pathname === '/results')
                }
                label={item.label}
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-auto px-4 pt-4 sm:px-6">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-4 rounded-2xl p-4 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          <span className="text-sm font-black tracking-wide">{t.logoutSystem}</span>
        </button>
      </div>
    </>
  );

  return (
    <div className={`flex min-h-screen overflow-hidden font-sans transition-colors duration-500 lg:h-screen ${themeClasses.body}`}>
      <aside className={`hidden w-72 flex-none flex-col py-8 transition-all duration-500 lg:flex ${isDarkMode ? 'bg-[#0b1437]/50 border-r border-white/5 backdrop-blur-xl' : 'border-r border-slate-100 bg-white shadow-xl shadow-slate-200/20'}`}>
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className={`relative flex h-full w-[min(20rem,86vw)] flex-col py-6 shadow-2xl ${isDarkMode ? 'bg-[#111c44]' : 'bg-white'}`}
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <header className={`relative z-30 flex flex-none flex-col gap-4 px-4 py-4 transition-colors sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 ${themeClasses.header}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-2xl border border-white/60 bg-white/70 p-2.5 text-slate-500 shadow-sm transition-colors hover:text-[#5E5CE6] dark:border-gray-700 dark:bg-[#111c44]/80 dark:text-slate-300 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <h1 className={`truncate text-2xl font-black tracking-tight sm:text-3xl ${themeClasses.title}`}>
                  {pageTitle}
                </h1>
              </div>
            </div>
          </div>

          <div className={`relative z-40 flex w-full flex-wrap items-center gap-3 rounded-[1.75rem] border p-2.5 backdrop-blur-xl lg:w-auto lg:justify-end ${themeClasses.shellCard}`}>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`${t.dashboard}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    navigate(searchResults[0].path);
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }
                }}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className={`h-11 w-full rounded-2xl border-none pl-11 pr-4 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 sm:w-64 lg:w-72 ${themeClasses.search}`}
              />

              <AnimatePresence>
                {showSearchResults && searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute left-0 right-0 z-[100] mt-3 overflow-hidden rounded-[1.25rem] border shadow-2xl ${themeClasses.dropdown}`}
                  >
                    <div className="p-2">
                      {searchResults.length > 0 ? (
                        searchResults.map((result, idx) => (
                          <button
                            key={`${result.name}-${idx}`}
                            onClick={() => {
                              navigate(result.path);
                              setSearchQuery('');
                              setShowSearchResults(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          >
                            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500">
                              {result.icon}
                            </div>
                            <div>
                              <p className="text-sm font-bold">{result.name}</p>
                              <p className="text-[10px] font-medium text-slate-400">{result.desc}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
                          {t.noResultsFound}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-2xl p-2.5 text-slate-400 transition-colors hover:text-[#5E5CE6]"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative rounded-2xl p-2.5 text-slate-400 transition-colors hover:text-[#5E5CE6]"
                  aria-label="Open notifications"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.some((notification) => notification.unread) && (
                    <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute right-0 z-[100] mt-4 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border shadow-2xl sm:w-80 ${themeClasses.dropdown}`}
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-700/50">
                        <h3 className="font-bold">{t.notifications}</h3>
                        <span className="rounded-full bg-[#5E5CE6] px-2 py-0.5 text-[10px] text-white">
                          {notifications.filter((notification) => notification.unread).length} {t.newAnalysis || 'NEW'}
                        </span>
                      </div>

                      <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => markAsRead(notification.id)}
                              className={`relative cursor-pointer border-b border-gray-50 p-4 transition-colors last:border-0 hover:bg-slate-50 dark:border-gray-700/30 dark:hover:bg-slate-800/50 ${notification.unread ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''}`}
                            >
                              {notification.unread && (
                                <div className="absolute left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-indigo-500"></div>
                              )}
                              <p className={`mb-1 text-sm font-medium ${notification.unread ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                                {notification.text}
                              </p>
                              <p className="text-[10px] font-bold uppercase text-slate-400">{notification.time}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-10 text-center text-slate-400">
                            <p className="text-xs font-bold uppercase tracking-widest">{t.notifications}</p>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-50 p-3 text-center dark:border-gray-700/30">
                        <button
                          onClick={clearNotifications}
                          className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline"
                        >
                          {t.clearAll || 'Clear All'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2 border-l border-slate-200/70 pl-3 dark:border-gray-700/60 sm:gap-3 sm:pl-4">
                <div className="hidden text-right sm:block">
                  <p className={`text-sm font-black leading-tight ${themeClasses.title}`}>{displayName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.patientLabel}</p>
                </div>
                <img src={getAvatar()} alt="User" className="h-9 w-9 rounded-full border-2 border-white bg-slate-50 object-cover shadow-sm sm:h-10 sm:w-10" />
              </div>
            </div>
          </div>
        </header>

        <main
          id="main-content"
          className="relative flex-1 overflow-y-auto px-4 pb-6 pt-2 scroll-smooth sm:px-6 sm:pb-8 lg:px-8 lg:pt-4"
          onScroll={(e) => {
            const button = document.getElementById('scroll-to-top');
            if (button) {
              if (e.target.scrollTop > 300) {
                button.style.opacity = '1';
                button.style.pointerEvents = 'auto';
                button.style.transform = 'translateY(0)';
              } else {
                button.style.opacity = '0';
                button.style.pointerEvents = 'none';
                button.style.transform = 'translateY(20px)';
              }
            }
          }}
        >
          <Outlet context={[isDarkMode, setIsDarkMode, language, setLanguage]} />

          <button
            id="scroll-to-top"
            onClick={() => document.getElementById('main-content').scrollTo({ top: 0, behavior: 'smooth' })}
            className="group fixed bottom-4 right-4 z-40 translate-y-5 rounded-2xl bg-indigo-600 p-3 text-white opacity-0 shadow-2xl shadow-indigo-500/40 transition-all duration-300 pointer-events-none hover:scale-110 active:scale-95 sm:bottom-6 sm:right-6 sm:p-4 lg:bottom-8 lg:right-8"
            style={{ transitionProperty: 'opacity, transform, background-color, scale' }}
          >
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <svg
              className="relative z-10 h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
