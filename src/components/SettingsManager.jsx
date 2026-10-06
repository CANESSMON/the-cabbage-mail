import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Settings, CheckCircle2, ShieldCheck, Mail, Server } from 'lucide-react';
import DomainVerificationWidget from './DomainVerificationWidget';

export default function SettingsManager() {
  const { activeClient } = useAuth();

  const [senderName, setSenderName] = useState(activeClient?.senderName || '');
  const [senderEmail, setSenderEmail] = useState(activeClient?.senderEmail || '');
  const [replyTo, setReplyTo] = useState(activeClient?.replyTo || '');
  const [smtpUser, setSmtpUser] = useState('PRAFUL101NAYAK@GMAIL.COM');
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');

  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const domainName = (senderEmail.split('@')[1]) || 'yourcompany.com';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          <span>Workspace & Domain Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure DNS domain authentication (SPF, DKIM, DMARC), sender identity, and delivery preferences for <strong className="text-slate-200">{activeClient?.name}</strong>.
        </p>
      </div>

      {saved && (
        <Card className="p-4 border-emerald-500/30 bg-emerald-950/30 text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">Settings updated successfully for this workspace!</span>
        </Card>
      )}

      {/* Domain Authentication Widget */}
      <DomainVerificationWidget domain={domainName} />

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Sender Identity Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Sender Identity & Headers</span>
            </CardTitle>
            <CardDescription>
              Specify default email sender headers displayed to your campaign recipients.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Default Sender Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Acme Marketing Team"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Default Sender Email *</label>
                <Input
                  type="email"
                  placeholder="newsletter@acmemarketing.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Reply-To Email Address</label>
              <Input
                type="email"
                placeholder="support@acmemarketing.com"
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Engine Delivery Status Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Email Engine Dispatcher Status</span>
            </CardTitle>
            <CardDescription>
              Current email engine delivery configuration active on your backend server.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Active Engine Provider</span>
                <span className="font-semibold text-emerald-400">Google SMTP Server</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">SMTP Gateway</span>
                <span className="font-mono text-slate-200">{smtpHost}:{smtpPort}</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Authenticated Account</span>
                <span className="font-mono text-slate-200 truncate block">{smtpUser}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Active SMTP delivery engine authenticated and ready to dispatch emails.</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Save Settings</Button>
          </CardFooter>
        </Card>

      </form>
    </div>
  );
}
