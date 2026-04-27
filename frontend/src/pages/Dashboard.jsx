import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Edit2, Plus, Clock, FileText, 
  ChevronRight, Phone, Mail, MapPin, 
  Calendar, Activity, Heart, Scale, Ruler 
} from 'lucide-react';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import EditPatientModal from '../components/EditPatientModal';
import TimelineModal from '../components/TimelineModal';
import TimelineDetailModal from '../components/TimelineDetailModal';

import { translations } from '../utils/translations';
import { getPatientDetails } from '../api/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, , language] = useOutletContext();
  const t = translations[language] || translations.English;
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const toggleEditModal = () => setIsEditModalOpen(!isEditModalOpen);

  const [isTimelineModalOpen, setIsTimelineModalOpen] = React.useState(false);
  const [timelineItems, setTimelineItems] = React.useState(() => 
    JSON.parse(localStorage.getItem('timelineData')) || []
  );
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);

  React.useEffect(() => {
    const handleUpdate = () => {
      setTimelineItems(JSON.parse(localStorage.getItem('timelineData')) || []);
    };
    const handleProfileRefresh = async () => {
      try {
        const data = await getPatientDetails();
        setPatientDataState(data || {});
      } catch (error) {
        console.error("Error refreshing patient data", error);
        // Fallback to localStorage if server fetch fails
        setPatientDataState(JSON.parse(localStorage.getItem('patientData')) || {});
      }
    };
    window.addEventListener('timeline-updated', handleUpdate);
    window.addEventListener('profile-updated', handleProfileRefresh);
    
    // Handle scrolling to event if hash exists
    if (location.hash.startsWith('#event-')) {
      const id = location.hash.replace('#event-', '');
      setTimeout(() => {
        const element = document.getElementById(`event-${id}`);
        const event = timelineItems.find(t => String(t.id) === id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-4', 'rounded-xl', 'animate-pulse');
          
          if (event) {
            setSelectedEvent(event);
            setIsDetailModalOpen(true);
          }

          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-4', 'animate-pulse');
          }, 3000);
        }
      }, 500);
    }

    return () => {
      window.removeEventListener('timeline-updated', handleUpdate);
      window.removeEventListener('profile-updated', handleProfileRefresh);
    };
  }, [location, timelineItems]);

  const handleAddTimeline = (newItem) => {
    const updated = [newItem, ...timelineItems];
    setTimelineItems(updated);
    localStorage.setItem('timelineData', JSON.stringify(updated));
  };
  
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'kanka das' };
  const [patientDataState, setPatientDataState] = React.useState(() => 
    JSON.parse(localStorage.getItem('patientData')) || {}
  );

  const handleProfileUpdate = () => {
    const updatedData = JSON.parse(localStorage.getItem('patientData'));
    setPatientDataState(updatedData || {});
  };

  const getAvatar = () => {
    const gender = patientDataState.gender?.toLowerCase();
    if (gender === 'male' || gender === 'm') {
      return '/src/assets/avatar_male.png';
    }
    return '/src/assets/avatar_female.png';
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPatientDetails();
        setPatientDataState(data || {});
      } catch (error) {
        console.error("Error fetching patient data", error);
      }
    };
    fetchData();
  }, []);


  const stats = [
    { label: t.bmi || 'BMI', value: patientDataState.bmi || '--', icon: <Activity className="w-4 h-4" /> },
    { label: t.weight || 'WEIGHT', value: patientDataState.weight ? `${patientDataState.weight} kg` : '--', icon: <Scale className="w-4 h-4" /> },
    { label: t.height || 'HEIGHT', value: patientDataState.height ? `${patientDataState.height} cm` : '--', icon: <Ruler className="w-4 h-4" /> },
    { label: t.bloodPressure || 'BLOOD BP', value: patientDataState.blood_pressure || '--', icon: <Heart className="w-4 h-4" /> },
  ];


  const historyItems = [
    { title: t.chronic_disease || 'CHRONIC DISEASE', value: patientDataState.chronic_disease || 'N/A' },
    { title: t.diabetes_emergencies || 'DIABETES EMERGENCIES', value: patientDataState.diabetes_emergencies || 'N/A' },
    { title: t.surgery || 'SURGERY', value: patientDataState.surgery || 'N/A' },
    { title: t.family_disease || 'FAMILY DISEASE', value: patientDataState.family_disease || 'N/A' },
    { title: t.diabetes_related_complication || 'DIABETES RELATED COMPLICATION', value: patientDataState.diabetes_related_complication || 'N/A' },
  ];

  const cardClass = isDarkMode 
    ? 'glass-dark border-white/5 shadow-2xl shadow-black/20' 
    : 'bg-white border-slate-100 shadow-sm';

  return (
    <div className="space-y-6 pb-10">
      {/* Profile Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 rounded-[2rem] border ${cardClass} relative overflow-hidden`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 relative z-10">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-100">
              <img 
                src={getAvatar()} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 flex gap-1">
              <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[10px] font-bold">A</div>
              <div className="w-6 h-6 rounded-full bg-rose-400 border-2 border-white flex items-center justify-center text-[10px] font-bold">S</div>
            </div>
          </div>

          {/* User Info Section */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {patientDataState.name || user.name}

              </h1>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {patientDataState.phone || 'No phone'}
                </div>
                <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {patientDataState.email || user.email}
                </div>
              </div>

            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { icon: <User className="w-3.5 h-3.5" />, label: patientDataState.gender || 'Not provided' },
                { icon: <MapPin className="w-3.5 h-3.5" />, label: patientDataState.location || 'Not provided' },
                { icon: <Calendar className="w-3.5 h-3.5" />, label: patientDataState.job || 'Not provided' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-400 text-xs font-bold border border-slate-100">
                  {item.icon}
                  {item.label}
                </div>
              ))}

            </div>

            <div className="flex flex-wrap gap-8 pt-4">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Button */}
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-8 py-4 bg-[#5E5CE6] hover:bg-[#4B49C2] text-white rounded-2xl font-bold flex items-center gap-3 transition-all shadow-lg shadow-indigo-200 self-center lg:self-start"
          >
            <Edit2 className="w-4 h-4" />
            {t.editProfile}
          </button>


        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Timeline Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`lg:col-span-2 p-6 rounded-[2rem] border ${cardClass} flex flex-col min-h-[400px]`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.timeline}</h3>
            </div>
            <button 
              onClick={() => setIsTimelineModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-indigo-600 text-xs font-bold border border-slate-100 hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-3 h-3" />
              {t.add}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {timelineItems.length > 0 ? (
              timelineItems.map((item, i) => (
                <div 
                  key={item.id || i} 
                  id={`event-${item.id}`}
                  onClick={() => {
                    setSelectedEvent(item);
                    setIsDetailModalOpen(true);
                  }}
                  className="group relative pl-8 pb-4 last:pb-0 transition-all duration-500 cursor-pointer hover:translate-x-1"
                >
                  <div className="absolute left-[11px] top-2 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                  <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-[#111c44] border-2 border-indigo-500 flex items-center justify-center z-10 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                      <span className="text-[10px] font-black text-slate-400 uppercase">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                    <div className="mt-2 text-[9px] font-bold text-indigo-500/70 uppercase tracking-widest">{item.date}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-40">
                <p className="italic text-slate-500 font-medium text-sm">{t.noHistory}</p>
              </div>
            )}
          </div>

        </motion.div>

        {/* Medical History Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`lg:col-span-3 p-6 rounded-[2rem] border ${cardClass}`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.medicalHistory}</h3>
            </div>
            <button 
              onClick={toggleEditModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-indigo-600 text-xs font-bold border border-slate-100 hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-3 h-3" />
              {t.update}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {historyItems.map((item, i) => (
              <div 
                key={i}
                className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50/50 border-slate-100'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.title}</span>
                </div>
                <p className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <EditPatientModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        patientData={patientDataState} 
        onUpdate={handleProfileUpdate} 
      />
      <TimelineModal 
        isOpen={isTimelineModalOpen} 
        onClose={() => setIsTimelineModalOpen(false)} 
        onAdd={handleAddTimeline} 
      />
      <TimelineDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        event={selectedEvent}
        language={language}
      />

    </div>
  );
};


export default Dashboard;
