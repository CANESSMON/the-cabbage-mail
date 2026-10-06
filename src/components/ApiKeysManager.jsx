import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Key, Plus, Copy, Check, Trash2, Shield, Code, Eye, EyeOff,
  Terminal, Sparkles, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { auditService } from '../services/auditService';

const INITIAL_KEYS = [];

export default function ApiKeysManager() {
  const [keys, setKeys] = useState(INITIAL_KEYS);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState(['subscribers.read', 'subscribers.write']);
  const [createdSecret, setCreatedSecret] = useState(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeSnippetTab, setActiveSnippetTab] = useState('add_subscriber');

  const handleCreateKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const rawToken = 'cbm_live_' + Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newKey = {
      id: 'key_' + Date.now(),
      name: newKeyName,
      prefix: rawToken.slice(0, 13),
      fullKey: rawToken,
      scopes: selectedScopes,
      created: new Date().toISOString().slice(0, 10),
      lastUsed: 'Never',
      status: 'active'
    };

    setKeys([newKey, ...keys]);
    setCreatedSecret(rawToken);
    setNewKeyName('');
    auditService.logEvent('API_KEY_CREATED', 'Integrations', `Generated new API key "${newKeyName}" (${selectedScopes.join(', ')})`);
  };

  const handleRevokeKey = (id, name) => {
    if (window.confirm(`Are you sure you want to revoke API key "${name}"? This cannot be undone.`)) {
      setKeys(keys.filter(k => k.id !== id));
      auditService.logEvent('API_KEY_REVOKED', 'Integrations', `Revoked API key "${name}"`, 'Alex Rivera', 'warning');
    }
  };

  const toggleScope = (scope) => {
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(selectedScopes.filter(s => s !== scope));
    } else {
      setSelectedScopes([...selectedScopes, scope]);
    }
  };

  const getCurlSnippet = () => {
    const key = keys[0]?.prefix + '...' || 'cbm_live_...';
    switch (activeSnippetTab) {
      case 'add_subscriber':
        return `curl -X POST https://api.cabbagemail.io/v1/subscribers \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "first_name": "Jane",
    "tags": ["web-lead", "vip"]
  }'`;
      case 'send_campaign':
        return `curl -X POST https://api.cabbagemail.io/v1/campaigns/send \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "campaign_id": "cmp_901",
    "segment_id": "seg_101"
  }'`;
      case 'get_analytics':
        return `curl -X GET https://api.cabbagemail.io/v1/analytics/summary \\
  -H "Authorization: Bearer ${key}"`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-slate-100 tracking-tight flex items-center gap-2.5">
            <Key className="w-6 h-6 text-emerald-400" />
            API Keys & Integrations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Programmatically integrate your SaaS, CRM, or e-commerce store with The Cabbage Mail API endpoints.
          </p>
        </div>

        <Button onClick={() => setShowNewKeyModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Generate New API Key
        </Button>
      </div>

      {/* Secret Created Banner */}
      {createdSecret && (
        <Card className="p-5 border-emerald-500/40 bg-emerald-950/20 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm font-heading">
            <CheckCircle2 className="w-5 h-5" />
            <span>API Key Created Successfully</span>
          </div>
          <p className="text-xs text-slate-300">
            Copy your API secret token now. For security, <strong className="text-emerald-400">it will not be shown again</strong>.
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={createdSecret}
              className="flex-1 bg-slate-950 border border-emerald-500/40 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 select-all"
            />
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(createdSecret);
                setCopiedSecret(true);
                setTimeout(() => setCopiedSecret(false), 2000);
              }}
              className="gap-1.5"
            >
              {copiedSecret ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSecret ? 'Copied!' : 'Copy Secret'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setCreatedSecret(null)}>
              Done
            </Button>
          </div>
        </Card>
      )}

      {/* Active Keys Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold font-heading text-slate-200">Active API Keys</h2>
          <Badge variant="outline" className="text-[10px]">{keys.length} Active</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Key Name</th>
                <th className="py-3 px-4">Prefix</th>
                <th className="py-3 px-4">Scopes</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Last Used</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {keys.map(k => (
                <tr key={k.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    {k.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-emerald-400">
                    {k.prefix}...
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {k.scopes.map(s => (
                        <Badge key={s} variant="secondary" className="text-[9px] px-1.5 py-0 font-mono">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {k.created}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {k.lastUsed}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeKey(k.id, k.name)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Code Snippets Section */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">REST API Quickstart</h3>
          </div>
          <div className="flex items-center space-x-1">
            {[
              { id: 'add_subscriber', label: 'POST /subscribers' },
              { id: 'send_campaign', label: 'POST /campaigns/send' },
              { id: 'get_analytics', label: 'GET /analytics' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSnippetTab(tab.id)}
                className={`text-[11px] px-3 py-1 rounded font-mono transition-colors ${
                  activeSnippetTab === tab.id
                    ? 'bg-slate-800 text-emerald-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto">
            {getCurlSnippet()}
          </pre>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(getCurlSnippet());
              setCopiedSnippet(true);
              setTimeout(() => setCopiedSnippet(false), 2000);
            }}
            className="absolute top-3 right-3 gap-1.5 text-[10px]"
          >
            {copiedSnippet ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedSnippet ? 'Copied' : 'Copy cURL'}
          </Button>
        </div>
      </Card>

      {/* New Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-5 bg-slate-900 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                Generate API Key
              </h3>
              <button onClick={() => setShowNewKeyModal(false)} className="text-slate-400 hover:text-slate-200">×</button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Key Name / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Shopify Store Webhook Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Permission Scopes</label>
                <div className="space-y-2">
                  {[
                    { id: 'subscribers.read', label: 'Read Subscribers', desc: 'Fetch subscriber profiles & lists' },
                    { id: 'subscribers.write', label: 'Write Subscribers', desc: 'Add, update, or remove subscribers' },
                    { id: 'campaigns.send', label: 'Trigger Campaigns', desc: 'Send or schedule email campaigns' },
                    { id: 'analytics.read', label: 'Read Analytics', desc: 'Fetch metrics & delivery reports' }
                  ].map(s => (
                    <label key={s.id} className="flex items-start space-x-2.5 p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedScopes.includes(s.id)}
                        onChange={() => toggleScope(s.id)}
                        className="mt-0.5 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500/20"
                      />
                      <div>
                        <span className="text-xs font-semibold text-slate-200 block">{s.label}</span>
                        <span className="text-[10px] text-slate-400 block">{s.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowNewKeyModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Key
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
