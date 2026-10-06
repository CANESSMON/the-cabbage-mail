import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  UsersRound, UserPlus, Shield, Trash2, Mail, CheckCircle2,
  Lock, ChevronDown, Check, Sparkles
} from 'lucide-react';
import { auditService } from '../services/auditService';

import { useAuth } from '../context/AuthContext';

const ROLES = [
  { id: 'Owner', label: 'Workspace Owner', desc: 'Full billing, workspace deletion, and team control.' },
  { id: 'Admin', label: 'Administrator', desc: 'Manage domains, API keys, campaigns, and team members.' },
  { id: 'Editor', label: 'Campaign Editor', desc: 'Create templates, compose campaigns, and manage subscribers.' },
  { id: 'Viewer', label: 'Read-Only Viewer', desc: 'View analytics dashboards and campaign history.' }
];

export default function TeamManager() {
  const { user } = useAuth();
  const [members, setMembers] = useState([
    {
      id: 'mem_owner',
      name: user?.name || 'Workspace Admin',
      email: user?.email || 'admin@workspace.com',
      role: 'Owner',
      status: 'Active',
      joined: new Date().toISOString().slice(0, 10),
      lastActive: 'Just now'
    }
  ]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember = {
      id: 'mem_' + Date.now(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Pending',
      joined: new Date().toISOString().slice(0, 10),
      lastActive: 'Invitation sent'
    };

    setMembers([...members, newMember]);
    auditService.logEvent('TEAM_INVITE_SENT', 'Team', `Invited ${inviteEmail} with role "${inviteRole}"`);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleRemoveMember = (id, name, email) => {
    if (window.confirm(`Are you sure you want to remove ${name} (${email}) from workspace?`)) {
      setMembers(members.filter(m => m.id !== id));
      auditService.logEvent('TEAM_MEMBER_REMOVED', 'Team', `Removed ${email} from workspace`, 'Alex Rivera', 'warning');
    }
  };

  const handleChangeRole = (id, newRole) => {
    setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m));
    auditService.logEvent('ROLE_CHANGED', 'Team', `Updated team member role to ${newRole}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-slate-100 tracking-tight flex items-center gap-2.5">
            <UsersRound className="w-6 h-6 text-emerald-400" />
            Team & Workspace Access
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Invite team members, assign role-based permissions, and manage collaborator access.
          </p>
        </div>

        <Button onClick={() => setShowInviteModal(true)} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Team Member
        </Button>
      </div>

      {/* Members List */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold font-heading text-slate-200">Workspace Members</h2>
          <Badge variant="outline" className="text-[10px]">{members.length} Members</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs uppercase">
                        {m.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{m.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {m.role === 'Owner' ? (
                      <Badge variant="success" className="text-[10px] px-2 py-0.5">Owner</Badge>
                    ) : (
                      <select
                        value={m.role}
                        onChange={(e) => handleChangeRole(m.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={m.status === 'Active' ? 'success' : 'warning'}
                      className="text-[10px] px-2 py-0.5"
                    >
                      {m.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {m.lastActive}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {m.role !== 'Owner' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(m.id, m.name, m.email)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Permission Matrix */}
      <Card className="p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Shield className="w-4 h-4 text-emerald-400" />
          Role Permission Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                <th className="py-2 px-3">Permission</th>
                <th className="py-2 px-3 text-center">Owner</th>
                <th className="py-2 px-3 text-center">Admin</th>
                <th className="py-2 px-3 text-center">Editor</th>
                <th className="py-2 px-3 text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {[
                { perm: 'Create & Send Campaigns', owner: true, admin: true, editor: true, viewer: false },
                { perm: 'Manage Subscribers & Segments', owner: true, admin: true, editor: true, viewer: false },
                { perm: 'Verify Sending Domains (DKIM/SPF)', owner: true, admin: true, editor: false, viewer: false },
                { perm: 'Generate API Keys & Webhooks', owner: true, admin: true, editor: false, viewer: false },
                { perm: 'Invite & Manage Team Members', owner: true, admin: true, editor: false, viewer: false },
                { perm: 'View Billing & Manage Subscription', owner: true, admin: false, editor: false, viewer: false },
                { perm: 'View Analytics & Audit Logs', owner: true, admin: true, editor: true, viewer: true }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-medium text-slate-200">{row.perm}</td>
                  <td className="py-2.5 px-3 text-center">{row.owner ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <Lock className="w-3.5 h-3.5 text-slate-600 mx-auto" />}</td>
                  <td className="py-2.5 px-3 text-center">{row.admin ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <Lock className="w-3.5 h-3.5 text-slate-600 mx-auto" />}</td>
                  <td className="py-2.5 px-3 text-center">{row.editor ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <Lock className="w-3.5 h-3.5 text-slate-600 mx-auto" />}</td>
                  <td className="py-2.5 px-3 text-center">{row.viewer ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <Lock className="w-3.5 h-3.5 text-slate-600 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-5 bg-slate-900 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                Invite Team Member
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-200">×</button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Assign Role</label>
                <div className="space-y-2">
                  {ROLES.filter(r => r.id !== 'Owner').map(role => (
                    <label
                      key={role.id}
                      className={`flex items-start space-x-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        inviteRole === role.id
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        checked={inviteRole === role.id}
                        onChange={() => setInviteRole(role.id)}
                        className="mt-0.5 bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500/20"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">{role.label}</span>
                        <span className="text-[10px] text-slate-400 block">{role.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Send Invitation
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
