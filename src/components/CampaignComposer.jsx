import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Send, Eye, Code, Radio, Sparkles, CheckCircle2, User, AlertCircle } from 'lucide-react';
import { dispatchCampaignViaAwsSns } from '../services/awsSnsService';

export default function CampaignComposer({ setActiveTab }) {
  const { activeClient, subscribers, addCampaign } = useAuth();

  const [subject, setSubject] = useState('Exclusive Update from ' + (activeClient?.name || 'Cabbage Mail'));
  const [htmlContent, setHtmlContent] = useState(
    `<h1>Hello {{first_name}},</h1>\n<p>We are excited to share our latest product updates with you.</p>\n<p>Thank you for being a valued subscriber!</p>\n<p><a href="{{unsubscribe_link}}">Unsubscribe</a></p>`
  );
  const [isPreview, setIsPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const activeCount = subscribers.filter(s => s.status === 'ACTIVE').length;

  const handleInsertTag = (tag) => {
    setHtmlContent(prev => prev + ` ${tag} `);
  };

  const handleSendCampaign = async () => {
    if (!subject || !htmlContent || activeCount === 0) return;
    setSending(true);
    setSendResult(null);

    try {
      const activeSubscribers = subscribers.filter(s => s.status === 'ACTIVE');
      const dispatchResponse = await dispatchCampaignViaAwsSns({
        campaignSubject: subject,
        campaignHtml: htmlContent,
        senderName: activeClient?.senderName || 'Sender',
        senderEmail: activeClient?.senderEmail || 'sender@domain.com',
        subscribers: activeSubscribers,
        awsConfig: activeClient,
      });

      // Save campaign record to auth store
      addCampaign({
        subject,
        content: htmlContent,
        targetCount: activeCount,
        sentCount: dispatchResponse.totalDispatched,
        awsMessageId: dispatchResponse.dispatches[0]?.messageId || `sns-msg-${Date.now()}`,
      });

      setSendResult({
        success: true,
        count: dispatchResponse.totalDispatched,
        awsTopicArn: dispatchResponse.awsTopicArn,
      });

      setSending(false);
    } catch (err) {
      console.error(err);
      setSendResult({ success: false, message: 'Failed to publish to AWS SNS topic.' });
      setSending(false);
    }
  };

  // Preview interpolation with sample data
  const previewSampleHtml = htmlContent
    .replace(/\{\{\s*first_name\s*\}\}/g, 'Alex')
    .replace(/\{\{\s*last_name\s*\}\}/g, 'Taylor')
    .replace(/\{\{\s*email\s*\}\}/g, 'alex.taylor@example.com')
    .replace(/\{\{\s*unsubscribe_link\s*\}\}/g, '#unsubscribe-preview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            <Send className="w-6 h-6 text-emerald-400" />
            <span>Campaign Composer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch emails via AWS SNS to <strong className="text-emerald-400">{activeCount} active contacts</strong> in <strong className="text-slate-200">{activeClient?.name}</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={isPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="gap-1.5 text-xs"
          >
            {isPreview ? <Code className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isPreview ? "Switch to Editor" : "Live HTML Preview"}
          </Button>
          <Button
            size="sm"
            onClick={handleSendCampaign}
            disabled={sending || activeCount === 0}
            className="gap-2 shadow-lg shadow-emerald-950"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
            {sending ? "Publishing to AWS SNS..." : "Dispatch via AWS SNS"}
          </Button>
        </div>
      </div>

      {/* Success Notification */}
      {sendResult && (
        <Card className={`p-4 border ${sendResult.success ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300' : 'border-rose-500/30 bg-rose-950/30 text-rose-300'} animate-in fade-in duration-200`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {sendResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
              <div>
                <h4 className="font-semibold text-sm font-heading">
                  {sendResult.success ? 'Campaign Dispatched Successfully!' : 'Dispatch Error'}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {sendResult.success
                    ? `Published ${sendResult.count} messages to AWS SNS Topic (${sendResult.awsTopicArn}).`
                    : sendResult.message}
                </p>
              </div>
            </div>
            {sendResult.success && (
              <Button size="sm" variant="outline" onClick={() => setActiveTab('dashboard')} className="text-xs">
                View Dashboard Stats
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Main Composer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Editor or Preview */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 space-y-4">
            
            {/* Subject Line */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Email Subject Line *
              </label>
              <Input
                type="text"
                placeholder="e.g. September Product Announcements"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="font-medium text-slate-100"
              />
            </div>

            {/* Merge Tag Chips */}
            <div className="flex items-center space-x-2 text-xs py-1">
              <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">Merge Tags:</span>
              <button
                type="button"
                onClick={() => handleInsertTag('{{first_name}}')}
                className="font-mono text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2 py-0.5 rounded border border-slate-700"
              >
                + &#123;&#123;first_name&#125;&#125;
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('{{last_name}}')}
                className="font-mono text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2 py-0.5 rounded border border-slate-700"
              >
                + &#123;&#123;last_name&#125;&#125;
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('{{unsubscribe_link}}')}
                className="font-mono text-[11px] bg-slate-800 hover:bg-slate-700 text-teal-400 px-2 py-0.5 rounded border border-slate-700"
              >
                + &#123;&#123;unsubscribe_link&#125;&#125;
              </button>
            </div>

            {/* HTML Editor or Preview */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>{isPreview ? "Live Rendered Preview" : "HTML Email Content"}</span>
                <span className="text-[10px] font-mono text-slate-400 lowercase">{isPreview ? "Sample Recipient: Alex Taylor" : "HTML + JetBrains Mono Tags"}</span>
              </label>

              {isPreview ? (
                <div
                  className="w-full min-h-[300px] bg-white text-slate-900 rounded-lg p-6 font-sans text-sm shadow-inner overflow-auto prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewSampleHtml }}
                />
              ) : (
                <textarea
                  rows="12"
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-100 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              )}
            </div>

          </Card>
        </div>

        {/* Right 1 Col: Dispatch Summary */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4 border-slate-800">
            <h3 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Broadcast Metadata</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Sender Identity</span>
                <span className="font-semibold text-slate-200 block">{activeClient?.senderName}</span>
                <span className="font-mono text-emerald-400 text-[11px] block truncate">{activeClient?.senderEmail}</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Target Audience</span>
                <span className="font-bold text-slate-100 text-sm">{activeCount} Subscribers</span>
                <span className="text-slate-400 text-[10px] block">Filter: ACTIVE Status</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">AWS Infrastructure</span>
                <span className="font-mono text-[11px] text-slate-300 block truncate">{activeClient?.awsRegion || 'us-east-1'}</span>
                <span className="font-mono text-[10px] text-emerald-400 block truncate">{activeClient?.awsTopicArn}</span>
              </div>
            </div>

            <Button
              onClick={handleSendCampaign}
              disabled={sending || activeCount === 0}
              className="w-full gap-2 shadow-lg shadow-emerald-950 mt-2"
            >
              <Send className="w-4 h-4" />
              {sending ? "Sending via AWS SNS..." : `Send to ${activeCount} Contacts`}
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
}
