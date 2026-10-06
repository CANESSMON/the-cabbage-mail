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
  BarChart3,
  Users,
  Send,
  Settings,
  Mail
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
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Logo */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-base text-slate-950 tracking-tight block leading-none">
                  EmailBhejo
                </span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block mt-0.5">
                  AWS SES Delivery
                </span>
              </div>
            </div>

            {/* Client Workspace Selector */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowClientDropdown(!showClientDropdown)}
                  className="flex items-center space-x-2 bg-slate-100/80 border border-slate-200/90 hover:bg-slate-200/50 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 transition-colors shadow-2xs"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-900" />
                  <span className="max-w-[140px] truncate font-semibold text-slate-950">
                    {activeClient ? activeClient.name : 'Select Client'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {showClientDropdown && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 animate-in fade-in duration-150">
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
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
                              ? 'bg-black text-white font-semibold'
                              : 'text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate">{client.name}</span>
                          {activeClient?.id === client.id && (
                            <Badge variant="outline" className="text-[9px] py-0 px-1.5 border-slate-700 bg-slate-800 text-white">Active</Badge>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 pt-1.5 mt-1">
                      <button
                        onClick={() => {
                          setShowAddClientModal(true);
                          setShowClientDropdown(false);
                        }}
                        className="w-full flex items-center justify-center space-x-1.5 px-2.5 py-1.5 text-xs text-slate-900 hover:bg-slate-100 rounded-lg transition-colors font-semibold"
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
            <nav className="hidden md:flex items-center space-x-1 bg-slate-100/70 p-1 border border-slate-200 rounded-xl">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/50'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('subscribers')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'subscribers'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Subscribers</span>
              </button>
              <button
                onClick={() => setActiveTab('composer')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'composer'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/50'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Campaigns</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/50'
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
                <div className="hidden sm:flex items-center space-x-2 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                  <Radio className="w-3.5 h-3.5 text-slate-900" />
                  <span className="text-[11px] font-mono font-medium text-slate-900">AWS SES Active</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-950 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                  <User className="w-3.5 h-3.5 text-slate-900" />
                  <span className="font-semibold text-slate-950">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-slate-500 hover:text-slate-950 hover:bg-slate-100 h-8 px-2"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowSignInModal(true)} className="border-slate-300 text-slate-900">
                  Sign In
                </Button>
                <Button size="sm" onClick={() => setShowSignUpModal(true)} className="bg-black text-white hover:bg-slate-800 gap-1.5">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-slate-950 font-heading">Onboard New Client</h3>
            <p className="text-xs text-slate-500">
              Create an isolated client workspace for subscriber lists and AWS SES sender identity.
            </p>
            <form onSubmit={handleCreateClient} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Client Organization Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Pixel Crafters Agency"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-950 focus:outline-none focus:border-slate-900"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Sender Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pixel Crafters Team"
                  value={newSenderName}
                  onChange={(e) => setNewSenderName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-950 focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Sender Email Address *</label>
                <input
                  type="email"
                  placeholder="hello@pixelcrafters.io"
                  value={newSenderEmail}
                  onChange={(e) => setNewSenderEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-950 focus:outline-none focus:border-slate-900"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">AWS SNS Topic ARN (Optional)</label>
                <input
                  type="text"
                  placeholder="arn:aws:sns:us-east-1:123456789012:TopicName"
                  value={newAwsTopic}
                  onChange={(e) => setNewAwsTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-950 font-mono focus:outline-none focus:border-slate-900"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddClientModal(false)} className="border-slate-300 text-slate-700">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-black hover:bg-slate-800 text-white font-semibold">
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

