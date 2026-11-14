import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Briefcase, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  EyeOff 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    login, 
    signup, 
    quickLoginAsShivam 
  } = useAuth();
  const { addToast } = useTasks();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Founder & Lead Designer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }
      const res = login(email, password);
      if (!res.success) {
        setError(res.error || 'Failed to sign in.');
      } else {
        addToast(`Signed in as ${email}`, 'success');
        if (onClose) onClose();
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      const res = signup(name, email, password, role);
      if (!res.success) {
        setError(res.error || 'Failed to register account.');
      } else {
        addToast(`Welcome to TASKFLOW, ${name}! Your private workspace is ready.`, 'success');
        if (onClose) onClose();
      }
    }
  };

  const handleQuickShivam = () => {
    quickLoginAsShivam();
    addToast('Signed in as Shivam Jagtap (Founder & Lead Designer)', 'success');
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-md bg-[#141513]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-modal animate-modal-in overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Branding */}
        <div className="p-6 border-b border-white/[0.08] relative bg-white/[0.02]">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 text-[#9B9D95] hover:text-[#F6F5F0] p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1C1D1A] to-[#141513] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)] flex items-center justify-center text-[#C5A46D] shadow-sm font-semibold text-xs">
              TF
            </div>
            <div>
              <span className="font-semibold text-sm tracking-wider text-[#F6F5F0]">
                TASKFLOW
              </span>
              <p className="text-[10px] text-[#9B9D95]">
                Make Every Day Count.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-medium tracking-tight text-[#F6F5F0] mt-4">
            {mode === 'login' ? 'Welcome back.' : 'Create your workspace.'}
          </h2>
          <p className="text-xs text-[#9B9D95] mt-1">
            {mode === 'login' 
              ? 'Sign in to access your saved tasks and workspace state.' 
              : 'Register to start an isolated personal task database.'}
          </p>

          {/* Quick Login Banner for Shivam Jagtap */}
          <div className="mt-4 p-3 bg-white/[0.03] backdrop-blur-md border border-white/[0.09] hover:border-[#C5A46D]/60 rounded-xl flex items-center justify-between gap-3 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C5A46D] shadow-[0_0_8px_#C5A46D]" />
                <span className="text-xs font-medium text-[#F6F5F0] truncate">Shivam Jagtap</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#C5A46D]/15 text-[#C5A46D] border border-[#C5A46D]/30">Owner</span>
              </div>
              <div className="text-[10px] text-[#9B9D95] truncate">
                shivam@taskflow.dev · Founder & Lead Designer
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickShivam}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#C5A46D] to-[#D4B57E] hover:brightness-110 text-[#101110] transition-all shadow-[0_2px_12px_rgba(197,164,109,0.3)] active:scale-[0.98]"
            >
              <Sparkles className="w-3 h-3" />
              <span>One-Click Login</span>
            </button>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-white/[0.08] bg-black/40 text-xs font-medium">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2.5 text-center transition-all border-b-2 ${
              mode === 'login'
                ? 'border-[#C5A46D] text-[#F6F5F0] bg-white/[0.04]'
                : 'border-transparent text-[#9B9D95] hover:text-[#F6F5F0]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-2.5 text-center transition-all border-b-2 ${
              mode === 'signup'
                ? 'border-[#C5A46D] text-[#F6F5F0] bg-white/[0.04]'
                : 'border-transparent text-[#9B9D95] hover:text-[#F6F5F0]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-[#D77C76] bg-[#D77C76]/12 border border-[#D77C76]/30 rounded-lg animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#9B9D95] font-semibold mb-1.5">
                Full Name <span className="text-[#D77C76]">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-[#9B9D95] pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Shivam Jagtap"
                  className="w-full bg-white/[0.035] hover:bg-white/[0.05] border border-white/[0.09] rounded-lg pl-9 pr-3 py-2 text-sm text-[#F6F5F0] placeholder-[#9B9D95]/45 focus:outline-none focus:border-[#C5A46D]/80 focus:ring-2 focus:ring-[#C5A46D]/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#9B9D95] font-semibold mb-1.5">
              Email Address <span className="text-[#D77C76]">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#9B9D95] pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-white/[0.035] hover:bg-white/[0.05] border border-white/[0.09] rounded-lg pl-9 pr-3 py-2 text-sm text-[#F6F5F0] placeholder-[#9B9D95]/45 focus:outline-none focus:border-[#C5A46D]/80 focus:ring-2 focus:ring-[#C5A46D]/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#9B9D95] font-semibold mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#9B9D95] pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/[0.035] hover:bg-white/[0.05] border border-white/[0.09] rounded-lg pl-9 pr-10 py-2 text-sm text-[#F6F5F0] placeholder-[#9B9D95]/45 focus:outline-none focus:border-[#C5A46D]/80 focus:ring-2 focus:ring-[#C5A46D]/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#9B9D95] hover:text-[#F6F5F0] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#9B9D95] font-semibold mb-1.5">
                Role / Title
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-[#9B9D95] pointer-events-none" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Founder & Lead Designer"
                  className="w-full bg-white/[0.035] hover:bg-white/[0.05] border border-white/[0.09] rounded-lg pl-9 pr-3 py-2 text-sm text-[#F6F5F0] placeholder-[#9B9D95]/45 focus:outline-none focus:border-[#C5A46D]/80 focus:ring-2 focus:ring-[#C5A46D]/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#C5A46D] to-[#D4B57E] hover:brightness-110 text-[#101110] font-semibold text-sm transition-all shadow-[0_2px_14px_rgba(197,164,109,0.35)] active:scale-[0.99]"
            >
              <span>{mode === 'login' ? 'Sign In' : 'Create Account & Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3 bg-black/30 border-t border-white/[0.07] text-center text-[11px] text-[#9B9D95]">
          Each account has isolated local task storage and data persistence.
        </div>
      </div>
    </div>
  );
};
