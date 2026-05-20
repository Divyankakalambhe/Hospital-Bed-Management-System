import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Building2, Mail, Lock, User } from 'lucide-react';

const Login = () => {
  const [hospital, setHospital] = useState('City Care Hospital');
  const [email, setEmail] = useState('admin@smartbed.com');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('Admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const roles = ['Admin', 'Doctor', 'Nurse'];

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Panel — Dark Hero */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-16 xl:px-24" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
        <div className="max-w-lg">
          <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Real-time Hospital<br />Bed
          </h1>
          <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight" style={{ color: '#38bdf8' }}>
            Management
          </h1>
          <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight">
            System
          </h1>

          <p className="mt-8 text-gray-400 text-base leading-relaxed max-w-md">
            Empower hospital administrators, doctors, and nurses with a centralized, responsive dashboard to monitor live bed availability across wards. Free occupied beds automatically after discharge.
          </p>

          <div className="flex gap-6 mt-10">
            <div className="px-6 py-4 rounded-xl" style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
              <p className="text-3xl font-extrabold text-white">100%</p>
              <p className="text-xs text-gray-500 mt-1">Real-time sync</p>
            </div>
            <div className="px-6 py-4 rounded-xl" style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
              <p className="text-3xl font-extrabold" style={{ color: '#38bdf8' }}>&lt;1s</p>
              <p className="text-xs text-gray-500 mt-1">Latency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Card */}
      <div className="flex-1 lg:flex-none lg:w-[460px] flex items-center justify-center" style={{ background: '#f1f5f9' }}>
        <div className="w-full max-w-sm px-6 animate-fade-in">
          {/* Hospital Image */}
          <div className="rounded-xl overflow-hidden mb-5 shadow-lg">
            <img src="/hospital-bed.png" alt="Hospital" className="w-full h-32 object-cover" />
          </div>

          <div className="text-center mb-5">
            <h2 className="text-xl font-bold text-text-primary">Staff Login</h2>
            <p className="text-[11px] text-text-muted mt-1">Access the Bed Allocation & Reports Panel</p>
          </div>

          {error && (
            <div className="mb-3 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.15)' }}>
              {error}
            </div>
          )}

          {/* Demo hint */}
          <div className="mb-4 px-3 py-2 rounded-lg text-[11px]" style={{ background: 'rgba(26,86,219,0.06)', border: '1px solid rgba(26,86,219,0.12)', color: '#1a56db' }}>
            <span className="font-bold">Demo:</span> admin@smartbed.com &nbsp;/&nbsp; admin123
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Hospital */}
            <div>
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Hospital</label>
              <div className="relative">
                <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="text" value={hospital} onChange={(e) => setHospital(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Email</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-md shadow-primary/20 mt-1 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg active:scale-[0.99]'}`}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
