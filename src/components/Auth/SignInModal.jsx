import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Key, Mail, Shield, X } from 'lucide-react';

export default function SignInModal({ isOpen, onClose, onSwitchToSignUp }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      setLoading(false);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <Card className="w-full max-w-md border-slate-200 bg-white shadow-2xl relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2 text-slate-950 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-slate-950" />
            <span>Sign In</span>
          </div>
          <CardTitle className="text-2xl font-bold font-heading text-slate-950">Welcome Back</CardTitle>
          <CardDescription className="text-slate-500">
            Sign in to access your EmailBhejo workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-md font-medium">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-950" /> Email Address
              </label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-slate-200 text-slate-950 focus:border-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-950" /> Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-slate-200 text-slate-950 focus:border-black"
              />
            </div>

            <Button type="submit" className="w-full mt-2 gap-2 bg-black text-white hover:bg-slate-800" disabled={loading}>
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center border-t border-slate-200 pt-4 text-xs text-slate-500">
          <div>
            Don't have an account yet?{' '}
            <button
              onClick={onSwitchToSignUp}
              className="text-slate-950 hover:underline font-bold"
            >
              Sign Up Now
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
