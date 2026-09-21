import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Users, 
  Send, 
  CheckCircle2, 
  Building2, 
  ArrowUpRight, 
  Radio, 
  Sparkles,
  Zap,
  Mail
} from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  const { user, activeClient, subscribers, campaigns } = useAuth();

  const activeSubscribers = subscribers.filter(s => s.status === 'ACTIVE').length;
  const totalCampaigns = campaigns.length;
  const totalEmailsSent = campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Client Workspace</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-slate-100 tracking-tight">
              {activeClient ? activeClient.name : 'Welcome to The Cabbage Mail'}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Dispatch email marketing campaigns backed by AWS SNS cloud delivery. Connected to{' '}
              <span className="font-mono text-emerald-400 font-semibold">{activeClient?.senderEmail || 'sender@domain.com'}</span>.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={() => setActiveTab('composer')} className="gap-2 shadow-lg shadow-emerald-950">
              <Send className="w-4 h-4" />
              <span>Compose Campaign</span>
            </Button>
            <Button variant="outline" onClick={() => setActiveTab('subscribers')} className="gap-2">
              <Users className="w-4 h-4" />
              <span>Manage Contacts</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:border-slate-700 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Workspace</CardTitle>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-heading text-slate-100 truncate">
              {activeClient ? activeClient.name : 'None Selected'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono truncate">
              {activeClient?.awsRegion || 'us-east-1'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-700 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Subscribers</CardTitle>
            <Users className="w-4 h-4 text-teal-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-slate-100">
              {activeSubscribers}
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" /> Ready for dispatch
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-700 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Campaigns Launched</CardTitle>
            <Send className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-slate-100">
              {totalCampaigns}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Total workspace broadcasts</p>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-700 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Emails Sent</CardTitle>
            <Zap className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-slate-100">
              {totalEmailsSent}
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 font-mono">100% AWS SNS Delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Sections: Recent Campaigns & AWS SNS Topic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Campaigns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Recent Email Campaigns</span>
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab('composer')} className="text-xs text-emerald-400">
              New Campaign <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {campaigns.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">No email campaigns created yet for this client.</p>
                <Button size="sm" onClick={() => setActiveTab('composer')} className="mt-4 gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Compose First Campaign
                </Button>
              </Card>
            ) : (
              campaigns.map((camp) => (
                <Card key={camp.id} className="p-4 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-100 text-sm font-heading">{camp.subject}</span>
                      <Badge variant="default" className="text-[10px]">{camp.status}</Badge>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center space-x-3">
                      <span>Sender: <strong className="text-slate-300 font-normal">{camp.senderEmail}</strong></span>
                      <span>•</span>
                      <span>Sent: {new Date(camp.sentAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-xs text-right">
                    <div>
                      <div className="text-slate-400 font-medium">Recipients</div>
                      <div className="font-bold text-slate-200">{camp.sentCount}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">AWS Message ID</div>
                      <div className="font-mono text-emerald-400 text-[11px] truncate max-w-[120px]">
                        {camp.awsMessageId}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: AWS Infrastructure Status */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>AWS SNS Connection</span>
          </h2>

          <Card className="p-5 space-y-4 border-emerald-500/20 bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">AWS Topic Status</span>
              <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Configured AWS Region</span>
                <span className="font-mono text-slate-200 font-semibold">{activeClient?.awsRegion || 'us-east-1'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Target Topic ARN</span>
                <span className="font-mono text-[11px] text-slate-300 break-all bg-slate-950/80 p-2 rounded border border-slate-800 block">
                  {activeClient?.awsTopicArn || 'arn:aws:sns:us-east-1:123456789012:DefaultTopic'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Sender Identity</span>
                <span className="text-slate-200 font-medium">{activeClient?.senderName} &lt;{activeClient?.senderEmail}&gt;</span>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={() => setActiveTab('settings')} className="w-full text-xs gap-1.5">
              Edit Connection Settings
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
}
