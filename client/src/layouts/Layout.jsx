import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bed, UserPlus, UserMinus, BarChart3, LogOut, Bell, Menu, X, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Bed Management', path: '/beds', icon: Bed },
    { name: 'Admissions', path: '/admissions', icon: UserPlus },
    { name: 'Discharge', path: '/discharge', icon: UserMinus },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Doctors', path: '/doctors', icon: Stethoscope },
  ];

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f1f5f9' }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-border flex flex-col transform transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-14 flex items-center px-5 border-b border-border gap-3 shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bed className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-text-primary leading-none">Hospital Bed</h1>
            <p className="text-[10px] text-text-muted font-medium">Management</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-text-muted"><X size={18} /></button>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${active ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'text-text-secondary hover:bg-primary-50 hover:text-primary'}`}>
                <Icon size={17} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-2.5 border-t border-border shrink-0">
          <p className="text-[9px] uppercase tracking-widest text-text-muted font-semibold mb-1.5">Role</p>
          <div className="flex items-center gap-2.5 px-2.5 py-1.5 bg-primary-50 rounded-lg">
            <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-[10px] font-bold">{user?.name?.charAt(0) || 'A'}</div>
            <p className="text-xs font-semibold text-primary-800">{user?.role || 'Administrator'}</p>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{user?.name?.charAt(0) || 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-text-muted truncate">{user?.email || ''}</p>
            </div>
            <button onClick={logout} className="p-1.5 text-text-muted hover:text-danger hover:bg-danger-bg rounded-lg transition-colors" title="Logout">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 text-text-secondary hover:bg-gray-100 rounded-lg"><Menu size={18} /></button>
            <h2 className="text-base font-bold text-text-primary">{navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-1.5 text-text-secondary hover:bg-primary-50 hover:text-primary rounded-lg transition-colors">
              <Bell size={17} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-danger rounded-full animate-pulse-dot"></span>
            </button>
            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-text-primary">{dateStr}</p>
              <p className="text-[10px] text-text-muted">{timeStr}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-5">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
