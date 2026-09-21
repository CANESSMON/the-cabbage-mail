import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Users, UserPlus, Upload, Search, Check, Mail, Tag } from 'lucide-react';

export default function SubscriberManager() {
  const { activeClient, subscribers, addSubscriber } = useAuth();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tags, setTags] = useState('Newsletter');
  const [csvContent, setCsvContent] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.firstName.toLowerCase().includes(search.toLowerCase()) ||
    s.lastName.toLowerCase().includes(search.toLowerCase())
  );

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!email) return;
    addSubscriber({ email, firstName, lastName, tags });
    setEmail('');
    setFirstName('');
    setLastName('');
    setTags('Newsletter');
    setShowAddModal(false);
  };

  const handleCsvImport = (e) => {
    e.preventDefault();
    if (!csvContent.trim()) return;

    const lines = csvContent.trim().split('\n');
    let importedCount = 0;

    lines.forEach((line) => {
      const parts = line.split(',').map(p => p.trim());
      if (parts[0] && parts[0].includes('@')) {
        addSubscriber({
          email: parts[0],
          firstName: parts[1] || '',
          lastName: parts[2] || '',
          tags: parts[3] || 'CSV-Import',
        });
        importedCount++;
      }
    });

    setImportSuccess(`Successfully imported ${importedCount} subscribers!`);
    setTimeout(() => {
      setImportSuccess('');
      setCsvContent('');
      setShowCsvModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Subscriber Audience</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Managing audience list for client <strong className="text-slate-200">{activeClient?.name}</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowCsvModal(true)} className="gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Batch Import CSV
          </Button>
          <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-1.5">
            <UserPlus className="w-3.5 h-3.5" /> Add Subscriber
          </Button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <Input
            type="text"
            placeholder="Search email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <span className="text-slate-400">Total Contacts: <strong className="text-slate-100">{subscribers.length}</strong></span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-400">Active: <strong className="text-emerald-400">{subscribers.filter(s => s.status === 'ACTIVE').length}</strong></span>
        </div>
      </div>

      {/* Subscriber Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Subscriber</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Tags</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                    No subscribers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-100">
                      {sub.firstName || sub.lastName ? `${sub.firstName} ${sub.lastName}` : '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      {sub.email}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {sub.tags?.map((t, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[10px] py-0 px-1.5">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default" className="text-[10px]">
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(sub.addedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 font-heading">Add Single Subscriber</h3>
            <form onSubmit={handleManualAdd} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Email Address *</label>
                <Input
                  type="email"
                  placeholder="subscriber@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">First Name</label>
                  <Input
                    type="text"
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Last Name</label>
                  <Input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Tags (Comma Separated)</label>
                <Input
                  type="text"
                  placeholder="VIP, Weekly"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Save Contact
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 font-heading">Batch CSV Import</h3>
            <p className="text-xs text-slate-400">
              Paste comma-separated data in format: <code className="text-emerald-400 font-mono">email, firstName, lastName, tag</code>
            </p>

            {importSuccess && (
              <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md flex items-center gap-2">
                <Check className="w-4 h-4" /> {importSuccess}
              </div>
            )}

            <form onSubmit={handleCsvImport} className="space-y-3">
              <textarea
                rows="6"
                placeholder={`john.doe@example.com, John, Doe, VIP\nalisa.smith@company.com, Alisa, Smith, Lead`}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 font-mono text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
              <div className="flex items-center justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCsvModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Process Import
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
