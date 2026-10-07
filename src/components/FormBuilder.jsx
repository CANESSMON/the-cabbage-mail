import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  FileText, Copy, Check, Eye, Code2, Plus, Sliders
} from 'lucide-react';

const PRESET_FORMS = [
  {
    id: 'form_1',
    name: 'Newsletter Signup Bar',
    title: 'Subscribe to Our Weekly Newsletter',
    description: 'Get the latest industry news, tips, and insights delivered straight to your inbox.',
    buttonText: 'Join Newsletter',
    accentColor: 'black',
    fields: ['email', 'firstName'],
    targetTag: 'newsletter',
    subscribersCount: 1420
  },
  {
    id: 'form_2',
    name: 'Lead Magnet Download Form',
    title: 'Download Free Email Marketing Guide',
    description: 'Enter your work email to receive our 2026 Deliverability Masterclass eBook.',
    buttonText: 'Download eBook Now',
    accentColor: 'black',
    fields: ['email', 'firstName', 'company'],
    targetTag: 'lead-magnet',
    subscribersCount: 840
  },
  {
    id: 'form_3',
    name: 'Webinar Event Registration',
    title: 'Reserve Your Seat — LIVE Webinar',
    description: 'Join our upcoming webinar on AWS SNS Email Infrastructure scale.',
    buttonText: 'Register Free',
    accentColor: 'black',
    fields: ['email', 'firstName', 'lastName', 'phone'],
    targetTag: 'webinar-lead',
    subscribersCount: 310
  }
];

