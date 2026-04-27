import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { predictDisease, analyzeReport } from '../api/api';
import { FileUp, Loader2, Activity, ClipboardList, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addTimelineEvent, updateMedicalHistory } from '../utils/timeline';
import { translations } from '../utils/translations';


function DiagnosisForm() {
  const navigate = useNavigate();
  const [isDarkMode, , language] = useOutletContext();
  const t = translations[language] || translations.English;
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'upload'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Manual Form State
  const [symptoms, setSymptoms] = useState('');
  const [labs, setLabs] = useState({
    Temperature_F: 98.6,
    Systolic_BP: 120,
    Diastolic_BP: 80,
    WBC_Count: 7000,
    Fasting_Blood_Sugar: 90.0,
    Bilirubin_Total: 0.8,
  });

  // Upload State
  const [file, setFile] = useState(null);

  const handleLabChange = (e) => {
    setLabs({ ...labs, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please describe your symptoms.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await predictDisease(symptoms, labs);
      
      const primaryProbability = data.top_possibilities?.[0]?.probability || 0;
      
      // Log to timeline with detailed info
      addTimelineEvent('Disease Prediction', data.ai_explanation || `AI predicted: ${data.primary_diagnosis}. Confidence level: ${primaryProbability}%`, 'Diagnosis');
      
      // Update Medical History
      if (primaryProbability > 50) {
        updateMedicalHistory({ chronic_disease: data.primary_diagnosis });
      }
      
      navigate('/results', { state: { result: { ...data, prediction: data.primary_diagnosis, probability: primaryProbability / 100 }, type: 'manual' } });
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMessage = Array.isArray(detail) ? detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join(', ') : detail;
      setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to predict disease. Make sure the backend is running and OPENAI_API_KEY is set.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a file.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeReport(file);
      
      // Log to timeline with detailed info
      addTimelineEvent('Report Analysis', data.analysis || `Analyzed medical report: ${file.name}. Key findings extracted.`, 'AI Analysis');
      
      // Update Medical History Status
      updateMedicalHistory({ chronic_disease: 'Analysis Pending Review' });
      
      navigate('/results', { state: { result: data, type: 'upload' } });
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMessage = Array.isArray(detail) ? detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join(', ') : detail;
      setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to analyze report. Make sure GOOGLE_API_KEY is configured.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isDarkMode ? 'glass-dark' : 'glass shadow-indigo-100/50'} rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden`}
      >
        <div className={`p-10 border-b ${isDarkMode ? 'border-white/5 bg-indigo-500/5' : 'border-indigo-50 bg-gradient-to-br from-indigo-50/50 to-white'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
              <ClipboardList className="w-8 h-8" />
            </div>
            <div>
              <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.clinicalAssessment}</h2>
              <p className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select your preferred method of clinical data submission.</p>
            </div>
          </div>
        </div>

        <div className={`flex p-2 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50/50'}`}>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all rounded-2xl flex items-center justify-center gap-3 ${
              activeTab === 'manual' 
                ? `${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 shadow-sm border border-indigo-100'}` 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Activity className="w-5 h-5" />
            {t.manualEntry}
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all rounded-2xl flex items-center justify-center gap-3 ${
              activeTab === 'upload' 
                ? `${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 shadow-sm border border-indigo-100'}` 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileUp className="w-5 h-5" />
            {t.uploadReport}
          </button>
        </div>

        <div className="p-10">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3 text-sm font-bold"
              >
                <div className="p-1.5 bg-red-100 rounded-lg">
                  <Activity className="w-4 h-4" />
                </div>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === 'manual' ? (
            <motion.form 
              key="manual"
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleManualSubmit}
            >
              <div className="mb-8">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Clinical Presentation / Symptoms</label>
                <textarea
                  className={`w-full px-5 py-4 rounded-2xl border-2 transition-all shadow-inner placeholder:text-slate-500 font-medium ${
                    isDarkMode 
                    ? 'bg-slate-900/50 border-white/5 text-white focus:bg-slate-900 focus:border-indigo-500' 
                    : 'bg-slate-50/30 border-slate-100 text-slate-900 focus:bg-white focus:border-indigo-500'
                  }`}
                  rows="5"
                  placeholder="Describe your current medical condition in detail..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                ></textarea>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-px bg-slate-100 flex-1"></div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                  Laboratory Biomarkers (Optional)
                </h3>
                <div className="h-px bg-slate-100 flex-1"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {Object.entries(labs).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <input
                      type="number"
                      step="any"
                      name={key}
                      value={value}
                      onChange={handleLabChange}
                      className={`w-full px-5 py-3 rounded-xl border-2 transition-all font-bold ${
                        isDarkMode 
                        ? 'bg-slate-900/50 border-white/5 text-white focus:bg-slate-900' 
                        : 'bg-slate-50/30 border-slate-100 text-slate-900 focus:bg-white focus:border-indigo-500'
                      }`}
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-indigo-100 group"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                    {t.computeMlDiagnosis}
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="upload"
              initial={{ opacity: 0, x: 10 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleUploadSubmit}
            >
              <div className="mb-10">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Source Documentation (PDF, JPG, PNG)</label>
                <div className="group relative">
                  <div className={`border-4 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer relative overflow-hidden ${
                    file 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : `${isDarkMode ? 'border-white/5 bg-white/5 hover:border-indigo-500/30' : 'border-slate-100 bg-slate-50/50 hover:border-indigo-200 hover:bg-white'}`
                  }`}>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="relative z-0">
                      <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        file ? 'bg-indigo-600 text-white' : 'bg-white text-slate-300'
                      }`}>
                        {file ? <ClipboardList className="w-10 h-10" /> : <FileUp className="w-10 h-10" />}
                      </div>
                      {file ? (
                        <div>
                          <p className="text-xl font-black text-slate-900 mb-1">{file.name}</p>
                          <p className="text-sm font-bold text-indigo-600">File attached and ready for analysis</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-lg font-black text-slate-900">{t.dragAndDrop}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-indigo-100"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {t.initiateAiLab}
                  </>
                )}
              </button>
            </motion.form>
          )}
        </div>
      </motion.div>
      
      <div className="mt-8 text-center">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
          <Activity className="w-4 h-4 text-red-400" />
          HIPAA Compliant AI Diagnostic Pipeline
        </p>
      </div>
    </div>
  );
}

export default DiagnosisForm;
