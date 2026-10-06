import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ClipboardList, Search, Filter, Calendar, ChevronDown,
  Send, Eye, RotateCcw, Download, ArrowUpRight, CheckCircle2,
  XCircle, Clock, AlertTriangle
} from 'lucide-react';

const STATUS_COLORS = {
  SENT: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  DRAFT: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  SCHEDULED: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  SENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  FAILED: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
};

const STATUS_ICONS = {
  SENT: CheckCircle2,
  DRAFT: Clock,
  SCHEDULED: Calendar,
  SENDING: Send,
  FAILED: XCircle,
};

export default function CampaignHistory({ setActiveTab }) {
  const { campaigns, activeClient } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedCampaign, setExpandedCampaign] = useState(null);

  const allCampaigns = campaigns.length > 0 ? campaigns : [
    // Demo data if none exist
    { id: 'demo-1', subject: 'Welcome to The Cabbage Mail', senderEmail: 'hello@example.com', status: 'SENT', sentCount: 245, sentAt: new Date().toISOString(), awsMessageId: 'msg_abc123def456', recipients: [] },
    { id: 'demo-2', subject: 'September Newsletter', senderEmail: 'news@example.com', status: 'SENT', sentCount: 189, sentAt: new Date(Date.now() - 86400000).toISOString(), awsMessageId: 'msg_ghi789jkl012', recipients: [] },
    { id: 'demo-3', subject: 'Flash Sale — 48 Hours Only', senderEmail: 'promo@example.com', status: 'SCHEDULED', sentCount: 0, sentAt: new Date(Date.now() + 172800000).toISOString(), awsMessageId: null, recipients: [] },
  ];

  const statuses = ['All', 'SENT', 'SCHEDULED', 'DRAFT', 'SENDING', 'FAILED'];

  const filtered = allCampaigns.filter(c => {
    const matchesSearch = c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.senderEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSent = allCampaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0);
  const totalCampaigns = allCampaigns.length;
  const sentCampaigns = allCampaigns.filter(c => c.status === 'SENT').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-slate-100 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-emerald-400" />
            <span>Campaign History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {totalCampaigns} campaigns • {totalSent} total emails sent • {sentCampaigns} delivered
          </p>
        </div>
        <Button size="sm" onClick={() => setActiveTab?.('composer')} className="gap-1.5 shrink-0">
          <Send className="w-3.5 h-3.5" />
          New Campaign
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search by subject or sender..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="flex items-center space-x-1 overflow-x-auto">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {s === 'All' ? 'All Status' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign Table */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <ClipboardList className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No campaigns match your filters.</p>
          </Card>
        ) : (
          filtered.map((campaign) => {
            const StatusIcon = STATUS_ICONS[campaign.status] || Clock;
            const isExpanded = expandedCampaign === campaign.id;

            return (
              <Card key={campaign.id} className={`overflow-hidden transition-all ${isExpanded ? 'border-slate-700' : 'hover:border-slate-700'}`}>
                {/* Campaign Row */}
                <div
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedCampaign(isExpanded ? null : campaign.id)}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${STATUS_COLORS[campaign.status]?.split(' ')[0]}`}>
                      <StatusIcon className={`w-4 h-4 ${STATUS_COLORS[campaign.status]?.split(' ')[1]}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-slate-100 truncate">{campaign.subject}</span>
                        <Badge className={`text-[9px] shrink-0 ${STATUS_COLORS[campaign.status]}`}>{campaign.status}</Badge>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>{campaign.senderEmail}</span>
                        <span>•</span>
                        <span>{new Date(campaign.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-slate-200">{campaign.sentCount} sent</div>
                      <div className="text-[10px] text-slate-400 font-mono">{campaign.awsMessageId?.slice(0, 12) || '—'}...</div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded Drill-Down */}
                {isExpanded && (
                  <div className="border-t border-slate-800 p-4 bg-slate-900/40 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold font-heading text-emerald-400">68.4%</div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-wider">Open Rate</div>
                      </div>
                      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold font-heading text-teal-400">12.7%</div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-wider">Click Rate</div>
                      </div>
                      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold font-heading text-amber-400">1.2%</div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-wider">Bounce Rate</div>
                      </div>
                      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold font-heading text-rose-400">0.3%</div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-wider">Unsubs</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="text-[10px] h-7 gap-1">
                        <Eye className="w-3 h-3" /> View Email
                      </Button>
                      <Button variant="outline" size="sm" className="text-[10px] h-7 gap-1">
                        <RotateCcw className="w-3 h-3" /> Resend Failed
                      </Button>
                      <Button variant="outline" size="sm" className="text-[10px] h-7 gap-1">
                        <Download className="w-3 h-3" /> Export Report
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
