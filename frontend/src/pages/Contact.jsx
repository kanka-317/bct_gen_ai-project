import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ExternalLink, User, MessageCircle, ArrowRight } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { translations } from '../utils/translations';

const Contact = () => {
  const context = useOutletContext();
  const [isDarkMode, , language] = context || [false, null, 'English'];
  const t = translations[language] || translations.English;

  const teamMembers = [
    {
      name: "KANKA DAS",
      email: "daskanka20@gmail.com",
      phone: "9007150616",
      linkedin: "https://www.linkedin.com/in/kanka-das-a48295333?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      role: "Lead Developer"
    },
    {
      name: "Jeet Chowdhury",
      email: "chowdhuryjeet724@gmail.com",
      phone: "9088598894",
      linkedin: "https://www.linkedin.com/in/jeet-chowdhury12",
      role: "AI Engineer"
    },
    {
      name: "Kuldip Pal",
      email: "kuldippal102@gmail.com",
      phone: "9002584003",
      linkedin: "https://www.linkedin.com/in/kuldip-pal-009329406",
      role: "Frontend Specialist"
    },
    {
      name: "Sumon Mondal",
      email: "mondalsumon26487@gmail.com",
      phone: "7501786086",
      linkedin: "https://www.linkedin.com/in/sumon-mondal-98810b38b/",
      role: "System Architect"
    }
  ];

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

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 text-sm font-bold tracking-wide uppercase">
          <MessageCircle className="w-4 h-4" />
          {t.contact}
        </div>
        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {t.aboutMediScan} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">{t.meetTeam}</span>
        </h1>
        <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Have questions about MediScan AI? Connect with our specialized team members for support, collaboration, or technical inquiries.
        </p>
      </motion.div>

      {/* Team Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {teamMembers.map((member, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className={`p-8 rounded-3xl border transition-all relative overflow-hidden group ${
              isDarkMode ? 'glass-dark border-slate-700/50 hover:border-indigo-500/50' : 'glass border-slate-200 hover:border-indigo-500/30'
            }`}
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-none ${
                isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
              }`}>
                <User className="w-10 h-10" />
              </div>
              
              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div>
                  <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{member.name}</h3>
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{member.role}</p>
                </div>

                <div className="space-y-3">
                  <a 
                    href={`mailto:${member.email}`}
                    className={`flex items-center justify-center sm:justify-start gap-3 text-sm transition-colors ${
                      isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-indigo-600'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </a>
                  <a 
                    href={`tel:${member.phone}`}
                    className={`flex items-center justify-center sm:justify-start gap-3 text-sm transition-colors ${
                      isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-indigo-600'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    +91 {member.phone}
                  </a>
                  <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center sm:justify-start gap-3 text-sm transition-colors ${
                      isDarkMode ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    LinkedIn Profile
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* General Inquiry Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={`p-10 rounded-3xl text-center space-y-6 ${
          isDarkMode ? 'bg-indigo-900/20 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-100'
        }`}
      >
        <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.contactDesc}</h2>
        <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          For institutional partnerships or medical data verification, please reach out to our primary team lead Kanka Das.
        </p>
        <button 
          onClick={() => window.location.href = 'mailto:daskanka20@gmail.com'}
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
        >
          {t.contact}
        </button>
      </motion.div>
    </div>
  );
};

export default Contact;
