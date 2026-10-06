import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Key, Mail, Shield } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md border-slate-200 bg-white shadow-2xl relative overflow-hidden">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2 text-slate-950 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-slate-950" />
            <span>Member Sign In</span>
          </div>
          <CardTitle className="text-2xl font-bold font-heading text-slate-950">Welcome Back</CardTitle>
          <CardDescription className="text-slate-500">
            Sign in to access your EmailBhejo workspaces & campaign stats.
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
                <Mail className="w-3.5 h-3.5 text-slate-950" /> Business Email
              </label>
              <Input
                type="email"
                placeholder="alex@acmemarketing.com"
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
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between text-xs text-slate-600">
            <span>Demo credentials pre-filled</span>
            <button
              onClick={handleDemoFill}
              className="text-slate-950 hover:underline font-bold text-[11px]"
            >
              Reset Demo Data
            </button>
          </div>
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
