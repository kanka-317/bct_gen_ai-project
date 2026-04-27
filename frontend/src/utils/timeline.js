export const addTimelineEvent = (title, description, type = 'AI Analysis') => {
  const existing = JSON.parse(localStorage.getItem('timelineData')) || [];
  const newEvent = {
    id: Date.now(),
    title,
    description,
    type,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  localStorage.setItem('timelineData', JSON.stringify([newEvent, ...existing]));
  
  // Dispatch a custom event to notify listeners (like the Dashboard)
  window.dispatchEvent(new Event('timeline-updated'));
};

export const updateMedicalHistory = (updates) => {
  const patientData = JSON.parse(localStorage.getItem('patientData')) || {};
  const updatedData = { ...patientData, ...updates };
  localStorage.setItem('patientData', JSON.stringify(updatedData));
  
  // Notify dashboard to refresh
  window.dispatchEvent(new Event('profile-updated'));
};
