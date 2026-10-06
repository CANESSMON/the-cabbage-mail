import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ClipboardList, Search, Calendar, ChevronDown,
  Send, Eye, RotateCcw, Download, CheckCircle2,
  XCircle, Clock
} from 'lucide-react';

const STATUS_COLORS = {
  SENT: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
  SCHEDULED: 'bg-slate-100 text-slate-900 border-slate-200',
  SENDING: 'bg-amber-50 text-amber-800 border-amber-200',
  FAILED: 'bg-rose-50 text-rose-800 border-rose-200',
};

const STATUS_ICONS = {
  SENT: CheckCircle2,
  DRAFT: Clock,
  SCHEDULED: Calendar,
  SENDING: Send,
  FAILED: XCircle,
};

export default function CampaignHistory({ setActiveTab }) {
  const { campaigns } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedCampaign, setExpandedCampaign] = useState(null);

  const allCampaigns = campaigns.length > 0 ? campaigns : [
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
          <h1 className="text-2xl font-bold font-heading text-slate-950 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-slate-950" />
            <span>Campaign History</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {totalCampaigns} campaigns • {totalSent} total emails sent • {sentCampaigns} delivered
          </p>
        </div>
        <Button size="sm" onClick={() => setActiveTab?.('composer')} className="gap-1.5 shrink-0 bg-black text-white hover:bg-slate-800">
          <Send className="w-3.5 h-3.5" />
          New Campaign
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by subject or sender..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 shadow-sm"
          />
        </div>
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? 'bg-black text-white border border-black'
                  : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-100'
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
          <Card className="p-12 text-center border-dashed border-slate-200 bg-white">
            <ClipboardList className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No campaigns match your filters.</p>
          </Card>
        ) : (
          filtered.map((campaign) => {
            const StatusIcon = STATUS_ICONS[campaign.status] || Clock;
            const isExpanded = expandedCampaign === campaign.id;

            return (
              <Card key={campaign.id} className={`overflow-hidden transition-all bg-white border-slate-200 ${isExpanded ? 'ring-1 ring-slate-300' : 'hover:border-slate-300'}`}>
                {/* Campaign Row */}
                <div
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedCampaign(isExpanded ? null : campaign.id)}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 text-slate-900 border border-slate-200">
                      <StatusIcon className="w-4 h-4 text-slate-900" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-slate-950 truncate">{campaign.subject}</span>
                        <Badge className={`text-[9px] shrink-0 ${STATUS_COLORS[campaign.status]}`}>{campaign.status}</Badge>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span>{campaign.senderEmail}</span>
                        <span>•</span>
                        <span>{new Date(campaign.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-slate-950">{campaign.sentCount} sent</div>
                      <div className="text-[10px] text-slate-400 font-mono">{campaign.awsMessageId?.slice(0, 12) || '—'}...</div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded Drill-Down */}
                {isExpanded && (
                  <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                        <div className="text-lg font-bold font-heading text-slate-950">68.4%</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">Open Rate</div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                        <div className="text-lg font-bold font-heading text-slate-950">12.7%</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">Click Rate</div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                        <div className="text-lg font-bold font-heading text-slate-950">1.2%</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">Bounce Rate</div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                        <div className="text-lg font-bold font-heading text-slate-950">0.3%</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">Unsubs</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="text-[11px] h-7 gap-1 border-slate-300 bg-white text-slate-900 hover:bg-slate-100">
                        <Eye className="w-3 h-3" /> View Email
                      </Button>
                      <Button variant="outline" size="sm" className="text-[11px] h-7 gap-1 border-slate-300 bg-white text-slate-900 hover:bg-slate-100">
                        <RotateCcw className="w-3 h-3" /> Resend Failed
                      </Button>
                      <Button variant="outline" size="sm" className="text-[11px] h-7 gap-1 border-slate-300 bg-white text-slate-900 hover:bg-slate-100">
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
