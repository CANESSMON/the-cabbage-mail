import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SubscriberManager from './components/SubscriberManager';
import CampaignComposer from './components/CampaignComposer';
import SettingsManager from './components/SettingsManager';
import SignUpModal from './components/Auth/SignUpModal';
import SignInModal from './components/Auth/SignInModal';
import { Button } from './components/ui/button';
import { Sparkles, Radio, CheckCircle2, ShieldCheck, Mail, Send, Users } from 'lucide-react';

function MainLayout() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          /* Landing Hero for Unauthenticated Visitors */
          <div className="max-w-4xl mx-auto py-12 text-center space-y-8 animate-in fade-in duration-300">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Multi-Client AWS SNS Email Marketing</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-slate-100 tracking-tight leading-tight">
              Scale Email Campaigns with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">AWS SNS Power</span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Minimal, intuitive, and modern email marketing platform. Self-service onboarding for business owners to manage multiple clients, subscriber lists, and AWS SNS email dispatch.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" onClick={() => setShowSignUp(true)} className="w-full sm:w-auto text-base gap-2 px-8 py-6 shadow-xl shadow-emerald-950">
                <Sparkles className="w-5 h-5" />
                Sign Up & Launch Free
              </Button>
              <Button size="lg" variant="outline" onClick={() => setShowSignIn(true)} className="w-full sm:w-auto text-base px-8 py-6">
                Sign In to Demo Workspace
              </Button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-100 font-heading">AWS SNS Delivery</h3>
                <p className="text-xs text-slate-400">Direct integration with Amazon SNS & SES infrastructure. Zero mail server maintenance.</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-100 font-heading">Multi-Client Workspaces</h3>
                <p className="text-xs text-slate-400">Self-service client account creation with isolated contact lists and sender identities.</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Send className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-100 font-heading">Personalized Campaigns</h3>
                <p className="text-xs text-slate-400">WYSIWYG HTML editor with JetBrains Mono merge tag chips (`&#123;&#123;first_name&#125;&#125;`).</p>
              </div>
            </div>

            {/* Modals for Unauthenticated landing */}
            <SignUpModal
              isOpen={showSignUp}
              onClose={() => setShowSignUp(false)}
              onSwitchToSignIn={() => {
                setShowSignUp(false);
                setShowSignIn(true);
              }}
            />
            <SignInModal
              isOpen={showSignIn}
              onClose={() => setShowSignIn(false)}
              onSwitchToSignUp={() => {
                setShowSignIn(false);
                setShowSignUp(true);
              }}
            />
          </div>
        ) : (
          /* Authenticated Dashboard Tabs */
          <>
            {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
            {activeTab === 'subscribers' && <SubscriberManager />}
            {activeTab === 'composer' && <CampaignComposer setActiveTab={setActiveTab} />}
            {activeTab === 'settings' && <SettingsManager />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span>🥬 <strong>The Cabbage Mail</strong> — Self-Service Multi-Client Email Marketing</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-mono text-emerald-400">AWS SNS Powered</span>
            <span>•</span>
            <span>Shadcn UI + Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
