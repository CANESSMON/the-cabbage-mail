import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Building2, ShieldCheck, MapPin, CheckCircle2, ArrowRight, ArrowLeft, Radio, AlertCircle } from 'lucide-react';
import DomainVerificationWidget from './DomainVerificationWidget';

export default function ClientOnboardingWizard({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);

  // Form states
  const [websiteUrl, setWebsiteUrl] = useState('https://acmemarketing.com');
  const [industry, setIndustry] = useState('SaaS / Tech');
  const [addressLine, setAddressLine] = useState('100 Market St, Suite 400, San Francisco, CA 94105');
  const [agreedAntiSpam, setAgreedAntiSpam] = useState(false);
  const [estimatedVolume, setEstimatedVolume] = useState('10,000 - 50,000 / month');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && (!websiteUrl || !addressLine)) return;
    if (step === 2 && !agreedAntiSpam) return;
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete({
        websiteUrl,
        industry,
        addressLine,
        estimatedVolume,
        verified: true,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl border-slate-800 bg-slate-900 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>
        
        {/* Step Indicator */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Client Verification & KYC Onboarding</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs">
            <span className={`px-2 py-0.5 rounded font-mono ${step === 1 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>Step 1</span>
            <span className={`px-2 py-0.5 rounded font-mono ${step === 2 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>Step 2</span>
            <span className={`px-2 py-0.5 rounded font-mono ${step === 3 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>Step 3</span>
            <span className={`px-2 py-0.5 rounded font-mono ${step === 4 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>Step 4</span>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          
          {/* STEP 1: Business Profile & CAN-SPAM Address */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>1. Business Vetting & CAN-SPAM Address</span>
              </h3>
              <p className="text-xs text-slate-400">
                To prevent spam and comply with international email privacy laws (CAN-SPAM, GDPR), please verify your company details and physical location.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Company Website URL *</label>
                  <Input
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Business Industry / Niche</label>
                  <Input
                    type="text"
                    placeholder="e.g. E-Commerce, SaaS, Financial Services"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Physical Postal Address (Required by CAN-SPAM Act) *</label>
                  <Input
                    type="text"
                    placeholder="123 Main St, Suite 100, City, State, ZIP, Country"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Expected Monthly Email Sending Volume</label>
                  <Input
                    type="text"
                    placeholder="e.g. 50,000 / month"
                    value={estimatedVolume}
                    onChange={(e) => setEstimatedVolume(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Anti-Spam Policy Declaration */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>2. Anti-Spam Policy & Opt-In Commitment</span>
              </h3>
              
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-3 text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                <p><strong>Strict Anti-Spam Rules:</strong></p>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li>You warrant that all subscribers in your contact lists have explicitly opted-in to receive emails from your organization.</li>
                  <li><strong>Purchased, rented, co-registration, or scraped contact lists are strictly prohibited.</strong></li>
                  <li>Every email sent will include a working 1-click Unsubscribe header link and your physical postal address.</li>
                  <li>Accounts exceeding 5% bounce rate or 0.1% spam complaint rate will be automatically paused to protect AWS infrastructure.</li>
                </ul>
              </div>

              <label className="flex items-start space-x-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedAntiSpam}
                  onChange={(e) => setAgreedAntiSpam(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs text-emerald-300 font-semibold">
                  I agree to the Anti-Spam Policy and confirm that all contacts are 100% explicit opt-in subscribers.
                </span>
              </label>
            </div>
          )}

          {/* STEP 3: Domain DNS Verification */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <DomainVerificationWidget domain={websiteUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '') || 'acme.com'} />
            </div>
          )}

          {/* STEP 4: Verification Complete & Production Approval */}
          {step === 4 && (
            <div className="space-y-4 text-center py-6 animate-in fade-in duration-150">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold font-heading text-slate-100">Client Workspace Approved!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Your domain authentication, business profile, and CAN-SPAM physical address have been verified. Your workspace is upgraded to <strong className="text-emerald-400">Verified Production Tier</strong> on AWS SNS.
              </p>

              <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 text-xs inline-flex items-center space-x-6 text-slate-300 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">VERIFICATION STATUS</span>
                  <span className="text-emerald-400 font-bold">VERIFIED_PRODUCTION</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">DAILY QUOTA</span>
                  <span className="text-slate-100 font-bold">50,000 / Day</span>
                </div>
              </div>
            </div>
          )}

        </CardContent>

        {/* Wizard Navigation Footer */}
        <CardFooter className="flex items-center justify-between border-t border-slate-800/80 p-6 bg-slate-950/40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <Button
            size="sm"
            onClick={handleNext}
            disabled={
              (step === 1 && (!websiteUrl || !addressLine)) ||
              (step === 2 && !agreedAntiSpam)
            }
            className="gap-1.5 shadow-lg shadow-emerald-950"
          >
            {step === 4 ? "Finish & Launch Workspace" : "Continue"}
            {step < 4 && <ArrowRight className="w-4 h-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
