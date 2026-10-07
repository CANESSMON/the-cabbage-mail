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

    setImportSuccess(`Successfully imported ${importedCount} contacts!`);
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
          <h1 className="text-2xl font-extrabold font-heading text-slate-950 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-slate-900" />
            <span>Contacts</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Managing audience list for client <strong className="text-slate-950 font-bold">{activeClient?.name}</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowCsvModal(true)} className="gap-1.5 border-slate-300 text-slate-900 bg-white hover:bg-slate-100 font-semibold">
            <Upload className="w-3.5 h-3.5 text-slate-700" /> Batch Import CSV
          </Button>
          <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-1.5 bg-black hover:bg-slate-800 text-white font-semibold shadow-xs">
            <UserPlus className="w-3.5 h-3.5" /> Add Contact
          </Button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <Input
            type="text"
            placeholder="Search email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-slate-50 border-slate-200 text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-slate-900"
          />
        </div>
        <div className="flex items-center space-x-4 text-xs font-medium">
          <span className="text-slate-600">Total Contacts: <strong className="text-slate-950 font-bold">{subscribers.length}</strong></span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600">Active: <strong className="text-slate-950 font-bold">{subscribers.filter(s => s.status === 'ACTIVE').length}</strong></span>
        </div>
      </div>

      {/* Subscriber Table */}
      <Card className="bg-white border-slate-200/90 shadow-2xs">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Subscriber</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Tags</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500 font-medium">
                    No subscribers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-950">
                      {sub.firstName || sub.lastName ? `${sub.firstName} ${sub.lastName}` : '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700">
                      {sub.email}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {sub.tags?.map((t, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px] py-0 px-1.5 border-slate-300 text-slate-900 bg-slate-100">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px] border-slate-300 text-slate-950 font-bold bg-slate-100">
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-medium">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-2xl space-y-4 text-slate-950">
            <h3 className="text-lg font-extrabold text-slate-950 font-heading">Add Single Subscriber</h3>
            <form onSubmit={handleManualAdd} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address *</label>
                <Input
                  type="email"
                  placeholder="subscriber@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-slate-950 focus:bg-white focus:border-slate-900"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">First Name</label>
                  <Input
                    type="text"
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-slate-50 border-slate-200 text-slate-950 focus:bg-white focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Last Name</label>
                  <Input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-slate-50 border-slate-200 text-slate-950 focus:bg-white focus:border-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tags (Comma Separated)</label>
                <Input
                  type="text"
                  placeholder="VIP, Weekly"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-slate-950 focus:bg-white focus:border-slate-900"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)} className="border-slate-300 text-slate-700">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-black hover:bg-slate-800 text-white font-semibold">
                  Save Contact
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 shadow-2xl space-y-4 text-slate-950">
            <h3 className="text-lg font-extrabold text-slate-950 font-heading">Batch CSV Import</h3>
            <p className="text-xs text-slate-500">
              Paste comma-separated data in format: <code className="text-slate-950 font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">email, firstName, lastName, tag</code>
            </p>

            {importSuccess && (
              <div className="p-3 text-xs bg-slate-100 border border-slate-200 text-slate-950 rounded-md flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-slate-950" /> {importSuccess}
              </div>
            )}

            <form onSubmit={handleCsvImport} className="space-y-3">
              <textarea
                rows="6"
                placeholder={`john.doe@example.com, John, Doe, VIP\nalisa.smith@company.com, Alisa, Smith, Lead`}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-3 font-mono text-xs text-slate-950 focus:outline-none focus:border-slate-900 focus:bg-white"
                required
              />
              <div className="flex items-center justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCsvModal(false)} className="border-slate-300 text-slate-700">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-black hover:bg-slate-800 text-white font-semibold">
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

