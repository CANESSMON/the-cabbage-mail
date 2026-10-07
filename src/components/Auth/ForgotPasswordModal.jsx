import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { useAuth } from '../../context/AuthContext';
import { Mail, Key, Shield, X, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose, onBackToSignIn }) {
  const { forgotPassword, resetPassword } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Email, 2: Code & New Password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess('Reset code sent! Check your email (or use SUPER_CODE_2026 for testing).');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      setSuccess('Password reset successfully! You can now sign in.');
      setTimeout(() => {
        onBackToSignIn();
        setStep(1);
        setEmail('');
        setCode('');
        setNewPassword('');
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setCode('');
    setNewPassword('');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose}>
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden relative" onClick={e => e.stopPropagation()}>
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <CardHeader className="space-y-1.5 bg-slate-50 border-b border-slate-100 pb-6">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-2 mx-auto">
            <Shield className="w-6 h-6 text-slate-950" />
          </div>
          <CardTitle className="text-xl font-bold font-heading text-center text-slate-950">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center text-slate-500 font-medium">
            {step === 1 ? 'Enter your email to receive a reset code.' : 'Enter your reset code and new password.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-6">
          {error && (
            <div className="mb-4 p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-md font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md font-medium">
              {success}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
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
              <Button type="submit" className="w-full mt-2 bg-black text-white hover:bg-slate-800" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-950" /> Reset Code
                </label>
                <Input
                  type="text"
                  placeholder="SUPER_CODE_2026"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="bg-white border-slate-200 text-slate-950 focus:border-black font-mono text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-950" /> New Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="bg-white border-slate-200 text-slate-950 focus:border-black"
                />
              </div>
              <Button type="submit" className="w-full mt-2 bg-black text-white hover:bg-slate-800" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center border-t border-slate-200 pt-4 text-xs text-slate-500">
          <div>
            Remembered your password?{' '}
            <button
              onClick={onBackToSignIn}
              className="text-slate-950 hover:underline font-bold inline-flex items-center"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Back to Sign In
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
