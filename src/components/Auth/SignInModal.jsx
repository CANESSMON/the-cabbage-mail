import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Key, Mail, Sparkles } from 'lucide-react';

export default function SignInModal({ isOpen, onClose, onSwitchToSignUp }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('alex@acmemarketing.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      signIn(email, password);
      setLoading(false);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('alex@acmemarketing.com');
    setPassword('password123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/90 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Member Sign In</span>
          </div>
          <CardTitle className="text-2xl font-bold font-heading text-slate-100">Welcome Back</CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to access your Cabbage Mail workspaces & campaign stats.
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
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Business Email
              </label>
              <Input
                type="email"
                placeholder="alex@acmemarketing.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" /> Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2 gap-2" disabled={loading}>
              <LogIn className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800/80 rounded-md flex items-center justify-between text-xs text-slate-400">
            <span>Demo credentials pre-filled</span>
            <button
              onClick={handleDemoFill}
              className="text-emerald-400 hover:underline font-medium text-[11px]"
            >
              Reset Demo Data
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center border-t border-slate-800/80 pt-4 text-xs text-slate-400">
          <div>
            Don't have an account yet?{' '}
            <button
              onClick={onSwitchToSignUp}
              className="text-emerald-400 hover:underline font-medium"
            >
              Sign Up Now
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
