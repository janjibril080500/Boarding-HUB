import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, X, Sparkles, Building2, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { Role } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, setIsOnboarding } = useApp();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT' | 'VERIFY'>('LOGIN');
  const [role, setRole] = useState<Role>('OWNER');
  const [email, setEmail] = useState('jan.owner@boardinghub.ph');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Jan Dela Cruz');
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'REGISTER' && role === 'OWNER') {
      login(email, 'OWNER');
      setIsOnboarding(true);
    } else {
      login(email, role);
    }
    onClose();
  };

  const handleGoogleAuth = () => {
    login(role === 'OWNER' ? 'jan.owner@gmail.com' : 'juan.tenant@gmail.com', role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0B171B] border border-teal-500/30 shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Branding */}
        <div className="text-center mb-6">
          <Logo size="md" className="justify-center mb-2" />
          <p className="text-xs text-slate-400">
            {mode === 'LOGIN' && 'Sign in to access your properties & tenant portal'}
            {mode === 'REGISTER' && 'Create your modern Philippine property workspace'}
            {mode === 'FORGOT' && 'Reset your password securely via email'}
            {mode === 'VERIFY' && 'Email confirmation link sent'}
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#101F23] border border-white/[0.06] mb-5">
          <button
            type="button"
            onClick={() => {
              setRole('OWNER');
              setEmail('jan.owner@boardinghub.ph');
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              role === 'OWNER'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Property Owner
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('TENANT');
              setEmail('juan.delacruz@gmail.com');
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              role === 'TENANT'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tenant Resident
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'REGISTER' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Jan Dela Cruz"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {mode !== 'FORGOT' && mode !== 'VERIFY' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                {mode === 'LOGIN' && (
                  <button
                    type="button"
                    onClick={() => setMode('FORGOT')}
                    className="text-[11px] text-teal-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'LOGIN' && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-white/[0.1] bg-[#101F23] text-teal-500 focus:ring-0"
                />
                Remember this device
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
          >
            {mode === 'LOGIN' && 'Sign In'}
            {mode === 'REGISTER' && 'Create Free Workspace'}
            {mode === 'FORGOT' && 'Send Password Reset Link'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0B171B] px-2 text-slate-400">or connect with</span>
          </div>
        </div>

        {/* Google SSO */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl bg-[#101F23] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.2C.7 9.6 0 12.3 0 15.2c0 2.9.7 5.6 1.9 8l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16.4C3.7 20.2 7.5 23.5 12 23.5z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Toggle between Login and Register */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {mode === 'LOGIN' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('REGISTER')}
                className="font-bold text-teal-400 hover:underline"
              >
                Register property
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('LOGIN')}
                className="font-bold text-teal-400 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
