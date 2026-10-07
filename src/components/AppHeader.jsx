import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Bell,
  ChevronRight,
  LogOut,
  Settings,
  User,
  Building2,
} from 'lucide-react';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  campaigns: 'Campaigns',
  templates: 'Email Templates',
  automation: 'Automation Workflows',
  subscribers: 'Contacts',
  segments: 'Contact Lists',
  forms: 'Signup Forms',
  analytics: 'Analytics & Insights',
  'audit-log': 'Audit Log',
  settings: 'Workspace Settings',
  domain: 'Domain & DNS Authentication',
  'api-keys': 'API Keys',
  team: 'Team Management',
  billing: 'Billing & Plans',
};

export default function AppHeader({ activeTab, setActiveTab }) {
  const { user, activeClient, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pageTitle = PAGE_TITLES[activeTab] || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-xl border-b border-slate-200/90 flex items-center justify-between px-6">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs min-w-0">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-slate-500 hover:text-slate-900 font-medium transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <span className="font-semibold text-slate-950 truncate">{pageTitle}</span>
      </div>

      {/* Right: Search, Notifications, User */}
      <div className="flex items-center space-x-3">
        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search campaigns, subscribers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-60 bg-slate-100/70 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full border border-white" />
        </button>

        {/* User Avatar & Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 bg-slate-100/80 border border-slate-200/90 hover:bg-slate-200/50 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-950 hidden sm:block max-w-[100px] truncate">
                {user.name}
              </span>
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1.5 animate-in fade-in duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <div className="text-xs font-bold text-slate-950">{user.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                  </div>
                  <button
                    onClick={() => { setActiveTab('settings'); setShowUserMenu(false); }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Workspace Settings</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('team'); setShowUserMenu(false); }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Team & Roles</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('billing'); setShowUserMenu(false); }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Billing & Plans</span>
                  </button>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => { signOut(); setShowUserMenu(false); }}
                      className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

