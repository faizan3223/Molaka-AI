import React, { useState } from 'react';
import { AIModel, AppMode } from '../types';
import { MokolaLogo } from './MokolaLogo';
import { UserProfile } from './AuthModal';
import {
  Sparkles,
  Brain,
  Sliders,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  ImageIcon,
  Video,
  MessageSquare,
  Code2,
  User,
  Zap,
} from 'lucide-react';

interface HeaderProps {
  currentModel: AIModel;
  onSelectModel: (model: AIModel) => void;
  thinkingEnabled: boolean;
  onToggleThinking: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

const MODEL_OPTIONS: { id: AIModel; name: string; tag: string; description: string }[] = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Mokola Prime (Hybrid Thinking)',
    tag: 'Advanced Reasoning',
    description: 'Premier intelligence with deep chain-of-thought and architectural reasoning.',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Mokola Code Genius',
    tag: 'Elite Coding',
    description: 'Instant fullstack code synthesis, algorithmic mastery, and live artifacts.',
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Mokola Turbo Speed',
    tag: 'Ultra-Low Latency',
    description: 'Lightning-fast instantaneous conversation and quick utility execution.',
  },
  {
    id: 'gemini-3-8-flash',
    name: 'Gemini 3.8 Flash Engine',
    tag: 'Turbo High Speed',
    description: 'Massive context window with Google real-time search grounding.',
  },
];

export function Header({
  currentModel,
  onSelectModel,
  thinkingEnabled,
  onToggleThinking,
  isDark,
  onToggleTheme,
  onOpenSettings,
  onToggleSidebar,
  currentMode,
  onSelectMode,
  currentUser,
  onOpenAuth,
}: HeaderProps) {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const activeModelMeta = MODEL_OPTIONS.find((m) => m.id === currentModel) || MODEL_OPTIONS[0];

  return (
    <header className="h-14 border-b border-[#E8E2D9] dark:border-[#33302B] bg-[#FAF8F5]/90 dark:bg-[#1C1B19]/90 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left: Hamburger + Logo + Model Switcher */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-1.5 text-[#6E6D6A] dark:text-[#A09B93] hover:text-[#242424] dark:hover:text-[#ECE8E1] hover:bg-[#F0ECE5] dark:hover:bg-[#282623] rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectMode('chat')}>
          <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#262421] flex items-center justify-center border border-[#E4DDD2] dark:border-[#3E3B35] shadow-xs">
            <MokolaLogo size={22} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif-claude text-xl font-bold tracking-tight text-[#1E1E1E] dark:text-[#F3EFEA] leading-tight">
              Mokola AI
            </span>
          </div>
        </div>

        {/* Model Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#242424] dark:text-[#ECE8E1] bg-[#F2EDE5] dark:bg-[#282622] hover:bg-[#EAE4DC] dark:hover:bg-[#322F2A] rounded-lg transition-colors border border-[#E3DCD1] dark:border-[#3D3A34]"
          >
            <span className="truncate max-w-[130px] sm:max-w-none">{activeModelMeta.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6E6D6A] dark:text-[#A09B93] shrink-0" />
          </button>

          {/* Dropdown Menu */}
          {modelDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setModelDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-84 p-1.5 bg-[#FFFFFF] dark:bg-[#22201D] border border-[#E8E2D9] dark:border-[#3B3833] rounded-xl shadow-2xl z-40">
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A857D] dark:text-[#8D8881]">
                  Mokola Neural Engines
                </div>
                {MODEL_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onSelectModel(opt.id);
                      setModelDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex flex-col gap-0.5 ${
                      currentModel === opt.id
                        ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300'
                        : 'hover:bg-[#F8F5F0] dark:hover:bg-[#2A2824] text-[#242424] dark:text-[#ECE8E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                      <span>{opt.name}</span>
                      <span className="text-[10px] font-semibold opacity-80">{opt.tag}</span>
                    </div>
                    <p className="text-[11px] text-[#6E6D6A] dark:text-[#A09B93] line-clamp-1">
                      {opt.description}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Middle: Feature Switcher Tabs (Chat, Coding, Image, Video) */}
      <div className="hidden lg:flex items-center gap-1 p-1 bg-[#F0ECE5] dark:bg-[#24221F] rounded-lg border border-[#E4DDD2] dark:border-[#35332E]">
        <button
          onClick={() => onSelectMode('chat')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
            currentMode === 'chat' || currentMode === 'code-artifacts'
              ? 'bg-[#FFFFFF] dark:bg-[#2E2C28] text-violet-700 dark:text-violet-400 font-semibold shadow-xs'
              : 'text-[#6E6D6A] dark:text-[#A09B93] hover:text-[#242424] dark:hover:text-[#ECE8E1]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat & Artifacts</span>
        </button>

        <button
          onClick={() => onSelectMode('coding-studio')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
            currentMode === 'coding-studio'
              ? 'bg-[#FFFFFF] dark:bg-[#2E2C28] text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
              : 'text-[#6E6D6A] dark:text-[#A09B93] hover:text-[#242424] dark:hover:text-[#ECE8E1]'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code Studio</span>
        </button>

        <button
          onClick={() => onSelectMode('image-studio')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
            currentMode === 'image-studio'
              ? 'bg-[#FFFFFF] dark:bg-[#2E2C28] text-purple-600 dark:text-purple-400 font-semibold shadow-xs'
              : 'text-[#6E6D6A] dark:text-[#A09B93] hover:text-[#242424] dark:hover:text-[#ECE8E1]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Image Studio</span>
        </button>

        <button
          onClick={() => onSelectMode('video-studio')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
            currentMode === 'video-studio'
              ? 'bg-[#FFFFFF] dark:bg-[#2E2C28] text-amber-600 dark:text-amber-400 font-semibold shadow-xs'
              : 'text-[#6E6D6A] dark:text-[#A09B93] hover:text-[#242424] dark:hover:text-[#ECE8E1]'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Video Studio</span>
        </button>
      </div>

      {/* Right: Thinking Toggle + Login / Profile + Theme + Settings */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Extended Thinking Button */}
        <button
          onClick={onToggleThinking}
          title={thinkingEnabled ? 'Extended Thinking enabled' : 'Extended Thinking disabled'}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
            thinkingEnabled
              ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-900/40 text-violet-700 dark:text-violet-300'
              : 'bg-[#F2EDE5] dark:bg-[#282622] border-[#E3DCD1] dark:border-[#3D3A34] text-[#6E6D6A] dark:text-[#A09B93] hover:text-[#242424] dark:hover:text-[#ECE8E1]'
          }`}
        >
          <Brain className={`w-3.5 h-3.5 ${thinkingEnabled ? 'animate-pulse text-violet-600' : ''}`} />
          <span className="hidden sm:inline">Thinking</span>
          <span className={`w-1.5 h-1.5 rounded-full ${thinkingEnabled ? 'bg-violet-600' : 'bg-gray-400'}`} />
        </button>

        {/* User Login / Profile Button */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-amber-600 text-white hover:opacity-90 transition-all shadow-xs"
        >
          <User className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {currentUser?.isLoggedIn ? currentUser.name.split(' ')[0] : 'Sign In'}
          </span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="p-1.5 text-[#6E6D6A] dark:text-[#A09B93] hover:text-[#242424] dark:hover:text-[#ECE8E1] hover:bg-[#F0ECE5] dark:hover:bg-[#282623] rounded-lg transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="p-1.5 text-[#6E6D6A] dark:text-[#A09B93] hover:text-[#242424] dark:hover:text-[#ECE8E1] hover:bg-[#F0ECE5] dark:hover:bg-[#282623] rounded-lg transition-colors"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
