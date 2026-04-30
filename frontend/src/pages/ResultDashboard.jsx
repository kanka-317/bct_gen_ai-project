import { useLocation, Link, Navigate, useOutletContext } from 'react-router-dom';
import { Activity, AlertTriangle, ArrowLeft, HeartPulse, Sparkles, Download, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { useEffect, useRef, useState } from 'react';
import { translations } from '../utils/translations';

function ResultDashboard() {
  const location = useLocation();
  const [isDarkMode, , language] = useOutletContext();
  const t = translations[language] || translations.English;
  const { result, type } = location.state || {};
  const reportRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (result) {
      // Celebrate success!
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [result]);

  if (!result) {
    return <Navigate to="/diagnose" replace />;
  }

  const isManual = type === 'manual';

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    
    try {
      const imgData = await toPng(reportRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Calculate height to maintain aspect ratio
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => (img.onload = resolve));
      const pdfHeight = (img.height * pdfWidth) / img.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Medical_Report_${result.primary_diagnosis || 'Analysis'}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <Link to="/diagnose" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" />
          {t.backToDiagnose}
        </Link>
        
        <div className="flex items-center gap-3">
          <button
            onClick={downloadPDF}
            disabled={isDownloading}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm disabled:opacity-50 ${
              isDarkMode 
              ? 'bg-slate-800 border-white/10 text-white hover:bg-slate-700' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-indigo-200 hover:text-indigo-600'
            }`}
          >
            {isDownloading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Activity className="w-4 h-4" />
              </motion.div>
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isDownloading ? 'Generating...' : t.downloadPdf}
          </button>
          
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border ${
            isDarkMode 
            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
            : 'bg-indigo-50 text-indigo-700 border-indigo-100'
          }`}>
            <Sparkles className="w-4 h-4" />
            {t.aiAnalysisComplete || 'AI Analysis Complete'}
          </div>
        </div>
      </motion.div>

      <div ref={reportRef} className={`${isDarkMode ? 'glass-dark border-white/10' : 'bg-white shadow-xl'} rounded-[2.5rem] overflow-hidden`}>
        {/* Header */}
        <div className={`p-8 sm:p-12 border-b ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-slate-50/50'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-500/20">
                <HeartPulse className="w-8 h-8" />
              </div>
              <div>
                <h1 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>MediScan AI</h1>
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Medical Diagnostic Report</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs font-medium text-slate-500 italic">Clinical Identification: #MS-{Math.floor(Math.random()*100000)}</p>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          {isManual ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Diagnosis Summary */}
              <div className="lg:col-span-5 space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-8 rounded-3xl border ${
                    isDarkMode ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500 text-white rounded-lg">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-indigo-900'}`}>{t.primaryDiagnosis}</h3>
                  </div>
                  <div className={`text-3xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-indigo-900'}`}>
                    {result.primary_diagnosis}
                  </div>
                  
                  {/* Confidence Gauge */}
                  <div className="relative h-24 w-full flex items-center justify-center mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      <path
                        d="M 10 45 A 40 40 0 0 1 90 45"
                        fill="none"
                        stroke={isDarkMode ? '#ffffff10' : '#00000005'}
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <motion.path
                        d="M 10 45 A 40 40 0 0 1 90 45"
                        fill="none"
                        stroke="#5E5CE6"
                        strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: (result.top_possibilities?.[0]?.probability || 95) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                      <text x="50" y="40" textAnchor="middle" className={`text-[10px] font-black fill-indigo-500`}>
                        {result.top_possibilities?.[0]?.probability || 95}%
                      </text>
                    </svg>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t.mlConfirmed}
                  </div>
                </motion.div>

                <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <h3 className={`text-md font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <FileText className="w-4 h-4 text-slate-400" />
                    {t.differentialDiagnosis}
                  </h3>
                  <div className="space-y-6">
                    {result.top_possibilities.map((prob, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className={`font-bold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{prob.disease}</span>
                          <span className="text-indigo-500 font-black">{prob.probability}%</span>
                        </div>
                        <div className="w-full bg-slate-200/20 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${prob.probability}%` }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                            className="bg-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border flex gap-4 ${isDarkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-100'}`}>
                  <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                  <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-amber-200/70' : 'text-amber-800'}`}>
                    This report is AI-generated for informational purposes and must be verified by a qualified medical professional.
                  </p>
                </div>
              </div>

              {/* Right Column: Detailed Explanation */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-600'}`}>
                    <HeartPulse className="w-7 h-7" />
                  </div>
                  <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.clinicalAssessment}</h2>
                </div>
                
                <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : 'prose-indigo'} prose-p:text-slate-400 prose-li:text-slate-400 prose-headings:text-indigo-400`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result.ai_explanation || result.analysis}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl">
                  <Activity className="w-8 h-8" />
                </div>
                <div>
                  <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Advanced Report Analysis</h2>
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Genomic & Biomarker Synthesis</p>
                </div>
              </div>

              <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : 'prose-indigo'} prose-p:text-slate-400 prose-headings:text-indigo-400`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.analysis}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className={`p-8 border-t text-center ${isDarkMode ? 'border-white/5 bg-white/2' : 'border-slate-50 bg-slate-50/30'}`}>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Confidential Medical Data</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">© 2026 MediScan AI Global • Secure Identification Protocol Active</p>
        </div>
      </div>
    </div>
  );
}

export default ResultDashboard;
