import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  CreditCard, Check, Zap, Download,
  Users, Send, Globe
} from 'lucide-react';
import { auditService } from '../services/auditService';
import { useAuth } from '../context/AuthContext';

const PLANS = [
  {
    id: 'plan_free',
    name: 'Free Starter',
    price: '$0',
    period: 'forever',
    subscribers: '1,000',
    emails: '5,000 / mo',
    features: [
      'AWS SNS Standard Mail Delivery',
      '1 Verified Sending Domain',
      'Basic Drag-and-Drop Templates',
      'Community Support'
    ]
  },
  {
    id: 'plan_growth',
    name: 'Growth',
    price: '$29',
    period: 'per month',
    subscribers: '25,000',
    emails: '100,000 / mo',
    current: true,
    features: [
      'AWS SNS High-Deliverability Pool',
      '5 Verified Sending Domains',
      'Visual Automation Workflows',
      'A/B Testing & Smart Segments',
      'API Access & Webhooks',
      'Priority Email Support'
    ]
  },
  {
    id: 'plan_pro',
    name: 'Scale Pro',
    price: '$79',
    period: 'per month',
    subscribers: '100,000',
    emails: '500,000 / mo',
    popular: true,
    features: [
      'Dedicated AWS SNS Sending IP',
      'Unlimited Sending Domains',
      'Advanced Behavioral Automations',
      'Pre-Send Spam & DKIM Guard',
      'Dedicated Account Manager',
      '99.9% Uptime SLA'
    ]
  }
];

const INVOICES = [
  { id: 'INV-2026-009', date: 'Sep 01, 2026', plan: 'Growth Plan ($29/mo)', amount: '$29.00', status: 'Paid' },
  { id: 'INV-2026-008', date: 'Aug 01, 2026', plan: 'Growth Plan ($29/mo)', amount: '$29.00', status: 'Paid' },
  { id: 'INV-2026-007', date: 'Jul 01, 2026', plan: 'Free Starter Plan', amount: '$0.00', status: 'Paid' }
];

