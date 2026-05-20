import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { UserPlus, CheckCircle2 } from 'lucide-react';

const PatientAdmissions = () => {
  const [formData, setFormData] = useState({ name: '', age: '', gender: 'Male', disease: '', doctor_name: '', bed_id: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const { data: availableBeds, refetch: refetchBeds } = useQuery({
    queryKey: ['availableBeds'],
    queryFn: async () => { const res = await api.get('/beds'); return res.data.filter(b => b.status === 'Available'); }
  });

  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => { const res = await api.get('/doctors'); return res.data; }
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/patients/admit', formData);
      setMessage({ type: 'success', text: 'Patient admitted successfully!' });
      setFormData({ name: '', age: '', gender: 'Male', disease: '', doctor_name: '', bed_id: '' });
      refetchBeds();
    } catch { setMessage({ type: 'error', text: 'Failed to admit patient.' }); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="bg-primary p-6 flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
            <UserPlus className="text-white" size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">New Patient Admission</h2>
            <p className="text-white/70 text-xs">Fill in the details to admit a new patient</p>
          </div>
        </div>

        <div className="p-6">
          {message && (
            <div className={`flex items-center gap-2 p-4 rounded-xl mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-success-bg text-success border border-success/20' : 'bg-danger-bg text-danger border border-danger/20'}`}>
              <CheckCircle2 size={18} />
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Patient Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              <Field label="Age" name="age" type="number" value={formData.age} onChange={handleChange} placeholder="45" required />
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border border-border rounded-xl bg-page-bg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <Field label="Primary Disease / Condition" name="disease" value={formData.disease} onChange={handleChange} placeholder="e.g. Viral Fever" required />
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Assigned Doctor</label>
                <select required name="doctor_name" value={formData.doctor_name} onChange={handleChange} className="w-full p-3 border border-border rounded-xl bg-page-bg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                  <option value="">-- Select Doctor --</option>
                  {doctors?.map(doc => (
                    <option key={doc.id} value={doc.name}>{doc.name} — {doc.specialty}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Assign Bed</label>
                <select required name="bed_id" value={formData.bed_id} onChange={handleChange} className="w-full p-3 border border-border rounded-xl bg-page-bg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                  <option value="">-- Select Available Bed --</option>
                  {availableBeds?.map(bed => (
                    <option key={bed.id} value={bed.id}>Bed #{bed.id} — {bed.ward_name} ({bed.bed_type})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-5 border-t border-border flex justify-end">
              <button disabled={loading} type="submit" className={`bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-xl text-sm shadow-md shadow-primary/20 transition-all ${loading ? 'opacity-50' : 'hover:shadow-lg active:scale-[0.99]'}`}>
                {loading ? 'Admitting...' : 'Admit Patient & Assign Bed'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-text-secondary mb-1.5">{label}</label>
    <input {...props} className="w-full p-3 border border-border rounded-xl bg-page-bg text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
  </div>
);

export default PatientAdmissions;
