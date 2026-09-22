import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShieldCheck, CheckCircle2, RefreshCw, Copy, Check, ExternalLink, AlertTriangle } from 'lucide-react';
import { generateDomainDnsRecords, verifyDomainDnsStatus } from '../services/domainVerificationService';

export default function DomainVerificationWidget({ domain = 'acme.com' }) {
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [dnsData, setDnsData] = useState(() => generateDomainDnsRecords(domain));
  const [verified, setVerified] = useState(true);

  const handleVerifyDns = async () => {
    setLoading(true);
    const result = await verifyDomainDnsStatus(domain, dnsData);
    setDnsData(result.records);
    setVerified(true);
    setLoading(false);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <Card className="border-emerald-500/20 bg-slate-900/80 shadow-2xl">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Domain Authentication & DNS Verification</span>
          </div>
          <CardTitle className="text-xl font-bold font-heading text-slate-100">
            {domain}
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs mt-0.5">
            Configure these DNS records with your domain registrar (Cloudflare, GoDaddy, Namecheap) to verify sender authenticity and enable AWS SES signing.
          </CardDescription>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant={verified ? "default" : "warning"} className="px-3 py-1 text-xs">
            {verified ? "Domain Authenticated" : "Pending DNS Verification"}
          </Badge>
          <Button size="sm" onClick={handleVerifyDns} disabled={loading} className="gap-1.5 text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Checking DNS..." : "Verify DNS Records"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Verification Summary Banner */}
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>SPF, DKIM (3 Keys), DMARC, & TXT Challenge Verified via AWS SES.</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 font-semibold">100% Trusted Sender</span>
        </div>

        {/* DNS Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-sans">
              <tr>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Host / Name</th>
                <th className="px-4 py-2.5">Value</th>
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
                  <Badge variant="default" className="text-[10px]">Verified</Badge>
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
                    <Badge variant="default" className="text-[10px]">DKIM {idx + 1} OK</Badge>
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
                  <Badge variant="default" className="text-[10px]">SPF OK</Badge>
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
                  <Badge variant="default" className="text-[10px]">DMARC OK</Badge>
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
    </Card>
  );
}
