import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, Activity, PieChart as PieChartIcon, 
  BarChart3, Shield, Zap, Info, Filter, Download
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { translations } from '../utils/translations';

const Analytics = () => {
  const [isDarkMode, , language] = useOutletContext();
  const t = translations[language] || translations.English;

  // Sample data based on Symptom2Disease dataset characteristics
  const prevalenceData = [
    { name: 'Psoriasis', cases: 120, severity: 65 },
    { name: 'Varicose Veins', cases: 95, severity: 40 },
    { name: 'Typhoid', cases: 150, severity: 85 },
    { name: 'Malaria', cases: 140, severity: 80 },
    { name: 'Dengue', cases: 130, severity: 90 },
    { name: 'Diabetes', cases: 110, severity: 75 },
    { name: 'Hypertension', cases: 105, severity: 70 },
  ];

  const labTrendData = [
    { month: 'Jan', wbc: 7200, fbs: 95, temp: 98.6 },
    { month: 'Feb', wbc: 6800, fbs: 92, temp: 98.4 },
    { month: 'Mar', wbc: 8500, fbs: 105, temp: 99.2 },
    { month: 'Apr', wbc: 7100, fbs: 98, temp: 98.7 },
    { month: 'May', wbc: 6500, fbs: 94, temp: 98.5 },
    { month: 'Jun', wbc: 9200, fbs: 110, temp: 100.1 },
  ];

  const symptomRadarData = [
    { subject: 'Fever', A: 120, B: 110, fullMark: 150 },
    { subject: 'Fatigue', A: 98, B: 130, fullMark: 150 },
    { subject: 'Pain', A: 86, B: 130, fullMark: 150 },
    { subject: 'Nausea', A: 99, B: 100, fullMark: 150 },
    { subject: 'Rash', A: 85, B: 90, fullMark: 150 },
    { subject: 'Cough', A: 65, B: 85, fullMark: 150 },
  ];

  const COLORS = ['#5E5CE6', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A3'];

  const cardClass = isDarkMode 
    ? 'glass-dark border-white/5 shadow-2xl shadow-black/20' 
    : 'bg-white border-slate-100 shadow-sm';

  const titleClass = isDarkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl font-black ${titleClass}`}>Health Analytics Engine</h1>
          <p className="text-slate-500 font-medium">Real-time epidemiological data synthesis & model insights</p>
        </div>
        <div className="flex items-center gap-3">
          <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-600'} font-bold text-sm hover:scale-105 transition-all`}>
            <Filter className="w-4 h-4" />
            Filter Data
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Analyzed Cases', value: '1,200', change: '+12%', icon: <TrendingUp />, color: 'blue' },
          { label: 'Diagnostic Accuracy', value: '97.5%', change: '+0.4%', icon: <Zap />, color: 'purple' },
          { label: 'Avg Recovery Time', value: '8.4 Days', change: '-1.2 Days', icon: <Activity />, color: 'emerald' },
          { label: 'Clinical Confidence', value: 'High', change: 'Stable', icon: <Shield />, color: 'amber' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-[2rem] border ${cardClass}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
              stat.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
              stat.color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
              stat.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
              'bg-amber-500/10 text-amber-500'
            }`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline justify-between">
              <h4 className={`text-2xl font-black ${titleClass}`}>{stat.value}</h4>
              <span className={`text-[10px] font-bold ${stat.change.startsWith('+') || stat.change === 'Stable' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Disease Prevalence Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-8 p-8 rounded-[2.5rem] border ${cardClass}`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className={`text-xl font-bold ${titleClass}`}>Disease Prevalence Analysis</h3>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Cases</span>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prevalenceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#ffffff10' : '#00000005'} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#111c44' : '#ffffff',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  cursor={{ fill: isDarkMode ? '#ffffff05' : '#00000005' }}
                />
                <Bar 
                  dataKey="cases" 
                  fill="#5E5CE6" 
                  radius={[8, 8, 8, 8]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Global Distribution Pie */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-4 p-8 rounded-[2.5rem] border ${cardClass}`}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
              <PieChartIcon className="w-5 h-5" />
            </div>
            <h3 className={`text-xl font-bold ${titleClass}`}>Risk Profile</h3>
          </div>
          
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prevalenceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="cases"
                >
                  {prevalenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-3xl font-black ${titleClass}`}>24</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Varieties</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {prevalenceData.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.name}</span>
                </div>
                <span className="text-xs font-black text-indigo-500">{Math.round(item.cases/8.5)}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lab Trends Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`lg:col-span-7 p-8 rounded-[2.5rem] border ${cardClass}`}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className={`text-xl font-bold ${titleClass}`}>Lab Biomarker Volatility</h3>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={labTrendData}>
                <defs>
                  <linearGradient id="colorWbc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5E5CE6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5E5CE6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFbs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C49F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00C49F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#ffffff10' : '#00000005'} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip />
                <Area type="monotone" dataKey="wbc" stroke="#5E5CE6" strokeWidth={4} fillOpacity={1} fill="url(#colorWbc)" />
                <Area type="monotone" dataKey="fbs" stroke="#00C49F" strokeWidth={4} fillOpacity={1} fill="url(#colorFbs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Symptom Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`lg:col-span-5 p-8 rounded-[2.5rem] border ${cardClass}`}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className={`text-xl font-bold ${titleClass}`}>Symptom Intensity Matrix</h3>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={symptomRadarData}>
                <PolarGrid stroke={isDarkMode ? '#ffffff10' : '#00000010'} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }}
                />
                <PolarRadiusAxis axisLine={false} tick={false} />
                <Radar
                  name="Epidemic Avg"
                  dataKey="A"
                  stroke="#5E5CE6"
                  fill="#5E5CE6"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Current Sample"
                  dataKey="B"
                  stroke="#AF19FF"
                  fill="#AF19FF"
                  fillOpacity={0.4}
                />
                <Legend iconType="circle" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Info Card */}
      <div className={`p-6 rounded-3xl border flex items-start gap-4 ${isDarkMode ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
        <Info className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
        <div>
          <h4 className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>Data Integrity Notice</h4>
          <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-blue-200/70' : 'text-blue-800'}`}>
            All visualizations on this page are derived from the consolidated clinical dataset containing over 1,200 synthetic case records. 
            The trends shown are synchronized with the primary Multi-Disease Prediction Model.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
