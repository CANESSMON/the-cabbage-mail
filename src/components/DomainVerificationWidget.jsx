import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  Check, 
  AlertTriangle, 
  XCircle, 
  Zap, 
  Globe, 
  ExternalLink, 
  Lock, 
  X 
} from 'lucide-react';
import { 
  generateDomainDnsRecords, 
  verifyDomainDnsStatus, 
  simulateVerifyDomainDnsStatus,
  autoProvisionCloudflareDns 
} from '../services/domainVerificationService';

export default function DomainVerificationWidget({ domain = 'yourcompany.com' }) {
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [verified, setVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(null);
  const [dnsData, setDnsData] = useState(() => generateDomainDnsRecords(domain, false));
  const [autoPollActive, setAutoPollActive] = useState(true);

  // Cloudflare Modal state
  const [showCfModal, setShowCfModal] = useState(false);
  const [cfToken, setCfToken] = useState('');
  const [cfLoading, setCfLoading] = useState(false);
  const [cfResult, setCfResult] = useState(null);

  // Auto-check on mount and setup background polling interval (every 30 seconds)
  useEffect(() => {
    setVerified(false);
    setVerificationMessage(null);
    setDnsData(generateDomainDnsRecords(domain, false));
    setAutoPollActive(true);

    // Initial check on load
    handleVerifyDns(true);

    // Auto-polling interval
    const interval = setInterval(() => {
      if (!verified && autoPollActive) {
        handleVerifyDns(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [domain]);

  const handleVerifyDns = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    const result = await verifyDomainDnsStatus(domain);
    setDnsData(result.records);
    setVerified(result.isVerified);
    if (!isBackground || result.isVerified) {
      setVerificationMessage(result.message);
    }
    if (!isBackground) setLoading(false);
  };

  const handleSimulateVerified = () => {
    const simResult = simulateVerifyDomainDnsStatus(domain);
    setDnsData(simResult.records);
    setVerified(true);
    setVerificationMessage(simResult.message);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleAutoProvision = async (e) => {
    e.preventDefault();
    if (!cfToken.trim()) return;

    setCfLoading(true);
    setCfResult(null);

    const result = await autoProvisionCloudflareDns(domain, cfToken.trim());
    setCfResult(result);
    setCfLoading(false);

    if (result.success) {
      if (result.records) setDnsData(result.records);
      if (result.isVerified) {
        setVerified(true);
        setVerificationMessage('Cloudflare DNS records created and verified successfully!');
      } else {
        // Run verification lookup again after 3 seconds
        setTimeout(() => handleVerifyDns(false), 3000);
      }
    }
  };

  return (
    <Card className={`border-slate-800 bg-slate-900/80 shadow-2xl transition-all ${verified ? 'border-emerald-500/30' : ''}`}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Domain Authentication & DNS Verification</span>
          </div>
          <CardTitle className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
            {domain}
            {verified && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs mt-0.5">
            Configure these DNS records with your registrar, or use 1-click Cloudflare automated setup.
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={verified ? "success" : "warning"} className="px-3 py-1 text-xs">
            {verified ? "Domain Authenticated" : "Pending DNS Verification"}
          </Badge>

          {!verified && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowCfModal(true)}
                className="gap-1.5 text-xs bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                1-Click Cloudflare Setup
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleSimulateVerified}
                className="gap-1.5 text-xs border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                title="Force test verification status for local testing"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Test Mode: Verify All
              </Button>
            </>
          )}

          <Button size="sm" onClick={() => handleVerifyDns(false)} disabled={loading} className="gap-1.5 text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Checking DNS..." : "Verify DNS Records"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Verification Summary Banner */}
        <div className={`p-3 rounded-lg text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border ${
          verified 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
            : verificationMessage
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            : 'bg-slate-800/80 border-slate-700 text-slate-300'
        }`}>
          <div className="flex items-center space-x-2">
            {verified ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>
              {verificationMessage || 'Publish the TXT & CNAME records below or click 1-Click Cloudflare Setup.'}
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {!verified && (
              <span className="inline-flex items-center text-[10px] text-amber-400/90 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping mr-1.5"></span>
                Auto-polling every 30s
              </span>
            )}
            <span className="font-mono text-[11px] font-bold text-slate-200">
              {verified ? '100% Verified Sender' : 'Pending Verification'}
            </span>
          </div>
        </div>

        {/* DNS Records Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-sans">
              <tr>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Host / Name</th>
                <th className="px-4 py-2.5">Value / Target</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {/* TXT Challenge */}
              <tr className="hover:bg-slate-800/30">
                <td className="px-4 py-3 font-semibold text-emerald-400">TXT</td>
                <td className="px-4 py-3 truncate max-w-[180px]">{dnsData.verificationTxt.name}</td>
                <td className="px-4 py-3 truncate max-w-[240px] text-slate-300">{dnsData.verificationTxt.value}</td>
                <td className="px-4 py-3">
                  <Badge variant={dnsData.verificationTxt.status === 'VERIFIED' || verified ? "success" : "warning"} className="text-[10px]">
                    {dnsData.verificationTxt.status === 'VERIFIED' || verified ? "Verified" : "Pending"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(dnsData.verificationTxt.value, 'txt')}
                    className="h-7 w-7 p-0"
                  >
                    {copiedKey === 'txt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  </Button>
                </td>
              </tr>

              {/* 3 DKIM CNAME Records */}
              {dnsData.dkimRecords.map((dkim, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-semibold text-teal-400">CNAME</td>
                  <td className="px-4 py-3 truncate max-w-[180px]">{dkim.name}</td>
                  <td className="px-4 py-3 truncate max-w-[240px] text-slate-300">{dkim.value}</td>
                  <td className="px-4 py-3">
                    <Badge variant={dkim.status === 'VERIFIED' || verified ? "success" : "warning"} className="text-[10px]">
                      {dkim.status === 'VERIFIED' || verified ? `DKIM ${idx + 1} OK` : `DKIM ${idx + 1} Pending`}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(dkim.value, `dkim_${idx}`)}
                      className="h-7 w-7 p-0"
                    >
                      {copiedKey === `dkim_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    </Button>
                  </td>
                </tr>
              ))}

              {/* SPF Record */}
              <tr className="hover:bg-slate-800/30">
                <td className="px-4 py-3 font-semibold text-indigo-400">TXT (SPF)</td>
                <td className="px-4 py-3 truncate max-w-[180px]">{dnsData.spfRecord.name}</td>
                <td className="px-4 py-3 truncate max-w-[240px] text-slate-300">{dnsData.spfRecord.value}</td>
                <td className="px-4 py-3">
                  <Badge variant={dnsData.spfRecord.status === 'VERIFIED' || verified ? "success" : "warning"} className="text-[10px]">
                    {dnsData.spfRecord.status === 'VERIFIED' || verified ? "SPF OK" : "SPF Pending"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(dnsData.spfRecord.value, 'spf')}
                    className="h-7 w-7 p-0"
                  >
                    {copiedKey === 'spf' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  </Button>
                </td>
              </tr>

              {/* DMARC Record */}
              <tr className="hover:bg-slate-800/30">
                <td className="px-4 py-3 font-semibold text-purple-400">TXT (DMARC)</td>
                <td className="px-4 py-3 truncate max-w-[180px]">{dnsData.dmarcRecord.name}</td>
                <td className="px-4 py-3 truncate max-w-[240px] text-slate-300">{dnsData.dmarcRecord.value}</td>
                <td className="px-4 py-3">
                  <Badge variant={dnsData.dmarcRecord.status === 'VERIFIED' || verified ? "success" : "warning"} className="text-[10px]">
                    {dnsData.dmarcRecord.status === 'VERIFIED' || verified ? "DMARC OK" : "DMARC Pending"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(dnsData.dmarcRecord.value, 'dmarc')}
                    className="h-7 w-7 p-0"
                  >
                    {copiedKey === 'dmarc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* ⚡ Cloudflare One-Click Setup Modal */}
      {showCfModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Zap className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100 font-heading">
                    1-Click Cloudflare DNS Auto-Provisioning
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Automatically insert all 6 verification records into {domain}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowCfModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAutoProvision} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Cloudflare API Token</span>
                  <a 
                    href="https://dash.cloudflare.com/profile/api-tokens" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-normal"
                  >
                    <span>Create Token</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={cfToken}
                    onChange={(e) => setCfToken(e.target.value)}
                    placeholder="e.g. 4X9kL_aB72mN... (Zone:Edit & DNS:Edit)"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
                </div>
                <p className="text-[10px] text-slate-400">
                  Token needs <code className="bg-slate-800 text-amber-300 px-1 rounded">Zone:Read</code> & <code className="bg-slate-800 text-amber-300 px-1 rounded">DNS:Edit</code> permissions. Tokens are never stored permanently without encryption.
                </p>
              </div>

              {/* Status / Output Feedback */}
              {cfResult && (
                <div className={`p-3 rounded-lg text-xs space-y-2 border ${
                  cfResult.success 
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
                    : 'bg-red-950/40 border-red-500/30 text-red-300'
                }`}>
                  <div className="flex items-center space-x-2 font-semibold">
                    {cfResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    <span>{cfResult.message}</span>
                  </div>

                  {cfResult.recordsProcessed && cfResult.recordsProcessed.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-slate-800/60 font-mono text-[11px]">
                      {cfResult.recordsProcessed.map((rec, i) => (
                        <div key={i} className="flex items-center justify-between text-slate-300">
                          <span className="truncate max-w-[280px]">
                            {rec.type} {rec.name}
                          </span>
                          <span className={
                            rec.status === 'CREATED' ? 'text-emerald-400' :
                            rec.status === 'EXISTS' ? 'text-slate-400' : 'text-red-400'
                          }>
                            {rec.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCfModal(false)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={cfLoading || !cfToken.trim()}
                  className="gap-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  {cfLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Provisioning DNS...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Publish Records to Cloudflare</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}
