import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { socket } from '../socket/socket';
import { Bed, Activity, AlertTriangle, BookmarkCheck, ArrowUpRight, ArrowDownRight, Plus, Search, Wrench, ArrowRightLeft } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, CartesianGrid
} from 'recharts';

const COLORS = {
  available: '#16a34a',
  occupied: '#dc2626',
  reserved: '#f59e0b',
  primary: '#1a56db',
  primaryLight: '#3b82f6',
  gray: '#e2e8f0',
};

const Dashboard = () => {
  const [liveData, setLiveData] = useState(null);

  const fetchStats = async () => {
    const res = await api.get('/reports');
    return res.data;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchStats
  });

  useEffect(() => {
    if (data) setLiveData(data);
  }, [data]);

  useEffect(() => {
    socket.connect();
    const handleUpdate = () => refetch();
    socket.on('bed_updated', handleUpdate);
    socket.on('patient_admitted', handleUpdate);
    socket.on('patient_discharged', handleUpdate);
    return () => {
      socket.off('bed_updated', handleUpdate);
      socket.off('patient_admitted', handleUpdate);
      socket.off('patient_discharged', handleUpdate);
      socket.disconnect();
    };
  }, [refetch]);

  if (isLoading || !liveData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 stagger-children">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const {
    totalBeds, availableBeds, occupiedBeds,
    totalIcuBeds, occupiedIcuBeds,
    totalEmergencyBeds, occupiedEmergencyBeds,
    wardOccupancy, monthlyAdmissions
  } = liveData;

  const reservedBeds = totalBeds - availableBeds - occupiedBeds;
  const availPct = totalBeds > 0 ? ((availableBeds / totalBeds) * 100).toFixed(1) : 0;
  const occPct = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;
  const resPct = totalBeds > 0 ? ((Math.max(reservedBeds, 0) / totalBeds) * 100).toFixed(1) : 0;

  // Pie data for Bed Availability Overview
  const overviewPie = [
    { name: 'Available', value: availableBeds, color: COLORS.available },
    { name: 'Occupied', value: occupiedBeds, color: COLORS.occupied },
    { name: 'Reserved', value: Math.max(reservedBeds, 0), color: COLORS.reserved },
  ];

  // Pie data for Bed Status Distribution (by ward type)
  const distributionPie = wardOccupancy.map((w, i) => ({
    name: w.name,
    value: w.total,
    color: [COLORS.available, COLORS.primary, COLORS.occupied, COLORS.reserved][i % 4],
  }));

  // Trend data (dummy 7-day)
  const trendData = [
    { day: 'May 18', available: 72, occupied: 160, reserved: 18 },
    { day: 'May 19', available: 68, occupied: 164, reserved: 18 },
    { day: 'May 20', available: 75, occupied: 158, reserved: 17 },
    { day: 'May 21', available: 60, occupied: 172, reserved: 18 },
    { day: 'May 22', available: 80, occupied: 152, reserved: 18 },
    { day: 'May 23', available: availableBeds, occupied: occupiedBeds, reserved: Math.max(reservedBeds, 0) },
    { day: 'May 24', available: availableBeds, occupied: occupiedBeds, reserved: Math.max(reservedBeds, 0) },
  ];

  // Department table
  const departments = wardOccupancy.map(w => ({
    name: w.name,
    total: w.total,
    available: w.total - w.occupied,
    occupied: w.occupied,
    reserved: Math.floor(w.total * 0.05),
    pct: w.total > 0 ? Math.round(((w.total - w.occupied) / w.total) * 100) : 0,
  }));

  const totalRow = departments.reduce((acc, d) => ({
    total: acc.total + d.total,
    available: acc.available + d.available,
    occupied: acc.occupied + d.occupied,
    reserved: acc.reserved + d.reserved,
  }), { total: 0, available: 0, occupied: 0, reserved: 0 });

  const recentReservations = [
    { initials: 'JS', name: 'John Smith', ward: 'ICU', bed: 'Bed ICU-05', status: 'Confirmed' },
    { initials: 'AS', name: 'Alice Brown', ward: 'General Ward', bed: 'Bed GW-12', status: 'Upcoming' },
    { initials: 'MR', name: 'Michael Ray', ward: 'Surgery', bed: 'Bed SR-03', status: 'Confirmed' },
    { initials: 'SP', name: 'Sneha Patel', ward: 'Pediatrics', bed: 'Bed PD-07', status: 'Upcoming' },
  ];

  return (
    <div className="space-y-6">
      {/* Recent Alerts — Full Width Section at the Top */}
      <div className="space-y-3 animate-fade-in">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-text-primary">Recent Alerts</h3>
          <button className="text-xs text-primary font-medium hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Alert 1: Warning */}
          <div className="bg-warning-bg border border-warning/10 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-warning/10 text-warning rounded-lg flex items-center justify-center shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-text-primary">Low bed availability in ICU</p>
                <p className="text-[11px] text-text-secondary">Only {totalIcuBeds - occupiedIcuBeds} beds available</p>
              </div>
            </div>
            <span className="text-[10px] text-text-muted shrink-0 font-medium ml-3">10:15 AM</span>
          </div>

          {/* Alert 2: Info */}
          <div className="bg-info-bg border border-info/10 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-info/10 text-info rounded-lg flex items-center justify-center shrink-0">
                <Wrench size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-text-primary">Maintenance scheduled</p>
                <p className="text-[11px] text-text-secondary">Bed MW-12 on May 25, 2024</p>
              </div>
            </div>
            <span className="text-[10px] text-text-muted shrink-0 font-medium ml-3">09:30 AM</span>
          </div>

          {/* Alert 3: Success */}
          <div className="bg-success-bg border border-success/10 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-success/10 text-success rounded-lg flex items-center justify-center shrink-0">
                <Activity size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-text-primary">Bed transfer completed</p>
                <p className="text-[11px] text-text-secondary">Patient ID: PT-4587</p>
              </div>
            </div>
            <span className="text-[10px] text-text-muted shrink-0 font-medium ml-3">09:00 AM</span>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 stagger-children">
        <StatCard icon={<Bed size={22} />} iconBg="bg-primary-100 text-primary" title="Total Beds" value={totalBeds} sub="100%" />
        <StatCard icon={<Bed size={22} />} iconBg="bg-success-bg text-success" title="Available Beds" value={availableBeds} sub={`${availPct}%`} />
        <StatCard icon={<Bed size={22} />} iconBg="bg-danger-bg text-danger" title="Occupied Beds" value={occupiedBeds} sub={`${occPct}%`} />
        <StatCard icon={<BookmarkCheck size={22} />} iconBg="bg-primary-50 text-primary" title="Reserved Beds" value={Math.max(reservedBeds, 0)} sub={`${resPct}%`} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bed Availability Overview — Donut */}
        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in flex flex-col justify-between">
          <h3 className="text-sm font-bold text-text-primary mb-2">Bed Availability Overview</h3>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-1/2 h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={overviewPie} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                    {overviewPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                <p className="text-xl font-extrabold text-text-primary">{totalBeds}</p>
                <p className="text-[10px] text-text-muted leading-none">Total Beds</p>
              </div>
            </div>
            <div className="w-1/2 space-y-2">
              {overviewPie.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                    <span className="text-text-secondary truncate">{d.name}</span>
                  </div>
                  <span className="text-text-primary font-bold ml-2">
                    {d.value} <span className="text-text-muted font-normal text-[10px]">({totalBeds > 0 ? ((d.value / totalBeds) * 100).toFixed(0) : 0}%)</span>
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-border mt-1">
                <span className="text-[10px] text-success font-semibold flex items-center gap-1">
                  <span className="text-xs">↑</span> 5.2% vs yesterday
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bed Status Distribution — Donut */}
        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in flex flex-col justify-between">
          <h3 className="text-sm font-bold text-text-primary mb-2">Bed Status Distribution</h3>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-1/2 h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distributionPie} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                    {distributionPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                <p className="text-xl font-extrabold text-text-primary">{totalBeds}</p>
                <p className="text-[10px] text-text-muted leading-none">Total Beds</p>
              </div>
            </div>
            <div className="w-1/2 space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {distributionPie.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                    <span className="text-text-secondary truncate">{d.name}</span>
                  </div>
                  <span className="text-text-primary font-bold ml-1 shrink-0">
                    {d.value} <span className="text-text-muted font-normal text-[9px]">({totalBeds > 0 ? ((d.value / totalBeds) * 100).toFixed(0) : 0}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Availability Trend — Line */}
        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-text-primary">Availability Trend (Last 7 Days)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="available" stroke={COLORS.available} strokeWidth={2} dot={{ r: 3 }} name="Available" />
                <Line type="monotone" dataKey="occupied" stroke={COLORS.occupied} strokeWidth={2} dot={{ r: 3 }} name="Occupied" />
                <Line type="monotone" dataKey="reserved" stroke={COLORS.reserved} strokeWidth={2} dot={{ r: 3 }} name="Reserved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Department Table */}
        <div className="lg:col-span-1 bg-card rounded-xl border border-border p-5 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-text-primary">Bed Availability by Department</h3>
            <button className="text-xs text-primary font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-text-muted border-b border-border">
                  <th className="text-left py-2 font-medium">Department</th>
                  <th className="text-center py-2 font-medium">Total</th>
                  <th className="text-center py-2 font-medium">Avail</th>
                  <th className="text-center py-2 font-medium">Occ</th>
                  <th className="text-right py-2 font-medium">Avail %</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-primary-50/30 transition-colors">
                    <td className="py-2.5 font-medium text-text-primary flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: [COLORS.primary, COLORS.available, COLORS.occupied, COLORS.reserved][i % 4] }}></span>
                      {d.name}
                    </td>
                    <td className="text-center text-text-secondary">{d.total}</td>
                    <td className="text-center text-success font-semibold">{d.available}</td>
                    <td className="text-center text-danger font-semibold">{d.occupied}</td>
                    <td className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="availability-bar w-16">
                          <div className="availability-bar-fill" style={{ width: `${d.pct}%`, backgroundColor: d.pct > 30 ? COLORS.available : COLORS.occupied }}></div>
                        </div>
                        <span className="text-text-secondary font-medium">{d.pct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold text-text-primary border-t border-border">
                  <td className="py-2">Total</td>
                  <td className="text-center">{totalRow.total}</td>
                  <td className="text-center text-success">{totalRow.available}</td>
                  <td className="text-center text-danger">{totalRow.occupied}</td>
                  <td className="text-right">{totalRow.total > 0 ? Math.round((totalRow.available / totalRow.total) * 100) : 0}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Bed Status Summary + Recent Reservations */}
        <div className="space-y-5">
          {/* Bed Status Summary */}
          <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
            <h3 className="text-sm font-bold text-text-primary mb-4">Bed Status Summary</h3>
            <div className="flex justify-around">
              {[
                { label: 'Available', value: availableBeds, pct: availPct, color: COLORS.available },
                { label: 'Occupied', value: occupiedBeds, pct: occPct, color: COLORS.occupied },
                { label: 'Reserved', value: Math.max(reservedBeds, 0), pct: resPct, color: COLORS.reserved },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <circle cx="20" cy="20" r="16" fill="none" stroke={s.color} strokeWidth="3" strokeDasharray={`${s.pct} ${100 - s.pct}`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-text-primary">{s.pct}%</span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</p>
                  <p className="text-[11px] text-text-muted">{s.value} Beds</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reservations */}
          <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-text-primary">Recent Reservations</h3>
              <button className="text-xs text-primary font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {recentReservations.map((r, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-xs font-bold text-primary">{r.initials}</div>
                    <div>
                      <p className="text-xs font-semibold text-text-primary">{r.name}</p>
                      <p className="text-[11px] text-text-muted">{r.ward} • {r.bed}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold ${r.status === 'Confirmed' ? 'text-success' : 'text-primary'}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
          <h3 className="text-sm font-bold text-text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Plus size={22} />, label: 'Add New\nReservation', color: 'text-primary bg-primary-50 hover:bg-primary-100' },
              { icon: <Search size={22} />, label: 'Find Bed', color: 'text-info bg-info-bg hover:bg-blue-100' },
              { icon: <ArrowRightLeft size={22} />, label: 'Bed Transfer', color: 'text-success bg-success-bg hover:bg-green-100' },
              { icon: <Wrench size={22} />, label: 'Maintenance\nRequest', color: 'text-warning bg-warning-bg hover:bg-amber-100' },
            ].map((a, i) => (
              <button key={i} className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl transition-colors ${a.color}`}>
                {a.icon}
                <span className="text-xs font-semibold text-text-primary text-center whitespace-pre-line leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, iconBg, title, value, sub }) => (
  <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4 hover:shadow-md transition-shadow animate-fade-in">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-text-muted mb-0.5">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-extrabold text-text-primary">{value}</h3>
        <span className="text-xs font-semibold text-primary">{sub}</span>
      </div>
    </div>
  </div>
);

export default Dashboard;
