
import React from 'react';
import { User } from '../types';
import { MVSK_LOGO } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentView, onViewChange }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 flex items-center justify-center">
            <img 
              src={MVSK_LOGO} 
              alt="MVSK Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/initials/svg?seed=M&backgroundColor=6366f1";
              }}
            />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">MVSK</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Booking System</p>
          </div>
        </div>

        <nav className="flex-grow space-y-1">
          <NavItem 
            icon="🏠" 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={() => onViewChange('dashboard')} 
          />
          <NavItem 
            icon="📅" 
            label="My Bookings" 
            active={currentView === 'my-bookings'} 
            onClick={() => onViewChange('my-bookings')} 
          />
          <NavItem 
            icon="📊" 
            label="Usage Reports" 
            active={currentView === 'reports'} 
            onClick={() => onViewChange('reports')} 
          />
        </nav>

        {user && (
          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold border border-slate-600">
                {user.studentId.substring(0, 2)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">ID: {user.studentId}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full py-2 px-4 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
            >
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </button>
);

export default Layout;