export default function BillingManager() {
  const { user } = useAuth();
  const [currentPlanId, setCurrentPlanId] = useState('plan_growth');
  const [invoices] = useState(INVOICES);
  const [selectedPlanModal, setSelectedPlanModal] = useState(null);

  const handleSelectPlan = (plan) => {
    if (plan.id === currentPlanId) return;
    setSelectedPlanModal(plan);
  };

  const confirmPlanChange = () => {
    if (!selectedPlanModal) return;
    setCurrentPlanId(selectedPlanModal.id);
    auditService.logEvent(
      'PLAN_CHANGED',
      'Billing',
      `Switched subscription plan to ${selectedPlanModal.name} (${selectedPlanModal.price}/mo)`,
      user?.name
    );
    setSelectedPlanModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-950 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-slate-950" />
            Billing & Subscription Usage
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your workspace subscription tier, monitor AWS SNS sending quotas, and view invoice history.
          </p>
        </div>
      </div>

      {/* Real-time Quota Meters */}
      <Card className="p-6 space-y-4 bg-white border-slate-200 shadow-sm">
        <h2 className="text-xs font-bold text-slate-950 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-slate-950" />
          Monthly Quota & Resource Usage
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email Quota */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs">
              <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                <Send className="w-3.5 h-3.5 text-slate-950" /> Monthly Emails Sent
              </span>
              <span className="font-mono text-slate-950 font-bold">24,150 / 100,000</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-black h-2 rounded-full transition-all" style={{ width: '24.15%' }} />
            </div>
            <p className="text-[10px] text-slate-500 text-right">Resets Oct 1st (75,850 remaining)</p>
          </div>

          {/* Contact Quota */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs">
              <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-slate-950" /> Active Contacts Limit
              </span>
              <span className="font-mono text-slate-950 font-bold">12,480 / 25,000</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-slate-800 h-2 rounded-full transition-all" style={{ width: '49.92%' }} />
            </div>
            <p className="text-[10px] text-slate-500 text-right">49.9% capacity used</p>
          </div>

          {/* Domain Quota */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs">
              <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                <Globe className="w-3.5 h-3.5 text-slate-950" /> Verified Domains
              </span>
              <span className="font-mono text-slate-950 font-bold">2 / 5 Verified</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-slate-600 h-2 rounded-full transition-all" style={{ width: '40%' }} />
            </div>
            <p className="text-[10px] text-slate-500 text-right">3 domain slots remaining</p>
          </div>
        </div>
      </Card>

      {/* Subscription Plans Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold font-heading text-slate-950">Select Subscription Tier</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => {
            const isCurrent = plan.id === currentPlanId;
            return (
              <Card
                key={plan.id}
                className={`p-6 flex flex-col justify-between relative transition-all bg-white ${
                  isCurrent
                    ? 'border-black ring-2 ring-black shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="text-[10px] px-2 py-0.5 shadow-sm bg-black text-white border-black font-semibold">Most Popular</Badge>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-4">
                    <Badge className="text-[10px] px-2 py-0.5 border-black text-black bg-white font-bold">Active Plan</Badge>
                  </div>
                )}

                <div className="space-y-4 pt-2">
                  <div>
                    <h3 className="text-lg font-bold font-heading text-slate-950">{plan.name}</h3>
                    <div className="flex items-baseline space-x-1 mt-1">
                      <span className="text-3xl font-bold text-slate-950 font-heading">{plan.price}</span>
                      <span className="text-xs text-slate-500">/{plan.period}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs border-y border-slate-200 py-3 text-slate-700 font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Subscriber Limit:</span>
                      <span className="font-bold text-slate-950">{plan.subscribers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly Email Limit:</span>
                      <span className="font-bold text-slate-950">{plan.emails}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-700">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-slate-950 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Button
                    variant={isCurrent ? 'outline' : 'default'}
                    disabled={isCurrent}
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full ${isCurrent ? 'border-slate-300 bg-white text-slate-400' : 'bg-black text-white hover:bg-slate-800'}`}
                  >
                    {isCurrent ? 'Current Workspace Plan' : `Switch to ${plan.name}`}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Payment Method & Invoices Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Method */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 space-y-4 bg-white border-slate-200">
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-3 flex items-center justify-between">
              <span>Payment Method</span>
              <Badge variant="outline" className="text-[9px] border-slate-300 bg-slate-50 text-slate-900">Default</Badge>
            </h3>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="w-10 h-7 rounded bg-black flex items-center justify-center font-bold text-[10px] text-white">
                VISA
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-950">Visa ending in 4242</div>
                <div className="text-[10px] text-slate-500">Expires 12 / 2028</div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-slate-950 font-bold hover:bg-slate-200">
                Update
              </Button>
            </div>
          </Card>
        </div>

        {/* Invoice History Table */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="overflow-hidden bg-white border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Billing Invoice History</h3>
              <span className="text-[10px] text-slate-500">Auto-billed monthly</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-4">Invoice ID</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Plan</th>
                    <th className="py-2.5 px-4">Amount</th>
                    <th className="py-2.5 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-xs font-bold text-slate-950">
                        {inv.id}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 text-xs">{inv.date}</td>
                      <td className="py-2.5 px-4 text-slate-950 font-semibold">{inv.plan}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-950">{inv.amount}</td>
                      <td className="py-2.5 px-4 text-right">
                        <Button variant="outline" size="sm" className="text-slate-900 border-slate-300 hover:bg-slate-100 gap-1 text-[11px]">
                          <Download className="w-3 h-3" /> PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Plan Change Confirmation Modal */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4 bg-white border-slate-200 shadow-2xl">
            <h3 className="text-base font-bold font-heading text-slate-950 flex items-center gap-2">
              Confirm Subscription Change
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              You are switching your workspace plan to <strong className="text-slate-950">{selectedPlanModal.name} ({selectedPlanModal.price}/mo)</strong>.
            </p>
            <p className="text-[11px] text-slate-500">
              Unused quota will be prorated automatically on your next billing statement.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setSelectedPlanModal(null)} className="border-slate-300 bg-white text-slate-900 hover:bg-slate-100">
                Cancel
              </Button>
              <Button size="sm" onClick={confirmPlanChange} className="gap-1.5 bg-black text-white hover:bg-slate-800">
                Confirm Plan Switch
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
