import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import AppHeader from './components/AppHeader';
import Dashboard from './components/Dashboard';
import SubscriberManager from './components/SubscriberManager';
import CampaignComposer from './components/CampaignComposer';
import SettingsManager from './components/SettingsManager';
import TemplateGallery from './components/TemplateGallery';
import CampaignHistory from './components/CampaignHistory';
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
      case 'dashboard':        return <Dashboard setActiveTab={setActiveTab} />;
      case 'composer':         return <CampaignComposer setActiveTab={setActiveTab} />;
      case 'campaign-history': return <CampaignHistory />;
      case 'templates':        return <TemplateGallery />;
      case 'automation':       return <AutomationBuilder />;
      case 'subscribers':      return <SubscriberManager />;
      case 'segments':         return <SegmentBuilder />;
      case 'forms':            return <FormBuilder />;
      case 'analytics':        return <AnalyticsDashboard />;
      case 'audit-log':        return <AuditLog />;
      case 'settings':         return <SettingsManager />;
      case 'domain':           return <SettingsManager />;
      case 'api-keys':         return <ApiKeysManager />;
      case 'team':             return <TeamManager />;
      case 'billing':          return <BillingManager />;
      default:                 return <Dashboard setActiveTab={setActiveTab} />;
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
        className={`transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'ml-[68px]' : 'ml-[252px]'
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
              <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block mt-0.5">Email Marketing Infrastructure</span>
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
      <div className="max-w-5xl mx-auto py-24 px-6 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-800 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-slate-900" />
          <span>AWS SES Powered Infrastructure</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold font-heading text-slate-950 tracking-tight leading-[1.08]">
          Clean, Minimalist<br />
          <span className="text-slate-900 underline decoration-slate-300 decoration-wavy underline-offset-8">
            Email Marketing
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Build campaigns with a visual block editor, automate drip workflows, segment your contacts, and achieve high deliverability with native AWS SES integration.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button size="lg" onClick={() => setShowSignUp(true)} className="w-full sm:w-auto text-sm bg-black hover:bg-slate-800 text-white gap-2 px-8 py-5 font-semibold shadow-md">
            <span>Start Building Free</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => setShowSignIn(true)} className="w-full sm:w-auto text-sm border-slate-300 bg-white hover:bg-slate-100 text-slate-900 px-8 py-5 font-semibold shadow-xs">
            Sign In to Console
          </Button>
        </div>

        {/* Feature Grid - Solid White Cards on Glass Grey Background */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-16 text-left">
          {[
            { icon: Palette, title: 'Visual Template Builder', desc: 'Drag-and-drop block editor with responsive HTML components.' },
            { icon: Workflow, title: 'Automation Flows', desc: 'Trigger welcome drips, re-engagements, and event flows.' },
            { icon: BarChart3, title: 'Analytics & Tracking', desc: 'Open rates, click maps, bounce rates, and subscriber stats.' },
            { icon: ShieldCheck, title: 'Deliverability Controls', desc: 'DKIM, SPF, DMARC validation with real-time spam scoring.' },
            { icon: Filter, title: 'Smart Audience Rules', desc: 'Tag-based rules, dynamic segments, and opt-in lists.' },
            { icon: Radio, title: 'AWS SES Delivery', desc: 'High-throughput cloud mail server infrastructure.' },
            { icon: Users, title: 'Multi-Workspace', desc: 'Isolated client accounts, teams, and API keys.' },
            { icon: Key, title: 'API & Webhooks', desc: 'Developer access with REST endpoints and signature hooks.' },
          ].map((f, i) => (
            <div key={i} className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
                <f.icon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-950 font-heading">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <span className="font-medium text-slate-900">EmailBhejo &mdash; Minimalist Email Platform</span>
          <span className="font-mono text-slate-600 text-[11px]">AWS SES Enterprise</span>
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

