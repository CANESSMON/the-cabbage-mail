import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Sparkles, Building, Mail, Lock, User } from 'lucide-react';

export default function SignUpModal({ isOpen, onClose, onSwitchToSignIn }) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      signUp(fullName, email, password, orgName);
      setLoading(false);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to sign up.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/90 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Self-Service Registration</span>
          </div>
          <CardTitle className="text-2xl font-bold font-heading text-slate-100">Create your Account</CardTitle>
          <CardDescription className="text-slate-400">
            Start managing multi-client email marketing with AWS SNS cloud delivery.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" /> Full Name *
              </label>
              <Input
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Business Email *
              </label>
              <Input
                type="email"
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Password *
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" /> Company / Workspace Name
              </label>
              <Input
                type="text"
                placeholder="Acme Growth Marketing"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full mt-2 gap-2" disabled={loading}>
              <UserPlus className="w-4 h-4" />
              {loading ? 'Registering Account...' : 'Sign Up & Launch Workspace'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center border-t border-slate-800/80 pt-4 text-xs text-slate-400">
          <div>
            Already have an account?{' '}
            <button
              onClick={onSwitchToSignIn}
              className="text-emerald-400 hover:underline font-medium"
            >
              Sign In
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
