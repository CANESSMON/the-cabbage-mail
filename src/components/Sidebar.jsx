import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Send,
  Palette,
  Workflow,
  Users,
  Filter,
  FileText,
  BarChart3,
  ClipboardList,
  Settings,
  ShieldCheck,
  Key,
  UsersRound,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Building2,
  ChevronDown,
  Radio,
  LogOut,
  Mail,
  CheckCircle2
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'campaigns', label: 'Campaigns', icon: Send },
      { id: 'templates', label: 'Templates', icon: Palette },
      { id: 'automation', label: 'Automation', icon: Workflow },
    ],
  },
  {
    label: 'Audience',
    items: [
      { id: 'subscribers', label: 'Contacts', icon: Users },
      { id: 'segments', label: 'Lists', icon: Filter },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Settings',
    items: [
      { id: 'settings', label: 'Workspace', icon: Settings },
      { id: 'domain', label: 'Domain & Sending', icon: ShieldCheck },
      { id: 'team', label: 'Team', icon: UsersRound },
      { id: 'api-keys', label: 'API Keys', icon: Key },
      { id: 'billing', label: 'Billing', icon: CreditCard },
      { id: 'audit-log', label: 'Audit Log', icon: ClipboardList },
    ],
  },
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const { user, clients, activeClient, switchClient, signOut } = useAuth();
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-white/90 backdrop-blur-xl border-r border-slate-200/90 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[68px]' : 'w-[252px]'
      }`}
    >
      {/* Logo & Brand */}
      <div className="flex items-center h-16 px-4 border-b border-slate-200/80 shrink-0">
        <div className="flex items-center space-x-3 cursor-pointer min-w-0" onClick={() => setActiveTab('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            <Mail className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-heading font-extrabold text-sm text-slate-950 tracking-tight block leading-none truncate">
                EmailBhejo
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block mt-0.5">
                Email Marketing
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Workspace Selector */}
      {user && !collapsed && (
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="relative">
            <button
              onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
              className="w-full flex items-center justify-between bg-slate-100/80 border border-slate-200/90 hover:bg-slate-200/50 px-3 py-2 rounded-lg text-xs transition-colors"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <Building2 className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                <span className="font-semibold text-slate-950 truncate text-[12px]">
                  {activeClient?.name || 'Select Workspace'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform ${clientDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {clientDropdownOpen && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1.5 animate-in fade-in duration-100">
                <div className="text-[9px] uppercase font-semibold text-slate-500 px-2 py-1 tracking-wider">
                  Workspaces ({clients.length})
                </div>
                <div className="space-y-0.5 max-h-36 overflow-y-auto">
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => {
                        switchClient(client.id);
                        setClientDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] flex items-center justify-between transition-colors ${
                        activeClient?.id === client.id
                          ? 'bg-slate-950 text-white font-semibold'
                          : 'text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{client.name}</span>
                      {activeClient?.id === client.id && (
                        <CheckCircle2 className="w-3 h-3 text-white shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <div className="text-[9px] uppercase font-bold text-slate-400 px-2.5 mb-1.5 tracking-wider">
                {section.label}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center rounded-lg text-[12px] font-medium transition-all duration-150 group relative ${
                      collapsed ? 'justify-center px-2 py-2.5' : 'px-2.5 py-2 space-x-2.5'
                    } ${
                      isActive
                        ? 'bg-black text-white shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div className="border-t border-slate-200/80 p-2 space-y-1.5 shrink-0 bg-slate-50/50">
        {/* AWS Status */}
        {!collapsed && (
          <div className="flex items-center space-x-2 px-2.5 py-1.5 bg-white border border-slate-200/80 rounded-lg shadow-2xs">
            <Radio className="w-3.5 h-3.5 text-slate-900" />
            <span className="text-[10px] font-mono font-medium text-slate-900">AWS SES Active</span>
          </div>
        )}

        {/* User Profile & Logout */}
        {user && (
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-2 py-1.5`}>
            {!collapsed && (
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-950 truncate">{user.name}</div>
                  <div className="text-[9px] text-slate-500 truncate">{user.email}</div>
                </div>
              </div>
            )}
            <button
              onClick={signOut}
              title="Sign Out"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}