export default function FormBuilder() {
  const [forms, setForms] = useState(PRESET_FORMS);
  const [activeFormId, setActiveFormId] = useState('form_1');
  const [copiedCode, setCopiedCode] = useState(false);

  const activeForm = forms.find(f => f.id === activeFormId) || forms[0];

  const updateActiveForm = (key, value) => {
    setForms(forms.map(f => f.id === activeFormId ? { ...f, [key]: value } : f));
  };

  const toggleField = (fieldId) => {
    if (fieldId === 'email') return; // email is mandatory
    const currentFields = activeForm.fields;
    const newFields = currentFields.includes(fieldId)
      ? currentFields.filter(f => f !== fieldId)
      : [...currentFields, fieldId];
    updateActiveForm('fields', newFields);
  };

  const handleCreateNew = () => {
    const newId = 'form_' + Date.now();
    const newForm = {
      id: newId,
      name: 'New Custom Form',
      title: 'Join Our VIP Community',
      description: 'Sign up to receive exclusive offers and priority updates.',
      buttonText: 'Subscribe Now',
      accentColor: 'black',
      fields: ['email', 'firstName'],
      targetTag: 'website-signup',
      subscribersCount: 0
    };
    setForms([...forms, newForm]);
    setActiveFormId(newId);
  };

  const generateEmbedSnippet = () => {
    return `<!-- EmailBhejo Embed Code -->
<div id="emailbhejo-form-${activeForm.id}"></div>
<script 
  src="https://cdn.emailbhejo.com/v1/embed.js" 
  data-form-id="${activeForm.id}"
  async>
</script>`;
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(generateEmbedSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-950 tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-slate-950" />
            Signup Form Builder
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Design embeddable lead capture forms for websites, blogs, and landing pages with real-time preview.
          </p>
        </div>

        <Button onClick={handleCreateNew} className="gap-2 bg-black text-white hover:bg-slate-800">
          <Plus className="w-4 h-4" />
          Create New Form
        </Button>
      </div>

      {/* Form Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {forms.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFormId(f.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              activeFormId === f.id
                ? 'bg-black text-white border border-black shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{f.name}</span>
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 ml-1 bg-slate-100 text-slate-900 border-slate-200">
              {f.subscribersCount} subs
            </Badge>
          </button>
        ))}
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="p-5 space-y-4 bg-white border-slate-200">
            <h2 className="text-sm font-bold font-heading text-slate-950 flex items-center gap-2 border-b border-slate-200 pb-3">
              <Sliders className="w-4 h-4 text-slate-950" />
              Form Configuration
            </h2>

            {/* Form Name */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Internal Name</label>
              <input
                type="text"
                value={activeForm.name}
                onChange={(e) => updateActiveForm('name', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-950 focus:outline-none focus:border-black shadow-sm"
              />
            </div>

            {/* Display Title */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Form Heading</label>
              <input
                type="text"
                value={activeForm.title}
                onChange={(e) => updateActiveForm('title', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-950 focus:outline-none focus:border-black shadow-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Form Subtitle</label>
              <textarea
                value={activeForm.description}
                onChange={(e) => updateActiveForm('description', e.target.value)}
                rows={2}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-950 focus:outline-none focus:border-black shadow-sm"
              />
            </div>

            {/* Button Text */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Submit Button Text</label>
              <input
                type="text"
                value={activeForm.buttonText}
                onChange={(e) => updateActiveForm('buttonText', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-950 focus:outline-none focus:border-black shadow-sm"
              />
            </div>

            {/* Target Tag */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Auto-Assign Tag on Submit</label>
              <input
                type="text"
                value={activeForm.targetTag}
                onChange={(e) => updateActiveForm('targetTag', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-950 focus:outline-none focus:border-black font-mono shadow-sm"
              />
            </div>

            {/* Fields Checkboxes */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-2">Form Input Fields</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'email', label: 'Email Address (Req)', required: true },
                  { id: 'firstName', label: 'First Name' },
                  { id: 'lastName', label: 'Last Name' },
                  { id: 'phone', label: 'Phone Number' },
                  { id: 'company', label: 'Company Name' }
                ].map(field => (
                  <label
                    key={field.id}
                    className={`flex items-center space-x-2 p-2 rounded border text-xs cursor-pointer ${
                      activeForm.fields.includes(field.id)
                        ? 'bg-slate-100 border-slate-300 text-slate-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={activeForm.fields.includes(field.id)}
                      disabled={field.required}
                      onChange={() => toggleField(field.id)}
                      className="rounded border-slate-300 text-black focus:ring-black"
                    />
                    <span>{field.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Live Preview & Code Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Interactive Preview */}
          <Card className="p-6 bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
              <span className="text-xs font-bold text-slate-950 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-slate-950" />
                Live Form Preview
              </span>
              <Badge variant="outline" className="text-[10px] border-slate-300 bg-white text-slate-900">Embedded Web View</Badge>
            </div>

            {/* Rendered Mock Form */}
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-white border border-slate-200 shadow-lg space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-slate-950 font-heading">{activeForm.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{activeForm.description}</p>
              </div>

              <div className="space-y-3 pt-2">
                {activeForm.fields.includes('firstName') && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">First Name</label>
                    <input
                      type="text"
                      placeholder="Jane"
                      disabled
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-950"
                    />
                  </div>
                )}
                {activeForm.fields.includes('lastName') && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      disabled
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-950"
                    />
                  </div>
                )}
                {activeForm.fields.includes('email') && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Work Email</label>
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      disabled
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-950"
                    />
                  </div>
                )}
                {activeForm.fields.includes('company') && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Company</label>
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      disabled
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-950"
                    />
                  </div>
                )}
                {activeForm.fields.includes('phone') && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      disabled
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-950"
                    />
                  </div>
                )}

                <button
                  disabled
                  className="w-full py-2.5 rounded-lg font-bold text-xs text-white bg-black shadow-md"
                >
                  {activeForm.buttonText}
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 pt-1 flex items-center justify-center gap-1 font-medium">
                <span>We respect your privacy. Unsubscribe anytime.</span>
              </p>
            </div>
          </Card>

          {/* Embed Code Card */}
          <Card className="p-5 space-y-3 bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-950 flex items-center gap-1.5 uppercase tracking-wider">
                <Code2 className="w-4 h-4 text-slate-950" />
                Embed Code Snippet
              </h3>
              <Button size="sm" onClick={handleCopySnippet} className="gap-1.5 text-xs bg-black text-white hover:bg-slate-800">
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied!' : 'Copy Snippet'}
              </Button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-900 rounded-lg text-[11px] font-mono text-slate-100 overflow-x-auto">
              {generateEmbedSnippet()}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  );
}
