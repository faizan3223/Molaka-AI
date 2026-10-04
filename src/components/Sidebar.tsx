import React from 'react';
import { Conversation, AppMode } from '../types';
import { MokolaLogo } from './MokolaLogo';
import { UserProfile } from './AuthModal';
import {
  Plus,
  MessageSquare,
  Code2,
  ImageIcon,
  Video,
  Trash2,
  X,
  Sparkles,
  User,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  currentMode,
  onSelectMode,
  currentUser,
  onOpenAuth,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 w-68 sm:w-72 bg-[#F7F4EE] dark:bg-[#181715] border-r border-[#E8E2D9] dark:border-[#33302B] flex flex-col z-40 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & New Chat button */}
        <div className="p-3.5 border-b border-[#E8E2D9] dark:border-[#33302B] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#252320] flex items-center justify-center border border-[#E0D9CE] dark:border-[#3D3A34] shadow-xs">
                <MokolaLogo size={20} />
              </div>
              <span className="font-serif-claude text-xl font-bold text-[#1E1E1E] dark:text-[#F3EFEA]">
                Mokola AI
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-[#6E6D6A] dark:text-[#A09B93] hover:text-[#242424] dark:hover:text-[#ECE8E1] rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-violet-50 to-amber-50 dark:from-violet-950/30 dark:to-amber-950/30 border border-violet-200 dark:border-violet-800/40 text-violet-700 dark:text-violet-300 font-medium text-sm hover:opacity-90 transition-all shadow-xs group"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>Start new chat</span>
            </span>
            <span className="text-[10px] text-violet-600/70 dark:text-violet-400/70 px-1.5 py-0.5 rounded bg-white/60 dark:bg-black/20">
              ⌘K
            </span>
          </button>
        </div>

        {/* Studio Modes Navigation */}
        <div className="px-3 pt-3 pb-2 border-b border-[#E8E2D9] dark:border-[#33302B] flex flex-col gap-0.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8A857D] dark:text-[#8D8881] px-2 py-1">
            Mokola Workspaces
          </div>
          <button
            onClick={() => {
              onSelectMode('chat');
              if (window.innerWidth < 1024) onClose();
            }}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentMode === 'chat'
                ? 'bg-[#EAE4DC] dark:bg-[#282622] text-[#242424] dark:text-[#ECE8E1]'
                : 'text-[#6E6D6A] dark:text-[#A09B93] hover:bg-[#F0EAE1] dark:hover:bg-[#22201D] hover:text-[#242424] dark:hover:text-[#ECE8E1]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>Chat & Artifacts</span>
          </button>

          <button
            onClick={() => {
              onSelectMode('coding-studio');
              if (window.innerWidth < 1024) onClose();
            }}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentMode === 'coding-studio'
                ? 'bg-[#EAE4DC] dark:bg-[#282622] text-[#242424] dark:text-[#ECE8E1]'
                : 'text-[#6E6D6A] dark:text-[#A09B93] hover:bg-[#F0EAE1] dark:hover:bg-[#22201D] hover:text-[#242424] dark:hover:text-[#ECE8E1]'
            }`}
          >
            <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Coding Playground</span>
          </button>

          <button
            onClick={() => {
              onSelectMode('image-studio');
              if (window.innerWidth < 1024) onClose();
            }}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentMode === 'image-studio'
                ? 'bg-[#EAE4DC] dark:bg-[#282622] text-[#242424] dark:text-[#ECE8E1]'
                : 'text-[#6E6D6A] dark:text-[#A09B93] hover:bg-[#F0EAE1] dark:hover:bg-[#22201D] hover:text-[#242424] dark:hover:text-[#ECE8E1]'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Image Studio</span>
          </button>

          <button
            onClick={() => {
              onSelectMode('video-studio');
              if (window.innerWidth < 1024) onClose();
            }}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentMode === 'video-studio'
                ? 'bg-[#EAE4DC] dark:bg-[#282622] text-[#242424] dark:text-[#ECE8E1]'
                : 'text-[#6E6D6A] dark:text-[#A09B93] hover:bg-[#F0EAE1] dark:hover:bg-[#22201D] hover:text-[#242424] dark:hover:text-[#ECE8E1]'
            }`}
          >
            <Video className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Video & Motion</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8A857D] dark:text-[#8D8881] px-2.5 py-1">
            Recents
          </div>

          {conversations.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-[#8A857D] dark:text-[#8D8881]">
              No conversations yet. Ask Mokola AI anything!
            </div>
          ) : (
            <div className="flex flex-col gap-1 mt-1">
              {conversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#EAE4DC] dark:bg-[#2A2824] text-[#242424] dark:text-[#ECE8E1] font-medium'
                        : 'text-[#6E6D6A] dark:text-[#A09B93] hover:bg-[#F0EAE1] dark:hover:bg-[#22201D] hover:text-[#242424] dark:hover:text-[#ECE8E1]'
                    }`}
                    onClick={() => {
                      onSelectConversation(conv.id);
                      if (currentMode !== 'chat') onSelectMode('chat');
                      if (window.innerWidth < 1024) onClose();
                    }}
                  >
                    <span className="truncate pr-4 flex-1">{conv.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#8A857D] hover:text-red-500 rounded transition-opacity"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom User Profile & Mokola Pro Status */}
        <div
          onClick={onOpenAuth}
          className="p-3 border-t border-[#E8E2D9] dark:border-[#33302B] bg-[#F2EDE5]/60 dark:bg-[#1A1917]/60 hover:bg-[#EBE5DB] dark:hover:bg-[#22201D] cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {currentUser?.isLoggedIn ? currentUser.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#242424] dark:text-[#ECE8E1] truncate">
                  {currentUser?.isLoggedIn ? currentUser.name : 'Sign In / Account'}
                </span>
                <span className="text-[10px] text-[#8A857D] dark:text-[#8D8881]">
                  {currentUser?.isLoggedIn ? currentUser.plan : 'Click to Login'}
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Pro
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
