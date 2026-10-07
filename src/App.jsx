import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import AppHeader from './components/AppHeader';
import Dashboard from './components/Dashboard';
import SubscriberManager from './components/SubscriberManager';
import CampaignsPage from './components/CampaignsPage';
import SettingsManager from './components/SettingsManager';
import TemplateGallery from './components/TemplateGallery';
import AutomationBuilder from './components/AutomationBuilder';
import SegmentBuilder from './components/SegmentBuilder';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import FormBuilder from './components/FormBuilder';
import ApiKeysManager from './components/ApiKeysManager';
import TeamManager from './components/TeamManager';
import BillingManager from './components/BillingManager';
import AuditLog from './components/AuditLog';
import SignUpModal from './components/Auth/SignUpModal';
import SignInModal from './components/Auth/SignInModal';
import { Button } from './components/ui/button';
import {
  Sparkles, Radio, Send, Users, ShieldCheck, BarChart3,
  Workflow, Palette, Filter, Key, Mail, ArrowRight
} from 'lucide-react';

/* ──────────────────────────────────────────────
   Main App Layout
   ────────────────────────────────────────────── */

function AuthenticatedLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'campaigns': return <CampaignsPage setActiveTab={setActiveTab} />;
      case 'templates': return <TemplateGallery />;
      case 'automation': return <AutomationBuilder />;
      case 'subscribers': return <SubscriberManager />;
      case 'segments': return <SegmentBuilder />;
      case 'forms': return <FormBuilder />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'audit-log': return <AuditLog />;
      case 'settings': return <SettingsManager />;
      case 'domain': return <SettingsManager />;
      case 'api-keys': return <ApiKeysManager />;
      case 'team': return <TeamManager />;
      case 'billing': return <BillingManager />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-950 font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div
        className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'ml-[68px]' : 'ml-[252px]'
          }`}
      >
        <AppHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="p-6 max-w-[1400px] mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function UnauthenticatedLanding() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans selection:bg-slate-900 selection:text-white">
      {/* Glass Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-base text-slate-950 tracking-tight block leading-none">EmailBhejo</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setShowSignIn(true)} className="text-slate-700 hover:text-slate-950 font-medium">
              Sign In
            </Button>
            <Button size="sm" onClick={() => setShowSignUp(true)} className="bg-black hover:bg-slate-800 text-white font-medium gap-2 shadow-sm">
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto py-32 px-6 text-center space-y-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center font-bold shadow-md mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-6xl sm:text-8xl font-extrabold font-heading text-slate-950 tracking-tight leading-none">
          EmailBhejo
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button size="lg" onClick={() => setShowSignUp(true)} className="w-full sm:w-auto text-base bg-black hover:bg-slate-800 text-white gap-2 px-10 py-6 font-semibold shadow-md rounded-xl">
            <span>Sign Up</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => setShowSignIn(true)} className="w-full sm:w-auto text-base border-slate-300 bg-white hover:bg-slate-100 text-slate-900 px-10 py-6 font-semibold shadow-xs rounded-xl">
            Sign In
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <span className="font-medium text-slate-900">EmailBhejo &mdash; Minimalist Email Platform</span>
        </div>
      </footer>

      {/* Auth Modals */}
      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={() => { setShowSignUp(false); setShowSignIn(true); }}
      />
      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSwitchToSignUp={() => { setShowSignIn(false); setShowSignUp(true); }}
      />
    </div>
  );
}

function MainLayout() {
  const { user } = useAuth();
  return user ? <AuthenticatedLayout /> : <UnauthenticatedLanding />;
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

