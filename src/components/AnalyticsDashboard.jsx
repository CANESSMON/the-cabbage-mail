import React, { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  BarChart3, TrendingUp, MousePointer, AlertTriangle, UserMinus,
  Mail, Users, Globe, Monitor
} from 'lucide-react';
import {
  generateTimeSeries, generateSubscriberGrowth, generateTopCampaigns,
  generateDeviceBreakdown, generateGeoData, generateEmailClients,
} from '../services/analyticsService';

function BarChart({ data, dataKey, maxVal, color = 'bg-black', height = 120, labelKey = 'label' }) {
  const max = maxVal || Math.max(...data.map(d => d[dataKey]), 1);
  return (
    <div className="flex items-end space-x-[2px]" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md">
            {d[dataKey]} — {d[labelKey]}
          </div>
          <div
            className={`${color} w-full rounded-t-sm opacity-80 hover:opacity-100 transition-all min-w-[3px]`}
            style={{ height: `${Math.max((d[dataKey] / max) * 100, 2)}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ label, value, maxValue, color = 'bg-black', suffix = '' }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-700 font-medium">{label}</span>
        <span className="text-slate-950 font-mono font-semibold">{value}{suffix}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState('30d');

  const days = period === '7d' ? 7 : period === '14d' ? 14 : 30;

  const timeSeries = useMemo(() => generateTimeSeries(days), [days]);
  const subGrowth = useMemo(() => generateSubscriberGrowth(days), [days]);
  const topCampaigns = useMemo(() => generateTopCampaigns(5), []);
  const devices = useMemo(() => generateDeviceBreakdown(), []);
  const geoData = useMemo(() => generateGeoData(), []);
  const emailClients = useMemo(() => generateEmailClients(), []);

  const totalSent = timeSeries.reduce((a, d) => a + d.emailsSent, 0);
  const totalOpens = timeSeries.reduce((a, d) => a + d.opens, 0);
  const totalClicks = timeSeries.reduce((a, d) => a + d.clicks, 0);
  const totalBounces = timeSeries.reduce((a, d) => a + d.bounces, 0);
  const totalUnsubs = timeSeries.reduce((a, d) => a + d.unsubscribes, 0);
  const avgOpenRate = totalSent > 0 ? ((totalOpens / totalSent) * 100).toFixed(1) : '0';
  const avgClickRate = totalSent > 0 ? ((totalClicks / totalSent) * 100).toFixed(1) : '0';
  const avgBounceRate = totalSent > 0 ? ((totalBounces / totalSent) * 100).toFixed(1) : '0';
  const avgUnsubRate = totalSent > 0 ? ((totalUnsubs / totalSent) * 100).toFixed(1) : '0';

  const maxDeviceVal = Math.max(...devices.map(d => d.percentage));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-950 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-slate-950" />
            <span>Analytics & Insights</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Campaign performance overview for the last {days} days.
          </p>
        </div>
        <div className="flex items-center space-x-1">
          {[{ v: '7d', l: '7 Days' }, { v: '14d', l: '14 Days' }, { v: '30d', l: '30 Days' }].map((p) => (
            <button
              key={p.v}
              onClick={() => setPeriod(p.v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                period === p.v
                  ? 'bg-black text-white border border-black shadow-sm'
                  : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p.l}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-4 hover:border-slate-300 transition-colors bg-white border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Emails Sent</span>
            <Mail className="w-3.5 h-3.5 text-slate-950" />
          </div>
          <div className="text-xl font-bold font-heading text-slate-950">{totalSent.toLocaleString()}</div>
        </Card>
        <Card className="p-4 hover:border-slate-300 transition-colors bg-white border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Open Rate</span>
            <TrendingUp className="w-3.5 h-3.5 text-slate-950" />
          </div>
          <div className="text-xl font-bold font-heading text-slate-950">{avgOpenRate}%</div>
        </Card>
        <Card className="p-4 hover:border-slate-300 transition-colors bg-white border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Click Rate</span>
            <MousePointer className="w-3.5 h-3.5 text-slate-950" />
          </div>
          <div className="text-xl font-bold font-heading text-slate-950">{avgClickRate}%</div>
        </Card>
        <Card className="p-4 hover:border-slate-300 transition-colors bg-white border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Bounce Rate</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-heading text-slate-950">{avgBounceRate}%</div>
        </Card>
        <Card className="p-4 hover:border-slate-300 transition-colors bg-white border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Unsubs</span>
            <UserMinus className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-xl font-bold font-heading text-slate-950">{avgUnsubRate}%</div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Emails Sent Over Time */}
        <Card className="p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold font-heading text-slate-950">Emails Sent</h3>
            <Badge variant="secondary" className="text-[9px] bg-slate-100 text-slate-900 border-slate-200">Daily</Badge>
          </div>
          <BarChart data={timeSeries} dataKey="emailsSent" color="bg-black" height={140} />
        </Card>

        {/* Opens Over Time */}
        <Card className="p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold font-heading text-slate-950">Email Opens</h3>
            <Badge variant="secondary" className="text-[9px] bg-slate-100 text-slate-900 border-slate-200">Daily</Badge>
          </div>
          <BarChart data={timeSeries} dataKey="opens" color="bg-slate-700" height={140} />
        </Card>
      </div>

      {/* Subscriber Growth */}
      <Card className="p-5 bg-white border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold font-heading text-slate-950 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-950" />
            <span>Subscriber Growth</span>
          </h3>
          <span className="text-xs font-mono text-slate-500 font-semibold">
            {subGrowth[subGrowth.length - 1]?.total.toLocaleString()} total
          </span>
        </div>
        <BarChart data={subGrowth} dataKey="newSubscribers" color="bg-black" height={100} />
      </Card>

      {/* Bottom Section: Top Campaigns, Devices, Geo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Campaigns */}
        <Card className="p-5 lg:col-span-1 bg-white border-slate-200">
          <h3 className="text-xs font-bold font-heading text-slate-950 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-950" />
            Top Campaigns
          </h3>
          <div className="space-y-3">
            {topCampaigns.map((camp, i) => (
              <div key={camp.id} className="flex items-center space-x-2.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 w-4 shrink-0">#{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-950 truncate">{camp.subject}</div>
                  <div className="text-[10px] text-slate-500">{camp.sent} sent • {camp.openRate}% opens</div>
                </div>
                <Badge variant="default" className="text-[9px] shrink-0 bg-slate-100 text-slate-900 border-slate-200">{camp.openRate}%</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Device Breakdown */}
        <Card className="p-5 bg-white border-slate-200">
          <h3 className="text-xs font-bold font-heading text-slate-950 mb-3 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-slate-950" />
            Device Breakdown
          </h3>
          <div className="space-y-3">
            {devices.map((d) => (
              <ProgressBar key={d.device} label={d.device} value={d.percentage} maxValue={maxDeviceVal * 1.2} color={d.color} suffix="%" />
            ))}
          </div>
        </Card>

        {/* Geographic Distribution */}
        <Card className="p-5 bg-white border-slate-200">
          <h3 className="text-xs font-bold font-heading text-slate-950 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-950" />
            Top Countries
          </h3>
          <div className="space-y-2">
            {geoData.slice(0, 6).map((g) => (
              <div key={g.country} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-800">{g.code}</span>
                  <span className="text-xs text-slate-700 font-medium">{g.country}</span>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-950">{g.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Email Client Breakdown */}
      <Card className="p-5 bg-white border-slate-200">
        <h3 className="text-xs font-bold font-heading text-slate-950 mb-3">Email Client Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {emailClients.map((ec) => (
            <div key={ec.client} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold font-heading text-slate-950">{ec.percentage}%</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">{ec.client}</div>
              <div className={`h-1 ${ec.color} rounded-full mt-2 mx-auto`} style={{ width: `${ec.percentage}%` }} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
