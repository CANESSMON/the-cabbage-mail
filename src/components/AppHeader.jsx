import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Search,
  Bell,
  ChevronRight,
  Sparkles,
  LogOut,
  Settings,
  User,
  Building2,
} from 'lucide-react';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  composer: 'Campaign Composer',
  'campaign-history': 'Campaign History',
  templates: 'Email Templates',
  automation: 'Automation Workflows',
  subscribers: 'Subscribers',
  segments: 'Audience Segments',
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
    <header className="sticky top-0 z-30 h-14 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between px-6">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm min-w-0">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-slate-500 hover:text-slate-300 text-xs transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
        <span className="font-semibold text-slate-200 truncate">{pageTitle}</span>
      </div>

      {/* Right: Search, Notifications, User */}
      <div className="flex items-center space-x-3">
        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search campaigns, contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56 bg-slate-900/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors">
          <Bell className="w-4 h-4" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border border-slate-950" />
        </button>

        {/* User Avatar & Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-[10px] font-bold text-white">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="text-[11px] font-medium text-slate-200 hidden sm:block max-w-[100px] truncate">
                {user.name}
              </span>
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-1.5 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-1.5 animate-in fade-in duration-100">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <div className="text-xs font-semibold text-slate-200">{user.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                  </div>
                  <button
                    onClick={() => { setActiveTab('settings'); setShowUserMenu(false); }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Workspace Settings</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('team'); setShowUserMenu(false); }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Team & Roles</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('billing'); setShowUserMenu(false); }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Billing & Plans</span>
                  </button>
                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={() => { signOut(); setShowUserMenu(false); }}
                      className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[11px] text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
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
