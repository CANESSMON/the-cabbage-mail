import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Building2, 
  ChevronDown, 
  Plus, 
  User, 
  LogOut, 
  Radio, 
  Sparkles,
  Layers,
  BarChart3,
  Users,
  Send,
  Settings
} from 'lucide-react';
import SignUpModal from './Auth/SignUpModal';
import SignInModal from './Auth/SignInModal';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, clients, activeClient, switchClient, addClient, signOut } = useAuth();
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  // New Client Form state
  const [newClientName, setNewClientName] = useState('');
  const [newSenderName, setNewSenderName] = useState('');
  const [newSenderEmail, setNewSenderEmail] = useState('');
  const [newAwsTopic, setNewAwsTopic] = useState('');

  const handleCreateClient = (e) => {
    e.preventDefault();
    if (!newClientName || !newSenderEmail) return;
    addClient({
      name: newClientName,
      senderName: newSenderName || newClientName,
      senderEmail: newSenderEmail,
      awsTopicArn: newAwsTopic,
    });
    setNewClientName('');
    setNewSenderName('');
    setNewSenderEmail('');
    setNewAwsTopic('');
    setShowAddClientModal(false);
    setShowClientDropdown(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Logo */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-xl shadow-lg shadow-emerald-950/40">
                🥬
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg text-slate-100 tracking-tight block leading-tight">
                  The Cabbage Mail
                </span>
                <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase block">
                  AWS SNS Delivery
                </span>
              </div>
            </div>

            {/* Client Workspace Selector */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowClientDropdown(!showClientDropdown)}
                  className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 transition-colors shadow-sm"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="max-w-[140px] truncate font-semibold text-slate-100">
                    {activeClient ? activeClient.name : 'Select Client'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {showClientDropdown && (
                  <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 animate-in fade-in duration-150">
                    <div className="text-[10px] uppercase font-semibold text-slate-400 px-2 py-1 tracking-wider">
                      Client Workspaces ({clients.length})
                    </div>
                    <div className="space-y-1 my-1 max-h-48 overflow-y-auto">
                      {clients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => {
                            switchClient(client.id);
                            setShowClientDropdown(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            activeClient?.id === client.id
                              ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate">{client.name}</span>
                          {activeClient?.id === client.id && (
                            <Badge variant="default" className="text-[9px] py-0 px-1.5">Active</Badge>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-slate-800 pt-1.5 mt-1">
                      <button
                        onClick={() => {
                          setShowAddClientModal(true);
                          setShowClientDropdown(false);
                        }}
                        className="w-full flex items-center justify-center space-x-1.5 px-2.5 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors font-medium"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Onboard New Client</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1 border border-slate-800/80 rounded-xl">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('subscribers')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'subscribers'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Subscribers</span>
              </button>
              <button
                onClick={() => setActiveTab('composer')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'composer'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Campaigns</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>AWS & Sender</span>
              </button>
            </nav>
          )}

          {/* User Auth Profile Controls */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono text-emerald-300">AWS SNS Ready</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-slate-200">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 px-2"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowSignInModal(true)}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => setShowSignUpModal(true)} className="gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Sign Up Free
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Onboard New Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 font-heading">Onboard New Client</h3>
            <p className="text-xs text-slate-400">
              Create an isolated client workspace for subscriber lists and AWS SNS topic routing.
            </p>
            <form onSubmit={handleCreateClient} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Client Organization Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Pixel Crafters Agency"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Sender Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pixel Crafters Team"
                  value={newSenderName}
                  onChange={(e) => setNewSenderName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Sender Email Address *</label>
                <input
                  type="email"
                  placeholder="hello@pixelcrafters.io"
                  value={newSenderEmail}
                  onChange={(e) => setNewSenderEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">AWS SNS Topic ARN (Optional)</label>
                <input
                  type="text"
                  placeholder="arn:aws:sns:us-east-1:123456789012:TopicName"
                  value={newAwsTopic}
                  onChange={(e) => setNewAwsTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddClientModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Create Workspace
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modals */}
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSwitchToSignIn={() => {
          setShowSignUpModal(false);
          setShowSignInModal(true);
        }}
      />

      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSwitchToSignUp={() => {
          setShowSignInModal(false);
          setShowSignUpModal(true);
        }}
      />
    </>
  );
}
