import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import AppHeader from './components/AppHeader';
import Dashboard from './components/Dashboard';
import SubscriberManager from './components/SubscriberManager';
import CampaignComposer from './components/CampaignComposer';
import SettingsManager from './components/SettingsManager';
import SignUpModal from './components/Auth/SignUpModal';
import SignInModal from './components/Auth/SignInModal';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';
import {
  Sparkles, Radio, Send, Users, ShieldCheck, BarChart3,
  Workflow, Palette, Filter, FileText, Key, UsersRound,
  CreditCard, ClipboardList, Building2
} from 'lucide-react';

/* ──────────────────────────────────────────────
   Placeholder pages for features not yet built.
   These will be replaced as we build each phase.
   ────────────────────────────────────────────── */

function PlaceholderPage({ icon: Icon, title, description, comingSoonItems = [] }) {
  return (
    <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h1 className="text-2xl font-extrabold font-heading text-slate-100 tracking-tight">{title}</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">{description}</p>
      </div>
      {comingSoonItems.length > 0 && (
        <Card className="p-6 text-left space-y-3 max-w-md mx-auto">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">What's Coming</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {comingSoonItems.map((item, i) => (
              <li key={i} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Badge variant="secondary" className="text-[10px] px-3 py-1">Building in Progress</Badge>
    </div>
  );
}

function CampaignHistoryPage() {
  return <PlaceholderPage icon={ClipboardList} title="Campaign History" description="Full campaign archive with drill-down delivery stats per recipient." comingSoonItems={['Filter by status, date range, client', 'Per-recipient delivery timeline', 'Resend to failed recipients', 'Export campaign report']} />;
}
function TemplatesPage() {
  return <PlaceholderPage icon={Palette} title="Email Templates" description="Visual block-based email builder and pre-built template gallery." comingSoonItems={['Drag-and-drop block builder', '7 pre-built templates (Welcome, Newsletter, Flash Sale...)', 'Save & reuse custom templates', 'Export to HTML']} />;
}
function AutomationPage() {
  return <PlaceholderPage icon={Workflow} title="Automation Workflows" description="Build trigger-based email sequences with a visual node editor." comingSoonItems={['Trigger nodes: New Subscriber, Tag Added, Date-Based', 'Action nodes: Send Email, Add Tag, Move Segment', 'Timing: Wait hours/days, Wait Until date', 'Pre-built: Welcome Series, Re-Engagement, Birthday']} />;
}
function SegmentsPage() {
  return <PlaceholderPage icon={Filter} title="Audience Segments" description="Build dynamic audience segments with rule-based conditions." comingSoonItems={['Tag equals, Subscription date, Email domain', 'Engagement score above/below threshold', 'Campaign opened / not opened', 'AND/OR condition groups with live count']} />;
}
function FormsPage() {
  return <PlaceholderPage icon={FileText} title="Signup Forms" description="Create embeddable email capture forms for your website." comingSoonItems={['Custom field selection & color theming', 'Generate <script> embed code', 'Connect to subscriber list on submit', 'Popup and inline form modes']} />;
}
function AnalyticsPage() {
  return <PlaceholderPage icon={BarChart3} title="Analytics & Insights" description="Deep campaign performance analytics with charts and breakdowns." comingSoonItems={['Open / Click / Bounce / Unsubscribe rates', 'Time-series performance charts', 'Top campaigns leaderboard', 'Subscriber growth over time', 'Device & geographic breakdown']} />;
}
function AuditLogPage() {
  return <PlaceholderPage icon={ClipboardList} title="Audit Log" description="Complete activity history across your workspace." comingSoonItems={['Campaign sent, Subscriber imported, Domain verified', 'Settings changed, Team member invited', 'Filter by action type and date', 'Actor attribution per event']} />;
}
function DomainPage({ setActiveTab }) {
  return <SettingsManager />;
}
function ApiKeysPage() {
  return <PlaceholderPage icon={Key} title="API Keys" description="Generate and manage API keys for programmatic access." comingSoonItems={['Generate new API keys with scoped permissions', 'Masked key display with copy-to-clipboard', 'Revoke keys, track last used date', 'cURL and SDK code examples']} />;
}
function TeamPage() {
  return <PlaceholderPage icon={UsersRound} title="Team Management" description="Invite team members and assign role-based access." comingSoonItems={['Roles: Owner, Admin, Editor, Viewer', 'Invite via email with role assignment', 'Member list with last active timestamp', 'Permission matrix per role']} />;
}
function BillingPage() {
  return <PlaceholderPage icon={CreditCard} title="Billing & Plans" description="Manage your subscription plan and track email usage." comingSoonItems={['Plans: Free (1K), Growth ($29 — 25K), Pro ($79 — 100K)', 'Real-time usage meter with quota bar', 'Billing history & invoices', 'Upgrade / downgrade with proration']} />;
}


/* ──────────────────────────────────────────────
   Main App Layout
   ────────────────────────────────────────────── */

function AuthenticatedLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':       return <Dashboard setActiveTab={setActiveTab} />;
      case 'composer':        return <CampaignComposer setActiveTab={setActiveTab} />;
      case 'campaign-history': return <CampaignHistoryPage />;
      case 'templates':       return <TemplatesPage />;
      case 'automation':      return <AutomationPage />;
      case 'subscribers':     return <SubscriberManager />;
      case 'segments':        return <SegmentsPage />;
      case 'forms':           return <FormsPage />;
      case 'analytics':       return <AnalyticsPage />;
      case 'audit-log':       return <AuditLogPage />;
      case 'settings':        return <SettingsManager />;
      case 'domain':          return <DomainPage setActiveTab={setActiveTab} />;
      case 'api-keys':        return <ApiKeysPage />;
      case 'team':            return <TeamPage />;
      case 'billing':         return <BillingPage />;
      default:                return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
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
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Minimal Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-xl shadow-lg shadow-emerald-950/40">
              🥬
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-slate-100 tracking-tight block leading-tight">The Cabbage Mail</span>
              <span className="text-[9px] text-emerald-400 font-mono tracking-wider uppercase block">Email Marketing Platform</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowSignIn(true)}>Sign In</Button>
            <Button size="sm" onClick={() => setShowSignUp(true)} className="gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto py-20 px-6 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Full-Featured Email Marketing Platform</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold font-heading text-slate-100 tracking-tight leading-[1.1]">
          Email Marketing<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
            Powered by AWS
          </span>
        </h1>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Build campaigns with a visual template editor, automate drip sequences, segment your audience, and deliver at scale through AWS SNS — all from one dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button size="lg" onClick={() => setShowSignUp(true)} className="w-full sm:w-auto text-base gap-2 px-10 py-6 shadow-xl shadow-emerald-950">
            <Sparkles className="w-5 h-5" />
            Start Free — No Credit Card
          </Button>
          <Button size="lg" variant="outline" onClick={() => setShowSignIn(true)} className="w-full sm:w-auto text-base px-10 py-6">
            Sign In to Demo
          </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-16 text-left">
          {[
            { icon: Palette, title: 'Visual Template Builder', desc: 'Drag-and-drop block editor with 7+ pre-built templates.' },
            { icon: Workflow, title: 'Automation Flows', desc: 'Welcome series, re-engagement, and birthday drip sequences.' },
            { icon: BarChart3, title: 'Deep Analytics', desc: 'Open rates, click tracking, bounce monitoring, and growth charts.' },
            { icon: ShieldCheck, title: 'Enterprise Trust', desc: 'SPF, DKIM, DMARC verification with pre-send spam scoring.' },
            { icon: Filter, title: 'Smart Segmentation', desc: 'Tag-based and behavioral audience segments with live counts.' },
            { icon: Radio, title: 'AWS SNS Delivery', desc: 'Cloud-native delivery infrastructure. Zero mail server maintenance.' },
            { icon: Users, title: 'Multi-Workspace', desc: 'Isolated client workspaces with independent audiences and settings.' },
            { icon: Key, title: 'API & Webhooks', desc: 'Programmatic access with scoped API keys and event hooks.' },
          ].map((f, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <f.icon className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-sm text-slate-100 font-heading">{f.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 text-center flex items-center justify-between">
          <span>🥬 <strong>The Cabbage Mail</strong> — Full-Featured Email Marketing Platform</span>
          <span className="font-mono text-emerald-400">AWS SNS Powered</span>
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
