import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { auditService } from '../services/auditService';
import {
  ClipboardList, Search, Download, Trash2, Filter,
  Send, Key, CreditCard, RefreshCw, AlertTriangle, CheckCircle2,
  Workflow, UserPlus, Globe
} from 'lucide-react';

const CATEGORIES = ['All', 'Campaigns', 'Automations', 'Security', 'Integrations', 'Team', 'Subscribers', 'Billing'];

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    setLogs(auditService.getLogs());
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all audit logs?')) {
      auditService.clearLogs();
      setLogs([]);
    }
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = 'ID,Timestamp,Actor,Action,Category,Details,Status,IP\n';
    const rows = filteredLogs.map(l => 
      `"${l.id}","${l.timestamp}","${l.actor}","${l.action}","${l.category}","${l.details.replace(/"/g, '""')}","${l.status}","${l.ip}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || log.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || log.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Campaigns': return <Send className="w-3.5 h-3.5 text-slate-950" />;
      case 'Automations': return <Workflow className="w-3.5 h-3.5 text-slate-950" />;
      case 'Security': return <Globe className="w-3.5 h-3.5 text-slate-950" />;
      case 'Integrations': return <Key className="w-3.5 h-3.5 text-slate-950" />;
      case 'Team': return <UserPlus className="w-3.5 h-3.5 text-slate-950" />;
      case 'Subscribers': return <UserPlus className="w-3.5 h-3.5 text-slate-950" />;
      case 'Billing': return <CreditCard className="w-3.5 h-3.5 text-slate-950" />;
      default: return <ClipboardList className="w-3.5 h-3.5 text-slate-950" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-950 tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-slate-950" />
            Audit & Security Log
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable system event trailing for security compliance, user actions, and workspace modifications.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadLogs} className="gap-1.5 border-slate-300 bg-white text-slate-900 hover:bg-slate-100">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 border-slate-300 bg-white text-slate-900 hover:bg-slate-100">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5">
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 space-y-4 bg-white border-slate-200">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by action, user, or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-950 focus:outline-none focus:border-black shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-950 focus:outline-none focus:border-black shadow-sm"
            >
              <option value="All">All Statuses</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-black text-white border border-black shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card className="overflow-hidden bg-white border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event Category</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">User / Actor</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    No audit logs match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        {getCategoryIcon(log.category)}
                        <span className="text-slate-900 font-semibold">{log.category}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-xs text-slate-950 font-bold">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-medium whitespace-nowrap">
                      {log.actor}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-md truncate">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Badge
                        className={`text-[10px] capitalize px-2 py-0.5 inline-flex items-center gap-1 font-semibold ${
                          log.status === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : log.status === 'warning'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {log.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
