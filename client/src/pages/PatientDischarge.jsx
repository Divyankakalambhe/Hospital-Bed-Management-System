import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { socket } from '../socket/socket';
import { UserMinus, CheckCircle, Search, Calendar, User, UserCheck, Stethoscope } from 'lucide-react';

const PatientDischarge = () => {
  const [admissions, setAdmissions] = useState([]);
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchActiveAdmissions = async () => {
    const res = await api.get('/patients/active');
    return res.data;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['activeAdmissions'],
    queryFn: fetchActiveAdmissions
  });

  useEffect(() => {
    if (data) setAdmissions(data);
  }, [data]);

  useEffect(() => {
    socket.connect();
    const handleUpdate = () => refetch();
    socket.on('patient_admitted', handleUpdate);
    socket.on('patient_discharged', handleUpdate);
    return () => {
      socket.off('patient_admitted', handleUpdate);
      socket.off('patient_discharged', handleUpdate);
    };
  }, [refetch]);

  const handleDischarge = async (id) => {
    if (!window.confirm('Are you sure you want to discharge this patient? This will automatically release their bed.')) return;
    setLoadingId(id);
    setMessage(null);
    try {
      await api.put(`/patients/discharge/${id}`);
      setMessage({ type: 'success', text: 'Patient discharged successfully and bed is now marked as Available.' });
      refetch();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to discharge patient. Please try again.' });
    } finally {
      setLoadingId(null);
    }
  };

  const filteredAdmissions = admissions.filter(adm =>
    adm.name.toLowerCase().includes(search.toLowerCase()) ||
    adm.doctor_name.toLowerCase().includes(search.toLowerCase()) ||
    adm.disease.toLowerCase().includes(search.toLowerCase()) ||
    String(adm.bed_id).includes(search)
  );

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Info */}
      <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-danger-bg text-danger rounded-xl flex items-center justify-center">
            <UserMinus size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Patient Discharges</h2>
            <p className="text-xs text-text-muted">Manage active patient discharges to release hospital beds in real-time</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary bg-page-bg px-3 py-1.5 rounded-lg border border-border">
          <UserCheck size={14} className="text-primary" />
          <span>Active Admissions: <span className="text-primary font-bold">{admissions.length}</span></span>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-2.5 text-sm font-semibold border ${message.type === 'success' ? 'bg-success-bg text-success border-success/20' : 'bg-danger-bg text-danger border-danger/20'}`}>
          <CheckCircle size={18} />
          <span>{message.text}</span>
        </div>
      )}

      {/* Toolbar / Search */}
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients, doctors, beds or disease..."
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm bg-page-bg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Patients Table Card */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-page-bg text-text-secondary text-xs uppercase tracking-wider font-semibold border-b border-border">
                <th className="px-6 py-3.5">Patient Details</th>
                <th className="px-6 py-3.5">Diagnosis</th>
                <th className="px-6 py-3.5">Assigned Doctor</th>
                <th className="px-6 py-3.5">Bed / Ward Location</th>
                <th className="px-6 py-3.5">Admission Date</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-text-secondary font-medium">
                    <User size={32} className="mx-auto text-text-muted mb-3" />
                    No active admissions found.
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((adm, i) => (
                  <tr key={adm.admission_id} className="hover:bg-primary-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-primary text-sm">{adm.name}</p>
                      <p className="text-[11px] text-text-secondary font-medium">{adm.age} Years • {adm.gender}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-text-primary">
                      <span className="bg-primary-50 text-primary-800 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide">
                        {adm.disease}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary font-semibold flex items-center gap-1.5 mt-2.5">
                      <Stethoscope size={13} className="text-text-muted" />
                      {adm.doctor_name}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-primary">Bed #{adm.bed_id}</p>
                      <p className="text-[11px] text-text-secondary font-medium">{adm.ward_name}</p>
                    </td>
                    <td className="px-6 py-4 text-text-secondary font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-text-muted" />
                        {new Date(adm.admission_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDischarge(adm.admission_id)}
                        disabled={loadingId === adm.admission_id}
                        className={`bg-white border border-danger text-danger hover:bg-danger hover:text-white px-4 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wide transition-all shadow-sm ${loadingId === adm.admission_id ? 'opacity-50' : 'active:scale-95'}`}
                      >
                        {loadingId === adm.admission_id ? 'Discharging...' : 'Discharge'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientDischarge;
