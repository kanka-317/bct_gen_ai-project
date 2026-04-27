import React from 'react';
import { Info, Target, Cpu, Shield, Activity, Users, ArrowRight, MessageSquare, X, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { translations } from '../utils/translations';

const About = () => {
  const navigate = useNavigate();
  const context = useOutletContext();
  const [isDarkMode, , language] = context || [false, null, 'English'];
  const t = translations[language] || translations.English;
  const [showChoiceModal, setShowChoiceModal] = React.useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const features = [
    {
      icon: <Activity className="w-6 h-6 text-blue-500" />,
      title: "Smart Diagnostics",
      description: "Utilizing advanced Random Forest algorithms trained on extensive medical datasets for high-precision disease prediction."
    },
    {
      icon: <Cpu className="w-6 h-6 text-purple-500" />,
      title: "AI Medical Reasoning",
      description: "Powered by Google Gemini Pro, providing nuanced clinical explanations and personalized health insights."
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-500" />,
      title: "Secure & Confidential",
      description: "Your medical data is processed with enterprise-grade security and strict privacy protocols."
    }
  ];

  const stats = [
    { label: "AI Models", value: "3+" },
    { label: "Accuracy", value: "98%" },
    { label: "Analysis Speed", value: "< 2s" },
    { label: "Global Reach", value: "24/7" }
  ];

  const user = JSON.parse(localStorage.getItem('user'));
  const patientData = JSON.parse(localStorage.getItem('patientData'));

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* User Status Card (If Logged In) */}
      {user && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-2xl border-2 border-dashed flex flex-col md:flex-row items-center justify-between gap-6 ${
            isDarkMode ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black">
              {user.name[0]}
            </div>
            <div>
              <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Welcome, {user.name}!</h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Logged in as {user.email}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className={`px-4 py-2 rounded-xl text-center ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
              <div className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Last Profile Update</div>
              <div className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{patientData ? 'Verified' : 'Incomplete'}</div>
            </div>
            <div className={`px-4 py-2 rounded-xl text-center ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
              <div className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Account Status</div>
              <div className="text-sm font-bold text-emerald-500">Active</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 md:p-12 rounded-3xl relative overflow-hidden ${isDarkMode ? 'glass-dark' : 'glass'}`}
      >
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-bold tracking-wide uppercase">
              <Info className="w-4 h-4" />
              {t.mission}
            </div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Revolutionizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Healthcare</span> with Intelligence
            </h1>
            <p className={`text-lg md:text-xl leading-relaxed max-w-2xl ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {t.heroSubtitle}
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChoiceModal(true)}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center gap-2 mx-auto md:mx-0"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
          
          <div className="flex-none hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse-soft blur-2xl"></div>
              <Activity className="w-48 h-48 text-blue-500 animate-float" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Core Values Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {features.map((feature, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            className={`p-8 rounded-2xl border transition-all hover:scale-[1.02] ${
              isDarkMode ? 'glass-dark border-slate-700/50' : 'glass border-slate-200'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
              {feature.icon}
            </div>
            <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
            <p className={`leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Clinical Parameters Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Clinical Precision</h2>
          <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Our AI models analyze a wide range of clinical parameters to provide accurate diagnostic insights.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "WBC Count", unit: "cells/mcL", icon: <Activity className="w-5 h-5 text-red-500" /> },
            { label: "Blood Sugar", unit: "mg/dL", icon: <Target className="w-5 h-5 text-amber-500" /> },
            { label: "Systolic BP", unit: "mmHg", icon: <Activity className="w-5 h-5 text-emerald-500" /> },
            { label: "Diastolic BP", unit: "mmHg", icon: <Activity className="w-5 h-5 text-emerald-500" /> },
            { label: "Temperature", unit: "°F", icon: <Activity className="w-5 h-5 text-blue-500" /> },
            { label: "Bilirubin", unit: "mg/dL", icon: <Activity className="w-5 h-5 text-purple-500" /> }
          ].map((param, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border text-center space-y-2 ${isDarkMode ? 'glass-dark border-slate-700/50' : 'glass border-slate-200'}`}>
              <div className="flex justify-center">{param.icon}</div>
              <div className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{param.label}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{param.unit}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Technology Stack Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`p-8 rounded-3xl ${isDarkMode ? 'glass-dark' : 'glass'}`}
        >
          <h2 className={`text-3xl font-black mb-8 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Cpu className="text-blue-500" />
            {t.techFoundation}
          </h2>
          <div className="space-y-6">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <h4 className={`text-md font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Core AI Engine</h4>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Integrated with Google Gemini 2.5 Flash and OpenAI GPT-4o-mini for multimodal report analysis and clinical reasoning.</p>
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <h4 className={`text-md font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Predictive Modeling</h4>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Custom Random Forest classifier trained on verified medical datasets, optimized for multi-disease identification with 98% accuracy.</p>
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <h4 className={`text-md font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Backend Architecture</h4>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>High-performance FastAPI (Python) server with asynchronous request handling and secure JSON-based persistence.</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`p-8 rounded-3xl flex flex-col justify-between ${isDarkMode ? 'bg-indigo-900/40' : 'bg-indigo-600'}`}
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <Users className="text-indigo-300" />
              Advanced Features
            </h2>
            <div className="space-y-4">
              {[
                "Multimodal Analysis (Image/PDF reports)",
                "Instant Prescription Generation",
                "Patient History & Timeline Tracking",
                "Real-time AI Consultation Chat",
                "Secure Patient Profile Management",
                "AI-Powered Lifestyle Guidance"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-indigo-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-300"></div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-xs font-bold text-indigo-200 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Security Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={`p-8 md:p-12 rounded-3xl text-center space-y-6 ${isDarkMode ? 'glass-dark border-emerald-500/20' : 'bg-emerald-50 border border-emerald-100'}`}
      >
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <Shield className="text-white w-8 h-8" />
        </div>
        <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.securityEthics}</h2>
        <p className={`max-w-3xl mx-auto text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          MediScan AI adheres to strict data privacy protocols. Your medical information is never used for training models without explicit consent and is processed using enterprise-grade encryption during transmission.
        </p>
      </motion.div>

      {/* Diagnostic Workflow Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-10"
      >
        <div className="text-center space-y-4">
          <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Intelligent Workflow</h2>
          <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Our platform follows a systematic approach to ensure clinical accuracy and patient safety.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "Input", icon: <Users className="w-6 h-6" />, text: "Patient provides symptoms & lab reports", color: "blue" },
              { step: "Extract", icon: <Activity className="w-6 h-6" />, text: "AI extracts clinical data parameters", color: "indigo" },
              { step: "Predict", icon: <Cpu className="w-6 h-6" />, text: "ML Model identifies potential conditions", color: "purple" },
              { step: "Prescribe", icon: <Target className="w-6 h-6" />, text: "GenAI generates professional guidance", color: "emerald" }
            ].map((node, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'
                } shadow-xl`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${node.color}-500/10 text-${node.color}-500`}>
                    {node.icon}
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{node.step}</h4>
                  <p className={`text-xs px-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{node.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Disease Coverage Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={`p-8 md:p-12 rounded-3xl ${isDarkMode ? 'glass-dark' : 'bg-slate-900 text-white'}`}
      >
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-black">Comprehensive Coverage</h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-300 text-lg'}>
              Our models are continuously expanding to cover a wide spectrum of health conditions, from common infections to chronic metabolic disorders.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Dengue", "Drug Reaction", "Peptic Ulcers", "Allergies", "Metabolic Syndrome", "Infectious Diseases"].map((d, i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold">
                  {d}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-none hidden md:block">
            <div className="w-40 h-40 rounded-full border-8 border-indigo-500/20 flex items-center justify-center">
              <Activity className="w-20 h-20 text-indigo-500" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-center py-10"
      >
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Ready to experience the future of diagnosis?</h2>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowChoiceModal(true)}
          className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-3 mx-auto"
        >
          Start Your Consultation
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Choice Modal */}
      <AnimatePresence>
        {showChoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChoiceModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl ${isDarkMode ? 'bg-[#111c44] border border-slate-700' : 'bg-white'}`}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Select Consultation Type</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Choose how you want to proceed with MediScan AI</p>
                </div>
                <button 
                  onClick={() => setShowChoiceModal(false)}
                  className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Doctor Card */}
                <motion.button
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!user) {
                      navigate('/signup');
                    } else {
                      navigate('/ai-doctor');
                    }
                    setShowChoiceModal(false);
                  }}
                  className={`group p-8 rounded-2xl border-2 transition-all text-left flex flex-col items-center gap-6 ${
                    isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700 hover:border-blue-500 hover:bg-blue-500/5' 
                    : 'bg-white border-slate-100 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-10 h-10" />
                  </div>
                  <div className="text-center">
                    <h4 className={`text-lg font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Consult MediScan Specialist</h4>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Engage in a real-time conversation with our specialized MediScan Specialist for immediate clinical insights.
                    </p>
                  </div>
                  <div className="mt-auto px-6 py-2 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-widest group-hover:bg-blue-700 transition-colors">
                    Start Chat
                  </div>
                </motion.button>

                {/* Patient Diagnosis Card */}
                <motion.button
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!user) {
                      navigate('/signup');
                    } else {
                      navigate('/diagnose');
                    }
                    setShowChoiceModal(false);
                  }}
                  className={`group p-8 rounded-2xl border-2 transition-all text-left flex flex-col items-center gap-6 ${
                    isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/5' 
                    : 'bg-white border-slate-100 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                    <Stethoscope className="w-10 h-10" />
                  </div>
                  <div className="text-center">
                    <h4 className={`text-lg font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Clinical Diagnosis</h4>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Input symptoms and upload lab reports for a high-precision medical assessment by MediScan AI.
                    </p>
                  </div>
                  <div className="mt-auto px-6 py-2 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-widest group-hover:bg-emerald-700 transition-colors">
                    Analyze Now
                  </div>
                </motion.button>
              </div>

              {/* Modal Footer */}
              <div className={`p-4 text-center ${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Secure & Confidential • HIPAA Compliant Environment
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
