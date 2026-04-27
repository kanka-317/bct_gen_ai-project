import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, Moon, Sun, Bell, Shield, 
  User, Globe, Mail, Smartphone, Lock, Trash2, 
  Database, ChevronRight, HelpCircle, LogOut, Check, Activity
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { translations } from '../utils/translations';
import EditPatientModal from '../components/EditPatientModal';

const Settings = () => {
  const [isDarkMode, setIsDarkMode, language, setLanguage] = useOutletContext();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [patientDataState, setPatientDataState] = React.useState(() => 
    JSON.parse(localStorage.getItem('patientData')) || { name: 'Patient' }
  );
  const t = translations[language] || translations.English;
  
  // Settings States with Persistence
  const [emailNotifs, setEmailNotifs] = React.useState(() => localStorage.getItem('settings_email') !== 'false');
  const [desktopAlerts, setDesktopAlerts] = React.useState(() => localStorage.getItem('settings_desktop') !== 'false');
  const [twoFactor, setTwoFactor] = React.useState(() => localStorage.getItem('settings_2fa') === 'true');
  const [dataSharing, setDataSharing] = React.useState(() => localStorage.getItem('settings_sharing') === 'true');
  const [activeTab, setActiveTab] = React.useState('general');

  // Load User Info
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Patient', email: 'user@example.com' };

  const handleProfileUpdate = () => {
    const updatedData = JSON.parse(localStorage.getItem('patientData'));
    setPatientDataState(updatedData);
    // Force a reload of Dashboard if needed, but here state update is enough for this page
  };


  // Update Persistence
  React.useEffect(() => {
    localStorage.setItem('settings_email', emailNotifs);
    localStorage.setItem('settings_desktop', desktopAlerts);
    localStorage.setItem('settings_2fa', twoFactor);
    localStorage.setItem('settings_sharing', dataSharing);
  }, [emailNotifs, desktopAlerts, twoFactor, dataSharing]);

  const handleClearCache = () => {
    if (window.confirm('Clear all local data?')) {
      const auth = localStorage.getItem('user');
      localStorage.clear();
      if (auth) localStorage.setItem('user', auth);
      window.location.reload();
    }
  };

  const handleClearMedicalData = () => {
    if (window.confirm('Are you sure you want to clear all medical history? This will delete all clinical records, diagnosis results, and timeline events while keeping your account active.')) {
      localStorage.removeItem('patientData');
      localStorage.removeItem('timelineData');
      localStorage.removeItem('diagnosisResults');
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'account', label: 'Account', icon: User },
  ];

  const languages = [
    { code: 'English', flag: '🇺🇸' },
    { code: 'French', flag: '🇫🇷' },
    { code: 'Spanish', flag: '🇪🇸' },
    { code: 'German', flag: '🇩🇪' },
    { code: 'Hindi', flag: '🇮🇳' },
  ];

  const Toggle = ({ value, onChange }) => (
    <button 
      onClick={onChange}
      type="button"
      className={`w-12 h-6 rounded-full transition-all relative duration-300 ${
        value ? 'bg-indigo-600 shadow-inner' : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-lg ${
        value ? 'translate-x-6' : 'translate-x-0'
      }`} />
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Premium Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 rounded-[2rem] border overflow-hidden relative ${
          isDarkMode ? 'bg-[#111c44] border-slate-700/50' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-3xl text-white font-black shadow-2xl shadow-indigo-200">
            {(patientDataState?.name || user?.name || 'P').charAt(0).toUpperCase()}

          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {patientDataState?.name || user?.name}

            </h1>
            <p className={`text-sm font-medium mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {user?.email || 'patient@mediscan.ai'} • MediScan ID: #82910
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-wider">Clinical User</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider">Verified Profile</span>
            </div>
          </div>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${
            isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
          }`}>
            Edit Profile
          </button>

        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : `${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {activeTab === tab.id && <motion.div layoutId="activeTab" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`p-8 rounded-[2rem] border min-h-[400px] ${
                isDarkMode ? 'bg-[#111c44] border-slate-700/50' : 'bg-white border-slate-100 shadow-sm'
              }`}
            >
              {activeTab === 'general' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Globe className="w-6 h-6 text-indigo-500" />
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.appearance}</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-500/5">
                      <div>
                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.darkMode}</p>
                        <p className="text-xs text-slate-500">{t.darkModeDesc}</p>
                      </div>
                      <Toggle value={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
                    </div>

                    <div className="space-y-4">
                      <p className={`font-bold text-sm uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.interfaceLang}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                              language === lang.code
                                ? 'border-indigo-600 bg-indigo-500/5 text-indigo-600'
                                : `${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-600 hover:border-indigo-200'}`
                            }`}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="font-bold text-sm">{lang.code}</span>
                            {language === lang.code && <Check className="ml-auto w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-6 h-6 text-blue-500" />
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.notifications}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-500/5">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Mail className="w-5 h-5" /></div>
                        <div>
                          <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.emailNotifs}</p>
                          <p className="text-xs text-slate-500">{t.emailNotifsDesc}</p>
                        </div>
                      </div>
                      <Toggle value={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-500/5">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><Smartphone className="w-5 h-5" /></div>
                        <div>
                          <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.desktopAlerts}</p>
                          <p className="text-xs text-slate-500">{t.desktopAlertsDesc}</p>
                        </div>
                      </div>
                      <Toggle value={desktopAlerts} onChange={() => setDesktopAlerts(!desktopAlerts)} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-emerald-500" />
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.privacy}</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-500/5">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><Lock className="w-5 h-5" /></div>
                        <div>
                          <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.tfa}</p>
                          <p className="text-xs text-slate-500">{t.tfaDesc}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setTwoFactor(!twoFactor)}
                        className={`px-4 py-2 rounded-xl text-xs font-black text-white transition-all ${
                        twoFactor ? 'bg-red-500' : 'bg-emerald-600'
                      }`}>
                        {twoFactor ? t.disable : t.enable}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-500/5">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><Database className="w-5 h-5" /></div>
                        <div>
                          <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.sharing}</p>
                          <p className="text-xs text-slate-500">{t.sharingDesc}</p>
                        </div>
                      </div>
                      <Toggle value={dataSharing} onChange={() => setDataSharing(!dataSharing)} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-purple-500" />
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.accountActions}</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Data Management */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className={`flex flex-col items-start p-6 rounded-[2rem] border transition-all text-left group ${
                        isDarkMode ? 'bg-[#111c44] border-slate-700/50 hover:bg-slate-800' : 'bg-white border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50'
                      }`}>
                        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 mb-4 group-hover:scale-110 transition-transform">
                          <Activity className="w-6 h-6" />
                        </div>
                        <h4 className={`text-lg font-black mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Export Medical Data</h4>
                        <p className="text-sm text-slate-500 mb-4">Download a comprehensive PDF of all your clinical records and AI diagnoses.</p>
                        <div className="mt-auto flex items-center gap-2 text-indigo-500 font-black text-xs uppercase tracking-widest">
                          Download PDF <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>

                      <button className={`flex flex-col items-start p-6 rounded-[2rem] border transition-all text-left group ${
                        isDarkMode ? 'bg-[#111c44] border-slate-700/50 hover:bg-slate-800' : 'bg-white border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50'
                      }`}>
                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 mb-4 group-hover:scale-110 transition-transform">
                          <Shield className="w-6 h-6" />
                        </div>
                        <h4 className={`text-lg font-black mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Privacy Settings</h4>
                        <p className="text-sm text-slate-500 mb-4">Manage how your medical data is used for AI model training and research.</p>
                        <div className="mt-auto flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-widest">
                          Configure <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>
                    </div>

                    {/* Cache Management */}
                    <button 
                      onClick={handleClearCache}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                        isDarkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className="p-2 rounded-xl bg-slate-500/10 text-slate-500"><Trash2 className="w-5 h-5" /></div>
                        <div>
                          <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.clearCache}</p>
                          <p className="text-xs text-slate-500">{t.clearCacheDesc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>

                    {/* Danger Zone */}
                    <div className={`p-6 rounded-[2rem] border ${isDarkMode ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50/50 border-red-100'}`}>
                      <h4 className="text-red-500 font-black text-sm uppercase tracking-widest mb-4">Danger Zone</h4>
                      <div className="space-y-3">
                        <button className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                          isDarkMode ? 'hover:bg-red-500/10' : 'hover:bg-white bg-white/40'
                        }`}>
                          <div className="flex items-center gap-4 text-left">
                            <div className="p-2 rounded-xl bg-red-500/10 text-red-500"><Trash2 className="w-5 h-5" /></div>
                            <div>
                              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Deactivate Account</p>
                              <p className="text-xs text-slate-500">Temporarily hide your profile and clinical data.</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </button>

                        <button 
                          onClick={handleClearMedicalData}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                          isDarkMode ? 'hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20' : 'hover:bg-white bg-white/40 border border-transparent hover:border-amber-100'
                        }`}>
                          <div className="flex items-center gap-4 text-left">
                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500"><Database className="w-5 h-5" /></div>
                            <div>
                              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.clearMedicalData}</p>
                              <p className="text-xs text-slate-500">{t.clearMedicalDataDesc}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </button>

                        <button className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200/50`}>
                          <div className="flex items-center gap-4 text-left">
                            <div className="p-2 rounded-xl bg-white/20"><Trash2 className="w-5 h-5 text-white" /></div>
                            <div>
                              <p className="font-bold">Permanently Delete Account</p>
                              <p className="text-xs text-red-100">This action is irreversible. All medical history will be lost.</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/50" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <div className="flex items-center gap-2"><HelpCircle className="w-3 h-3" /> Support</div>
            <div className="flex items-center gap-2"><Shield className="w-3 h-3" /> Privacy Policy</div>
            <div>Terms of Service</div>
          </div>
        </div>
      </div>
      <EditPatientModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        patientData={patientDataState} 
        onUpdate={handleProfileUpdate} 
      />
    </div>
  );
};

export default Settings;
