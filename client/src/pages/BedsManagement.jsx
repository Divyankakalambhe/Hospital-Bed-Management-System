import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { socket } from '../socket/socket';
import { useAuth } from '../context/AuthContext';
import { Bed, Plus, Search, Filter } from 'lucide-react';

const statusConfig = {
  Available: { bg: 'bg-success-bg', text: 'text-success', dot: 'bg-success', border: 'border-success/20' },
  Occupied: { bg: 'bg-danger-bg', text: 'text-danger', dot: 'bg-danger', border: 'border-danger/20' },
  Cleaning: { bg: 'bg-info-bg', text: 'text-info', dot: 'bg-info', border: 'border-info/20' },
  Reserved: { bg: 'bg-warning-bg', text: 'text-warning', dot: 'bg-warning', border: 'border-warning/20' },
  Maintenance: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-500', border: 'border-gray-200' },
};

const BedsManagement = () => {
  const { user } = useAuth();
  const [beds, setBeds] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchBeds = async () => {
    const res = await api.get('/beds');
    return res.data;
  };

  const { data, isLoading, refetch } = useQuery({ queryKey: ['beds'], queryFn: fetchBeds });

  useEffect(() => { if (data) setBeds(data); }, [data]);

  useEffect(() => {
    socket.connect();
    socket.on('bed_updated', refetch);
    socket.on('patient_admitted', refetch);
    socket.on('patient_discharged', refetch);
    return () => { socket.off('bed_updated', refetch); socket.off('patient_admitted', refetch); socket.off('patient_discharged', refetch); };
  }, [refetch]);

  const handleStatusChange = async (id, newStatus) => {
    try { await api.put(`/beds/${id}`, { status: newStatus }); refetch(); } catch { alert('Failed to update bed status'); }
  };

  const filteredBeds = beds
    .filter(b => filter === 'All' || b.status === filter)
    .filter(b => search === '' || `Bed #${b.id}`.toLowerCase().includes(search.toLowerCase()) || b.ward_name?.toLowerCase().includes(search.toLowerCase()));

  const counts = { All: beds.length, Available: beds.filter(b => b.status === 'Available').length, Occupied: beds.filter(b => b.status === 'Occupied').length, Cleaning: beds.filter(b => b.status === 'Cleaning').length, Reserved: beds.filter(b => b.status === 'Reserved').length, Maintenance: beds.filter(b => b.status === 'Maintenance').length };

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse"><div className="h-4 bg-gray-200 rounded w-20 mb-3"></div><div className="h-6 bg-gray-200 rounded w-12"></div></div>)}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search beds..." className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm bg-page-bg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {Object.keys(counts).map(status => (
            <button key={status} onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === status ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'bg-page-bg text-text-secondary hover:bg-primary-50 hover:text-primary border border-border'}`}>
              {status} <span className="ml-1 opacity-70">({counts[status]})</span>
            </button>
          ))}
        </div>
        {user?.role === 'Admin' && (
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm shadow-primary/20 transition-colors shrink-0">
            <Plus size={16} /> Add Bed
          </button>
        )}
      </div>

      {/* Bed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
        {filteredBeds.map((bed) => {
          const cfg = statusConfig[bed.status] || statusConfig.Available;
          return (
            <div key={bed.id} className={`bg-card rounded-xl border ${cfg.border} overflow-hidden hover:shadow-md transition-all animate-fade-in group`}>
              <div className={`h-1.5 w-full ${cfg.dot}`}></div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-lg ${cfg.bg} ${cfg.text} flex items-center justify-center`}>
                      <Bed size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">Bed #{bed.id}</h4>
                      <p className="text-[11px] text-text-muted font-medium uppercase tracking-wide">{bed.bed_type}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{bed.status}</span>
                </div>
                <p className="text-xs text-text-secondary mb-3"><span className="font-medium">Ward:</span> {bed.ward_name}</p>
                <select value={bed.status} onChange={e => handleStatusChange(bed.id, e.target.value)} disabled={bed.status === 'Occupied'}
                  className="w-full bg-page-bg border border-border text-text-secondary text-xs rounded-lg focus:ring-primary focus:border-primary p-2 disabled:opacity-50 transition-colors">
                  <option value="Available">Available</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Occupied" disabled>Occupied (Auto)</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
      {filteredBeds.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Bed size={40} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-secondary font-medium">No beds found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default BedsManagement;
