import React, { useEffect, useState } from 'react';
import { updatePatientDetails } from '../api/api';

const getInitialFormData = (patientData) => ({
  name: patientData?.name || '',
  email: patientData?.email || '',
  phone: patientData?.phone || '',
  gender: patientData?.gender || '',
  location: patientData?.location || '',
  job: patientData?.job || '',
  bmi: patientData?.bmi || '',
  weight: patientData?.weight || '',
  height: patientData?.height || '',
  blood_pressure: patientData?.blood_pressure || '',
  chronic_disease: patientData?.chronic_disease || '',
  diabetes_emergencies: patientData?.diabetes_emergencies || '',
  surgery: patientData?.surgery || '',
  family_disease: patientData?.family_disease || '',
  diabetes_related_complication: patientData?.diabetes_related_complication || '',
});

const EditPatientModal = ({ isOpen, onClose, patientData, onUpdate }) => {
  const [formData, setFormData] = useState(() => getInitialFormData(patientData));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(getInitialFormData(patientData));
  }, [patientData, isOpen]);

  if (!isOpen || !patientData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePatientDetails(formData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update patient details", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Patient Details</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
              <input type="text" name="gender" value={formData.gender} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Job</label>
              <input type="text" name="job" value={formData.job} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">BMI</label>
              <input type="text" name="bmi" value={formData.bmi} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Weight (kg)</label>
              <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Height (cm)</label>
              <input type="text" name="height" value={formData.height} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Blood Pressure</label>
              <input type="text" name="blood_pressure" value={formData.blood_pressure} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
            </div>

            <div className="col-span-2 border-t border-gray-100 pt-4 mt-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Medical History</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Chronic Disease</label>
                  <input type="text" name="chronic_disease" value={formData.chronic_disease} onChange={handleChange} placeholder="e.g., Hypertension, None" className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Surgery History</label>
                    <input type="text" name="surgery" value={formData.surgery} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Family Disease</label>
                    <input type="text" name="family_disease" value={formData.family_disease} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Diabetes Emergencies</label>
                  <input type="text" name="diabetes_emergencies" value={formData.diabetes_emergencies} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Diabetes Complications</label>
                  <input type="text" name="diabetes_related_complication" value={formData.diabetes_related_complication} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 focus:bg-white transition-colors" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50">{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;
