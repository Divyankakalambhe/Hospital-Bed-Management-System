import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Stethoscope, Phone, Mail, Clock } from 'lucide-react';

const avatarColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-indigo-100 text-indigo-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
];

const Doctors = () => {
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => { const res = await api.get('/doctors'); return res.data; }
  });

  if (isLoading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div><div className="h-4 bg-gray-200 rounded w-28 mb-2"></div><div className="h-3 bg-gray-200 rounded w-20"></div></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-primary-50 text-primary rounded-xl flex items-center justify-center">
            <Stethoscope size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Hospital Doctors</h2>
            <p className="text-xs text-text-muted">{doctors?.length || 0} doctors available on staff</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-success font-semibold">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse-dot"></span>
          All Active
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
        {doctors?.map((doc, i) => {
          const initials = doc.name.replace('Dr. ', '').split(' ').map(w => w[0]).join('');
          const color = avatarColors[i % avatarColors.length];
          return (
            <div key={doc.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all animate-fade-in group">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${color}`}>
                  {initials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-text-primary truncate">{doc.name}</h3>
                  <p className="text-[11px] text-primary font-semibold">{doc.specialty}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-text-muted shrink-0" />
                  <span>+91 98XXX-XXXXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-text-muted shrink-0" />
                  <span className="truncate">{doc.name.replace('Dr. ', '').split(' ')[0].toLowerCase()}@hospital.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-text-muted shrink-0" />
                  <span>Mon – Sat, 9 AM – 5 PM</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-success">
                  <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                  Available
                </span>
                <span className="text-[10px] text-text-muted">ID: DOC-{String(doc.id).padStart(3, '0')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Doctors;
