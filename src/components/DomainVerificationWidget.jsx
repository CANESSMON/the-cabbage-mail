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

  useEffect(() => {
    setVerified(false);
    setVerificationMessage(null);
    setDnsData(generateDomainDnsRecords(domain, false));
    setAutoPollActive(true);

    handleVerifyDns(true);

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
        setTimeout(() => handleVerifyDns(false), 3000);
      }
    }
  };

  return (
    <Card className="bg-white border-slate-200/90 shadow-2xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-slate-900 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>Domain Authentication & DNS Verification</span>
          </div>
          <CardTitle className="text-xl font-bold font-heading text-slate-950 flex items-center gap-2">
            {domain}
            {verified && <CheckCircle2 className="w-5 h-5 text-slate-950" />}
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs mt-0.5">
            Configure these DNS records with your domain registrar or use automated Cloudflare setup.
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={`px-3 py-1 text-xs border ${verified ? 'bg-slate-100 border-slate-300 text-slate-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700 font-medium'}`}>
            {verified ? "Domain Authenticated" : "Pending DNS Verification"}
          </Badge>

          {!verified && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowCfModal(true)}
                className="gap-1.5 text-xs border-slate-300 bg-white text-slate-900 hover:bg-slate-100 font-semibold"
              >
                <Zap className="w-3.5 h-3.5 text-slate-900" />
                Automated Cloudflare Setup
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleSimulateVerified}
                className="gap-1.5 text-xs border-slate-300 text-slate-900 bg-white hover:bg-slate-100 font-semibold"
                title="Force test verification status for testing"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                Test Mode: Verify All
              </Button>
            </>
          )}

          <Button size="sm" onClick={() => handleVerifyDns(false)} disabled={loading} className="gap-1.5 text-xs bg-black hover:bg-slate-800 text-white font-semibold">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Checking DNS..." : "Verify DNS Records"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Verification Summary Banner */}
        <div className={`p-3 rounded-lg text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border ${
          verified 
            ? 'bg-slate-100 border-slate-200 text-slate-950' 
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center space-x-2">
            {verified ? (
              <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-slate-700 shrink-0" />
            )}
            <span className="font-medium">
              {verificationMessage || 'Publish the TXT & CNAME records below to authenticate domain dispatch.'}
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {!verified && (
              <span className="inline-flex items-center text-[10px] text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-ping mr-1.5"></span>
                Polling every 30s
              </span>
            )}
            <span className="font-mono text-xs font-bold text-slate-950">
              {verified ? '100% Verified Sender' : 'Pending Verification'}
            </span>
          </div>
        </div>

        {/* DNS Records Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200 font-sans">
              <tr>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Host / Name</th>
                <th className="px-4 py-2.5">Value / Target</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900 bg-white">
              {/* TXT Challenge */}
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-950">TXT</td>
                <td className="px-4 py-3 truncate max-w-[180px]">{dnsData.verificationTxt.name}</td>
                <td className="px-4 py-3 truncate max-w-[240px] text-slate-700">{dnsData.verificationTxt.value}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-[10px] border-slate-300 text-slate-900 bg-slate-100">
                    {dnsData.verificationTxt.status === 'VERIFIED' || verified ? "Verified" : "Pending"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(dnsData.verificationTxt.value, 'txt')}
                    className="h-7 w-7 p-0 hover:bg-slate-100 text-slate-700"
                  >
                    {copiedKey === 'txt' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  </Button>
                </td>
              </tr>

              {/* 3 DKIM CNAME Records */}
              {dnsData.dkimRecords.map((dkim, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-950">CNAME</td>
                  <td className="px-4 py-3 truncate max-w-[180px]">{dkim.name}</td>
                  <td className="px-4 py-3 truncate max-w-[240px] text-slate-700">{dkim.value}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[10px] border-slate-300 text-slate-900 bg-slate-100">
                      {dkim.status === 'VERIFIED' || verified ? `DKIM ${idx + 1} OK` : `DKIM ${idx + 1} Pending`}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(dkim.value, `dkim_${idx}`)}
                      className="h-7 w-7 p-0 hover:bg-slate-100 text-slate-700"
                    >
                      {copiedKey === `dkim_${idx}` ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    </Button>
                  </td>
                </tr>
              ))}

              {/* SPF Record */}
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-950">TXT (SPF)</td>
                <td className="px-4 py-3 truncate max-w-[180px]">{dnsData.spfRecord.name}</td>
                <td className="px-4 py-3 truncate max-w-[240px] text-slate-700">{dnsData.spfRecord.value}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-[10px] border-slate-300 text-slate-900 bg-slate-100">
                    {dnsData.spfRecord.status === 'VERIFIED' || verified ? "SPF OK" : "SPF Pending"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(dnsData.spfRecord.value, 'spf')}
                    className="h-7 w-7 p-0 hover:bg-slate-100 text-slate-700"
                  >
                    {copiedKey === 'spf' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  </Button>
                </td>
              </tr>

              {/* DMARC Record */}
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-950">TXT (DMARC)</td>
                <td className="px-4 py-3 truncate max-w-[180px]">{dnsData.dmarcRecord.name}</td>
                <td className="px-4 py-3 truncate max-w-[240px] text-slate-700">{dnsData.dmarcRecord.value}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-[10px] border-slate-300 text-slate-900 bg-slate-100">
                    {dnsData.dmarcRecord.status === 'VERIFIED' || verified ? "DMARC OK" : "DMARC Pending"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(dnsData.dmarcRecord.value, 'dmarc')}
                    className="h-7 w-7 p-0 hover:bg-slate-100 text-slate-700"
                  >
                    {copiedKey === 'dmarc' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Cloudflare Modal */}
      {showCfModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-950">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-black text-white">
                  <Zap className="w-4 h-4 fill-white text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-950 font-heading">
                    Cloudflare Auto-Provisioning
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Automatically publish verification records to {domain}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowCfModal(false)}
                className="text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAutoProvision} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Cloudflare API Token</span>
                  <a 
                    href="https://dash.cloudflare.com/profile/api-tokens" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[11px] text-slate-900 hover:underline flex items-center gap-1 font-normal"
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
                    placeholder="Enter API Token..."
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-950 focus:outline-none focus:border-slate-900 font-mono"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                </div>
                <p className="text-[10px] text-slate-500">
                  Token requires <code className="bg-slate-100 text-slate-900 px-1 rounded border border-slate-200">Zone:Read</code> & <code className="bg-slate-100 text-slate-900 px-1 rounded border border-slate-200">DNS:Edit</code> permissions.
                </p>
              </div>

              {/* Status Output */}
              {cfResult && (
                <div className={`p-3 rounded-lg text-xs space-y-2 border ${
                  cfResult.success 
                    ? 'bg-slate-100 border-slate-200 text-slate-950' 
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="flex items-center space-x-2 font-bold">
                    {cfResult.success ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                    <span>{cfResult.message}</span>
                  </div>

                  {cfResult.recordsProcessed && cfResult.recordsProcessed.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-slate-200 font-mono text-[11px]">
                      {cfResult.recordsProcessed.map((rec, i) => (
                        <div key={i} className="flex items-center justify-between text-slate-800">
                          <span className="truncate max-w-[280px]">
                            {rec.type} {rec.name}
                          </span>
                          <span className="font-bold">
                            {rec.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCfModal(false)}
                  className="text-xs text-slate-600 hover:text-slate-950"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={cfLoading || !cfToken.trim()}
                  className="gap-1.5 text-xs bg-black hover:bg-slate-800 text-white font-bold"
                >
                  {cfLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Provisioning DNS...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-white text-white" />
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

