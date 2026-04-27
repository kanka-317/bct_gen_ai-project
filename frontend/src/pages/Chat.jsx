import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Activity, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatWithDoctor } from '../api/api';
import { addTimelineEvent } from '../utils/timeline';
import { translations } from '../utils/translations';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: 'Hello! I am MediScan AI. How can I help you today? Please feel free to describe any symptoms or health concerns you are experiencing.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, , language] = useOutletContext();
  const t = translations[language] || translations.English;
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScroll = (e) => {
    const { scrollHeight, clientHeight } = e.target;
    setShowScrollButtons(scrollHeight > clientHeight + 120);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithDoctor(newMessages);
      let displayText = response.response;
      if (displayText.includes('DIAGNOSIS_TAG:')) {
        displayText = displayText.split('DIAGNOSIS_TAG:')[0].trim();
      }
      setMessages([...newMessages, { role: 'model', text: displayText }]);
      
      if (response.diagnosis) {
        addTimelineEvent('AI Diagnosis', `The AI Doctor identified a potential condition: ${response.diagnosis}. \n\nDetailed Analysis:\n${displayText}`, 'Medical Analysis');
        // Dispatch event to notify Dashboard and other components to refresh profile data
        window.dispatchEvent(new CustomEvent('profile-updated'));
      } else {
        addTimelineEvent('AI Consultation', `Completed a session with MediScan AI Doctor. \n\nSummary of Discussion:\n${displayText}`, 'AI Analysis');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        { role: 'model', text: 'Sorry, I encountered an error connecting to the servers. Please try again later.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const theme = {
    container: isDarkMode ? 'bg-[#111c44]/80 border-gray-700 shadow-black/50' : 'bg-white/70 border-white/80 shadow-indigo-100/50',
    header: isDarkMode ? 'border-gray-700 bg-gray-900/90' : 'border-gray-200/50 bg-white/80',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-800',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    infoBanner: isDarkMode ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-100',
    messagesArea: isDarkMode ? 'from-gray-900/50 to-gray-800/30' : 'from-transparent to-white/40',
    botBubble: isDarkMode ? 'bg-[#1b254b] border-gray-700 text-gray-200 shadow-black/20' : 'bg-white/95 border-gray-100/80 text-gray-800 shadow-sm',
    inputArea: isDarkMode ? 'bg-[#111c44]/90 border-gray-700' : 'bg-white/80 border-gray-100/50',
    inputBg: isDarkMode
      ? 'bg-[#0b1437] border-gray-700 text-white placeholder:text-gray-500 focus:ring-cyan-500/30 focus:border-cyan-500'
      : 'bg-white/90 border-gray-200/80 text-gray-800 placeholder:text-gray-400 focus:ring-cyan-500/20 focus:border-cyan-400',
    decorativeTop: isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-300/20',
    decorativeBottom: isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-300/20',
    prose: isDarkMode ? 'prose-invert text-gray-200' : 'text-gray-700',
  };

  const contentWidth = 'w-full max-w-5xl mx-auto';

  return (
    <div
      className={`relative mb-3 flex flex-1 flex-col overflow-hidden rounded-[1.75rem] border shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-3xl transition-colors duration-500 sm:mb-4 sm:rounded-[2rem] lg:rounded-3xl ${theme.container} h-[75dvh] min-h-[28rem] sm:h-[78dvh] sm:min-h-[32rem] lg:h-[calc(100vh-14rem)] lg:min-h-[500px]`}
    >
      <div className={`pointer-events-none absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full blur-[100px] transition-colors duration-500 ${theme.decorativeTop}`} />
      <div className={`pointer-events-none absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full blur-[100px] transition-colors duration-500 ${theme.decorativeBottom}`} />

      <div className={`z-10 flex-none border-b px-3 py-3 backdrop-blur-xl transition-colors duration-500 sm:px-4 sm:py-4 md:px-6 ${theme.header}`}>
        <div className={`${contentWidth} flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center`}>
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 opacity-50 blur animate-pulse"></div>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 md:h-12 md:w-12">
                <Bot className="h-5 w-5 text-white md:h-6 md:w-6" />
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white/50 bg-green-500"></div>
            </div>

            <div className="min-w-0 flex-1 py-1">
              <h2 className={`flex items-center gap-2 truncate text-base font-black sm:text-lg md:text-xl ${theme.textPrimary}`}>
                MediScan AI <Sparkles className="h-4 w-4 text-yellow-400" />
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-wide sm:text-xs md:text-sm ${theme.textSecondary}`}>
                  Always Online
                </span>
              </div>
            </div>
          </div>

          <div className={`flex w-full max-w-full items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs shadow-sm backdrop-blur-sm sm:w-auto sm:max-w-sm ${theme.infoBanner}`}>
            <Info className="h-4 w-4 flex-shrink-0" />
            <span className="leading-tight">AI responses for guidance only.</span>
          </div>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={`custom-scrollbar relative z-0 flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b p-3 transition-colors duration-500 scroll-smooth sm:p-4 md:p-6 ${theme.messagesArea}`}
      >
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
          }
        `}</style>

        <div className={`${contentWidth} space-y-4 sm:space-y-6 md:space-y-8`}>
          <AnimatePresence>
            {showScrollButtons && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-4 right-4 z-50 flex flex-col gap-2.5 sm:bottom-6 sm:right-6 sm:gap-3"
              >
                <button
                  type="button"
                  onClick={scrollToTop}
                  className={`group rounded-2xl border p-2.5 shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 sm:p-3.5 ${
                    isDarkMode ? 'bg-[#1b254b]/90 border-gray-700 text-cyan-400 hover:border-cyan-500/50' : 'bg-white/90 border-gray-100 text-cyan-600 hover:border-cyan-200'
                  }`}
                  title="Scroll to top"
                >
                  <svg className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={scrollToBottom}
                  className={`group rounded-2xl border p-2.5 shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 sm:p-3.5 ${
                    isDarkMode ? 'bg-[#1b254b]/90 border-gray-700 text-blue-400 hover:border-blue-500/50' : 'bg-white/90 border-gray-100 text-blue-600 hover:border-blue-200'
                  }`}
                  title="Scroll to bottom"
                >
                  <svg className="h-5 w-5 transition-transform group-hover:translate-y-0.5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex w-full max-w-full gap-2.5 sm:max-w-[94%] sm:gap-3 md:max-w-[88%] md:gap-4 lg:max-w-[78%] ${isUser ? 'flex-row-reverse items-start' : 'items-start'}`}>
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 shadow-md sm:h-9 sm:w-9 md:h-10 md:w-10 ${isDarkMode ? 'border-gray-800' : 'border-white'} ${
                        isUser
                          ? 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600'
                          : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/30'
                      }`}
                    >
                      {isUser ? <User className="h-4 w-4 md:h-5 md:w-5" /> : <Bot className="h-4 w-4 md:h-5 md:w-5" />}
                    </motion.div>

                    <div
                      className={`group relative min-w-0 px-4 py-3.5 backdrop-blur-md transition-all sm:px-5 md:px-6 md:py-4 ${
                        isUser
                          ? 'rounded-[1.5rem] rounded-tr-sm bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 sm:rounded-3xl'
                          : `rounded-[1.5rem] rounded-tl-sm border sm:rounded-3xl ${theme.botBubble}`
                      }`}
                    >
                      <div className={`prose max-w-none break-words text-[14px] leading-relaxed sm:text-[15px] ${isUser ? 'text-white' : theme.prose}`}>
                        {isUser ? (
                          <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full justify-start"
            >
              <div className="flex max-w-full gap-2.5 sm:max-w-[90%] sm:gap-3 md:max-w-[80%] md:gap-4">
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/30 sm:h-9 sm:w-9 md:h-10 md:w-10 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}>
                  <Bot className="h-4 w-4 text-white md:h-5 md:w-5" />
                </div>
                <div className={`flex items-center gap-3 rounded-[1.5rem] rounded-tl-sm border px-4 py-3.5 shadow-sm backdrop-blur-md sm:rounded-3xl sm:px-5 md:px-6 md:py-4 ${theme.botBubble}`}>
                  <div className="flex space-x-1.5">
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  </div>
                  <span className={`bg-gradient-to-r bg-clip-text text-sm font-medium text-transparent ${isDarkMode ? 'from-cyan-400 to-blue-400' : 'from-cyan-600 to-blue-600'}`}>
                    {t.analyzingSymptoms}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Premium Input Area */}
      <div className={`p-4 sm:p-8 border-t ${isDarkMode ? 'bg-[#0b1437] border-white/5' : 'bg-white border-slate-100'}`}>
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.typeSymptoms || "Describe your symptoms (e.g., I have a slight fever...)"}
            className={`w-full pl-6 pr-24 py-5 rounded-[2rem] border-2 transition-all font-medium ${
              isDarkMode 
              ? 'bg-slate-900/50 border-white/5 text-white placeholder:text-slate-500 focus:bg-slate-900 focus:border-indigo-500' 
              : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500'
            }`}
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? <Activity className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className={`flex items-center justify-center gap-1 text-xs font-medium ${theme.textSecondary}`}>
            <Sparkles className="h-3 w-3" /> Powered by Advanced AI Diagnostic Models
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
