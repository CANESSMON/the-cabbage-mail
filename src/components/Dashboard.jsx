import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Users, Send, CheckCircle2, Building2, ArrowUpRight, Radio,
  Sparkles, Zap, Mail, BarChart3, MousePointer, AlertTriangle,
  UserMinus, TrendingUp, Clock, Plus, Palette, Workflow
} from 'lucide-react';

/* Simple CSS bar chart component */
function MiniBarChart({ data = [], color = 'bg-emerald-500', height = 40 }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end space-x-[3px]" style={{ height }}>
      {data.map((val, i) => (
        <div
          key={i}
          className={`${color} rounded-t-sm opacity-80 hover:opacity-100 transition-opacity flex-1 min-w-[4px]`}
          style={{ height: `${(val / max) * 100}%` }}
          title={`${val}`}
        />
      ))}
    </div>
  );
}

export default function Dashboard({ setActiveTab }) {
  const { user, activeClient, subscribers, campaigns, clients } = useAuth();

  const activeSubscribers = subscribers.filter(s => s.status === 'ACTIVE').length;
  const totalCampaigns = campaigns.length;
  const totalEmailsSent = campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0);

  // Simulated analytics
  const openRate = totalCampaigns > 0 ? 68.4 : 0;
  const clickRate = totalCampaigns > 0 ? 12.7 : 0;
  const bounceRate = totalCampaigns > 0 ? 1.2 : 0;
  const unsubRate = totalCampaigns > 0 ? 0.3 : 0;

  // Simulated weekly send data for sparkline
  const weeklyData = [12, 28, 18, 45, 32, 55, totalEmailsSent || 3];
  const subscriberGrowth = [5, 8, 3, 12, 7, 15, activeSubscribers || 4];

  // Recent activity feed
  const recentActivity = [
    { action: 'Campaign sent', detail: campaigns[0]?.subject || 'Welcome Newsletter', time: '2 hours ago', icon: Send, color: 'text-emerald-400' },
    { action: 'Subscriber imported', detail: `${activeSubscribers} contacts via CSV`, time: '5 hours ago', icon: Users, color: 'text-teal-400' },
    { action: 'Domain verified', detail: `${activeClient?.senderEmail?.split('@')[1] || 'domain.com'} — SPF, DKIM, DMARC`, time: '1 day ago', icon: CheckCircle2, color: 'text-indigo-400' },
    { action: 'Workspace created', detail: activeClient?.name || 'Workspace', time: '2 days ago', icon: Building2, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/20 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-xl md:text-2xl font-extrabold font-heading text-slate-100 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              Active workspace: <strong className="text-emerald-400">{activeClient?.name}</strong> — dispatching via{' '}
              <span className="font-mono text-emerald-400">{activeClient?.awsRegion || 'us-east-1'}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={() => setActiveTab('composer')} className="gap-1.5 shadow-lg shadow-emerald-950">
              <Send className="w-3.5 h-3.5" />
              <span>New Campaign</span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => setActiveTab('templates')} className="gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              <span>Templates</span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => setActiveTab('automation')} className="gap-1.5">
              <Workflow className="w-3.5 h-3.5" />
              <span>Automation</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-slate-700 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Open Rate</span>
              <BarChart3 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold font-heading text-slate-100">{openRate}%</div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-medium">+3.2% vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-700 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Click Rate</span>
              <MousePointer className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-extrabold font-heading text-slate-100">{clickRate}%</div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-medium">+1.8% vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-700 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Bounce Rate</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold font-heading text-slate-100">{bounceRate}%</div>
            <div className="flex items-center space-x-1 mt-1">
              <span className="text-[10px] text-slate-400 font-medium">Below 5% threshold ✓</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-700 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Unsubscribe</span>
              <UserMinus className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-extrabold font-heading text-slate-100">{unsubRate}%</div>
            <div className="flex items-center space-x-1 mt-1">
              <span className="text-[10px] text-slate-400 font-medium">Healthy range ✓</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sparkline Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Emails Sent</span>
              <span className="text-xl font-bold font-heading text-slate-100">{totalEmailsSent}</span>
            </div>
            <Badge variant="default" className="text-[9px]">This Week</Badge>
          </div>
          <MiniBarChart data={weeklyData} color="bg-emerald-500" height={48} />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Active Subscribers</span>
              <span className="text-xl font-bold font-heading text-slate-100">{activeSubscribers}</span>
            </div>
            <Badge variant="default" className="text-[9px]">Growth</Badge>
          </div>
          <MiniBarChart data={subscriberGrowth} color="bg-teal-500" height={48} />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Campaigns</span>
              <span className="text-xl font-bold font-heading text-slate-100">{totalCampaigns}</span>
            </div>
            <Badge variant="default" className="text-[9px]">{clients.length} Workspaces</Badge>
          </div>
          <MiniBarChart data={[2, 5, 1, 8, 3, totalCampaigns || 1, 4]} color="bg-indigo-500" height={48} />
        </Card>
      </div>

      {/* Bottom Section: Recent Campaigns + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Campaigns — 3 cols */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Recent Campaigns</span>
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab('campaign-history')} className="text-[11px] text-emerald-400 h-7">
              View All <ArrowUpRight className="w-3 h-3 ml-1" />
            </Button>
          </div>

          {campaigns.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">No campaigns yet.</p>
              <Button size="sm" onClick={() => setActiveTab('composer')} className="mt-3 gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Create First Campaign
              </Button>
            </Card>
          ) : (
            campaigns.slice(0, 4).map((camp) => (
              <Card key={camp.id} className="p-4 hover:border-slate-700 transition-all flex items-center justify-between gap-4">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-100 text-xs truncate">{camp.subject}</span>
                    <Badge variant="default" className="text-[9px] shrink-0">{camp.status}</Badge>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                    <span>{camp.senderEmail}</span>
                    <span>•</span>
                    <span>{new Date(camp.sentAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-200">{camp.sentCount} sent</div>
                  <div className="text-[10px] text-emerald-400 font-mono truncate max-w-[100px]">{camp.awsMessageId?.slice(0, 16)}...</div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Activity Feed — 2 cols */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Recent Activity</span>
          </h2>
          <Card className="p-4 space-y-0 divide-y divide-slate-800/60">
            {recentActivity.map((event, i) => (
              <div key={i} className="flex items-start space-x-3 py-3 first:pt-0 last:pb-0">
                <div className={`w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 ${event.color}`}>
                  <event.icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="text-[11px] font-semibold text-slate-200">{event.action}</div>
                  <div className="text-[10px] text-slate-400 truncate">{event.detail}</div>
                  <div className="text-[9px] text-slate-500">{event.time}</div>
                </div>
              </div>
            ))}
          </Card>

          {/* Quick Actions */}
          <Card className="p-4 space-y-2 border-emerald-500/20 bg-emerald-950/20">
            <h3 className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-1.5">
              <Button variant="outline" size="sm" onClick={() => setActiveTab('subscribers')} className="w-full justify-start gap-2 text-[11px] h-8">
                <Users className="w-3.5 h-3.5 text-teal-400" /> Import Subscribers
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('templates')} className="w-full justify-start gap-2 text-[11px] h-8">
                <Palette className="w-3.5 h-3.5 text-indigo-400" /> Build Email Template
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('automation')} className="w-full justify-start gap-2 text-[11px] h-8">
                <Workflow className="w-3.5 h-3.5 text-purple-400" /> Create Automation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
