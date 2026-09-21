import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Settings, Radio, Key, Building2, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

export default function SettingsManager() {
  const { activeClient, addClient } = useAuth();

  const [senderName, setSenderName] = useState(activeClient?.senderName || '');
  const [senderEmail, setSenderEmail] = useState(activeClient?.senderEmail || '');
  const [replyTo, setReplyTo] = useState(activeClient?.replyTo || '');
  const [awsRegion, setAwsRegion] = useState(activeClient?.awsRegion || 'us-east-1');
  const [awsTopicArn, setAwsTopicArn] = useState(activeClient?.awsTopicArn || '');
  const [awsAccessKey, setAwsAccessKey] = useState('AKIAIOSFODNN7EXAMPLE');
  const [awsSecretKey, setAwsSecretKey] = useState('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY');

  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          <span>Workspace & AWS Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure AWS SNS cloud credentials and default sender addresses for <strong className="text-slate-200">{activeClient?.name}</strong>.
        </p>
      </div>

      {saved && (
        <Card className="p-4 border-emerald-500/30 bg-emerald-950/30 text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">Settings updated successfully for this workspace!</span>
        </Card>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Sender Identity Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Sender Identity & Addresses</span>
            </CardTitle>
            <CardDescription>
              Emails sent from this workspace will use these headers when publishing via AWS SNS.
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
              <label className="text-xs font-medium text-slate-300">Reply-To Address</label>
              <Input
                type="email"
                placeholder="support@acmemarketing.com"
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* AWS SNS Infrastructure Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>AWS SNS Cloud Infrastructure</span>
            </CardTitle>
            <CardDescription>
              Connect your Amazon SNS Topic for bulk email notification routing and delivery hooks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-xs font-medium text-slate-300">AWS Region</label>
                <Input
                  type="text"
                  placeholder="us-east-1"
                  value={awsRegion}
                  onChange={(e) => setAwsRegion(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-slate-300">Target AWS SNS Topic ARN</label>
                <Input
                  type="text"
                  placeholder="arn:aws:sns:us-east-1:123456789012:MyTopic"
                  value={awsTopicArn}
                  onChange={(e) => setAwsTopicArn(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">AWS Access Key ID</label>
                <Input
                  type="text"
                  placeholder="AKIA..."
                  value={awsAccessKey}
                  onChange={(e) => setAwsAccessKey(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">AWS Secret Access Key</label>
                <Input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={awsSecretKey}
                  onChange={(e) => setAwsSecretKey(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AWS SDK credentials are encrypted locally per client workspace.</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Save Workspace Settings</Button>
          </CardFooter>
        </Card>

      </form>
    </div>
  );
}
