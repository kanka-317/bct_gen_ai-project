import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getStoredUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error reading stored user:', error);
    return null;
  }
};

const getCurrentUserEmail = () => getStoredUser()?.email || '';

const persistPatientData = (patientData) => {
  if (typeof window !== 'undefined' && patientData) {
    localStorage.setItem('patientData', JSON.stringify(patientData));
  }
};

export const predictDisease = async (symptoms, labResults = {}) => {
  try {
    const email = getCurrentUserEmail();
    const response = await api.post('/predict', {
      ...(email ? { email } : {}),
      text: symptoms,
      ...labResults,
    });
    return response.data;
  } catch (error) {
    console.error('Error predicting disease:', error);
    throw error;
  }
};

export const analyzeReport = async (file) => {
  try {
    const formData = new FormData();
    const email = getCurrentUserEmail();
    formData.append('file', file);
    if (email) {
      formData.append('email', email);
    }
    
    const response = await api.post('/analyze-report', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing report:', error);
    throw error;
  }
};

export const chatWithDoctor = async (messages) => {
  try {
    const email = getCurrentUserEmail();
    const response = await api.post('/chat', { 
      messages,
      ...(email ? { email } : {})
    });
    return response.data;
  } catch (error) {
    console.error('Error chatting with doctor:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await api.post('/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const resetPassword = async (resetData) => {
  try {
    const response = await api.post('/reset-password', resetData);
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export const getPatientDetails = async () => {
  try {
    const email = getCurrentUserEmail();
    const response = await api.get('/patient-details', {
      params: { email },
    });
    persistPatientData(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient details:', error);
    throw error;
  }
};

export const updatePatientDetails = async (data) => {
  try {
    const currentUserEmail = getCurrentUserEmail();
    const response = await api.put('/patient-details', {
      currentUserEmail,
      ...data,
    });
    persistPatientData(response.data);
    window.dispatchEvent(new Event('profile-updated'));
    return response.data;
  } catch (error) {
    console.error('Error updating patient details:', error);
    throw error;
  }
};

export default api;
