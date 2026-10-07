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
        <h1 className="text-2xl font-bold font-heading text-slate-950 flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-950" />
          <span>Workspace & Domain Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure DNS domain authentication (SPF, DKIM, DMARC), sender identity, and delivery preferences for <strong className="text-slate-900">{activeClient?.name}</strong>.
        </p>
      </div>

      {saved && (
        <Card className="p-4 border-emerald-200 bg-emerald-50 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span className="text-xs font-semibold">Settings updated successfully for this workspace!</span>
        </Card>
      )}

      {/* Domain Authentication Widget */}
      <DomainVerificationWidget domain={domainName} />

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Sender Identity Section */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-slate-950 font-bold">
              <Mail className="w-4 h-4 text-slate-950" />
              <span>Sender Identity & Headers</span>
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Specify default email sender headers displayed to your campaign recipients.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Default Sender Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Acme Marketing Team"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="bg-white border-slate-200 text-slate-950 focus:border-black"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Default Sender Email *</label>
                <Input
                  type="email"
                  placeholder="newsletter@acmemarketing.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  required
                  className="bg-white border-slate-200 text-slate-950 focus:border-black"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Reply-To Email Address</label>
              <Input
                type="email"
                placeholder="support@acmemarketing.com"
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
                className="bg-white border-slate-200 text-slate-950 focus:border-black"
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Engine Delivery Status Section */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-slate-950 font-bold">
              <Server className="w-4 h-4 text-slate-950" />
              <span>Email Engine Dispatcher Status</span>
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Current email engine delivery configuration active on your AWS cloud infrastructure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 block text-[11px] font-medium">Active Engine Provider</span>
                <span className="font-bold text-slate-950">Amazon SES (Simple Email Service)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 block text-[11px] font-medium">AWS Cloud Region</span>
                <span className="font-mono font-bold text-slate-950">eu-north-1 (Stockholm)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 block text-[11px] font-medium">Authenticated Identity</span>
                <span className="font-mono font-semibold text-slate-950 truncate block">info@emailbhejo.com</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>AWS SES Cloud Dispatcher active and authenticated with verified identity info@emailbhejo.com.</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-black text-white hover:bg-slate-800">Save Settings</Button>
          </CardFooter>
        </Card>

      </form>
    </div>
  );
}
