import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Edit2, Check } from 'lucide-react';
import { MokolaLogo } from './MokolaLogo';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  plan: 'Mokola Pro' | 'Mokola Enterprise';
  isLoggedIn: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
}

export function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
}: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState(currentUser?.name || '');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editedNickname, setEditedNickname] = useState(currentUser?.name || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const chosenName = nickname.trim() || email.split('@')[0] || 'Explorer';
      const newUser: UserProfile = {
        name: chosenName,
        email: email.trim() || `${chosenName.toLowerCase().replace(/\s+/g, '')}@mokola.ai`,
        plan: 'Mokola Pro',
        isLoggedIn: true,
      };
      onLoginSuccess(newUser);
      setLoading(false);
      onClose();
    }, 400);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const chosenName = nickname.trim() || 'Blueprint Wealth';
      const newUser: UserProfile = {
        name: chosenName,
        email: 'blueprintwealth6@gmail.com',
        plan: 'Mokola Pro',
        isLoggedIn: true,
      };
      onLoginSuccess(newUser);
      setLoading(false);
      onClose();
    }, 400);
  };

  const handleSaveEditedNickname = () => {
    if (!editedNickname.trim() || !currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      name: editedNickname.trim(),
    };
    onLoginSuccess(updated);
    setIsEditingNickname(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#1E1D1A] border border-[#E8E2D9] dark:border-[#383530] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[#E8E2D9] dark:border-[#33302B] flex items-center justify-between bg-[#FAF8F5] dark:bg-[#23221F]">
          <div className="flex items-center gap-2.5">
            <MokolaLogo size={24} />
            <span className="font-serif-claude text-xl font-bold text-[#242424] dark:text-[#ECE8E1]">
              Mokola AI Account
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8A857D] hover:text-[#242424] dark:hover:text-[#ECE8E1] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If Already Logged In */}
        {currentUser?.isLoggedIn ? (
          <div className="p-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 via-purple-600 to-amber-500 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="space-y-1.5">
              {isEditingNickname ? (
                <div className="flex items-center justify-center gap-1.5 max-w-xs mx-auto">
                  <input
                    type="text"
                    value={editedNickname}
                    onChange={(e) => setEditedNickname(e.target.value)}
                    placeholder="Enter your nickname"
                    className="px-3 py-1.5 text-xs rounded-lg border border-violet-400 bg-white dark:bg-[#2A2824] text-[#242424] dark:text-[#ECE8E1] focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEditedNickname}
                    className="p-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                    title="Save Nickname"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsEditingNickname(false)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-lg font-bold text-[#242424] dark:text-[#ECE8E1]">
                    {currentUser.name}
                  </h3>
                  <button
                    onClick={() => {
                      setEditedNickname(currentUser.name);
                      setIsEditingNickname(true);
                    }}
                    className="p-1 text-[#8A857D] hover:text-violet-600 transition-colors"
                    title="Change Nickname"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              
              <p className="text-xs text-[#8A857D] dark:text-[#8D8881]">{currentUser.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{currentUser.plan} · Active</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/40 text-left text-xs text-violet-900 dark:text-violet-200 space-y-1">
              <div className="font-semibold text-violet-700 dark:text-violet-300">Your Nickname in Chat:</div>
              <p className="text-[#6E6D6A] dark:text-[#A09B93]">
                Chat messages will now proudly display <strong className="text-violet-600 dark:text-violet-400">"{currentUser.name}"</strong> instead of generic "You".
              </p>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* Login / Register Form */
          <div className="p-6 space-y-4">
            {/* Tab switch */}
            <div className="flex p-1 bg-[#F2EDE5] dark:bg-[#2A2824] rounded-xl">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  !isSignUp
                    ? 'bg-white dark:bg-[#383530] text-[#242424] dark:text-[#ECE8E1] shadow-xs'
                    : 'text-[#6E6D6A] dark:text-[#A09B93]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isSignUp
                    ? 'bg-white dark:bg-[#383530] text-[#242424] dark:text-[#ECE8E1] shadow-xs'
                    : 'text-[#6E6D6A] dark:text-[#A09B93]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Quick Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-xl border border-[#E4DDD2] dark:border-[#3E3B35] bg-white dark:bg-[#252320] hover:bg-[#FAF8F5] dark:hover:bg-[#2C2A26] text-xs font-semibold text-[#242424] dark:text-[#ECE8E1] flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#E8E2D9] dark:border-[#383530] w-full" />
              <span className="bg-white dark:bg-[#1E1D1A] px-3 text-[11px] text-[#8A857D] dark:text-[#8D8881] uppercase tracking-wider relative font-medium">
                or sign in with details
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Nickname / Display Name input */}
              <div>
                <label className="block text-xs font-semibold text-[#55524E] dark:text-[#A8A39C] mb-1">
                  Your Nickname / Display Name (shows in chat)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8A857D] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="e.g. Alex, Blueprint, Shadow, etc."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E4DDD2] dark:border-[#3E3B35] bg-[#FAF8F5] dark:bg-[#1A1917] text-[#242424] dark:text-[#ECE8E1] focus:outline-none focus:ring-2 focus:ring-violet-500/40 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#55524E] dark:text-[#A8A39C] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A857D] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E4DDD2] dark:border-[#3E3B35] bg-[#FAF8F5] dark:bg-[#1A1917] text-[#242424] dark:text-[#ECE8E1] focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#55524E] dark:text-[#A8A39C] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A857D] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E4DDD2] dark:border-[#3E3B35] bg-[#FAF8F5] dark:bg-[#1A1917] text-[#242424] dark:text-[#ECE8E1] focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-amber-600 hover:opacity-95 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 mt-1"
              >
                <span>{loading ? 'Logging in...' : isSignUp ? 'Create Mokola Account' : `Continue as ${nickname || 'User'}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
