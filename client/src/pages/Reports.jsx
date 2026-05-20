import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { BarChart as BarIcon, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Reports = () => {
  const [reportData, setReportData] = useState(null);

  const fetchStats = async () => {
    const res = await api.get('/reports');
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['reportsStats'],
    queryFn: fetchStats
  });

  useEffect(() => {
    if (data) setReportData(data);
  }, [data]);

  if (isLoading || !reportData) return <div>Loading reports...</div>;

  const { wardOccupancy, monthlyAdmissions } = reportData;

  const pieData = wardOccupancy.map(w => ({ name: w.name, value: w.occupied }));

  const exportReport = () => {
    alert("Exporting report as PDF/CSV feature coming soon!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <BarIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Hospital Analytics & Reports</h2>
            <p className="text-sm text-gray-500">Comprehensive overview of hospital performance</p>
          </div>
        </div>
        <button onClick={exportReport} className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Admissions Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyAdmissions}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="admissions" stroke="#3b82f6" fillOpacity={0.3} fill="#3b82f6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Occupancy by Ward</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
