import React, { useState, useEffect, useRef } from 'react';
import {
  ChatMessage as ChatMessageType,
  Conversation,
  Artifact,
  AIModel,
  AppMode,
} from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ArtifactPanel } from './components/ArtifactPanel';
import { CodeStudio } from './components/CodeStudio';
import { ImageStudio } from './components/ImageStudio';
import { VideoStudio } from './components/VideoStudio';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal, UserProfile } from './components/AuthModal';
import { MokolaLogo } from './components/MokolaLogo';
import { extractArtifacts } from './utils/artifactExtractor';
import {
  ArrowUp,
  Brain,
  Globe,
  Square,
  Sparkles,
  Gamepad2,
  LineChart,
  Atom,
  Palette,
  Code2,
  Zap,
} from 'lucide-react';

const STORAGE_KEY_CHATS = 'mokola_ai_conversations_v1';
const STORAGE_KEY_THEME = 'mokola_ai_theme';
const STORAGE_KEY_USER = 'mokola_ai_user';

const INITIAL_SUGGESTIONS = [
  {
    icon: Gamepad2,
    title: 'Interactive 2D Cyber Arcade Game',
    desc: 'Build a playable Space Runner in self-contained React with scores & particles',
    prompt:
      'Build a complete, fully playable Retro Arcade 2D Space Shooter game in React. Include player spaceship, keyboard arrow controls, firing lasers, animated alien enemies, particle explosion effects, score counter, lives, and high-score saving. Make the visuals sleek and modern.',
  },
  {
    icon: LineChart,
    title: 'Live Financial Analytics Dashboard',
    desc: 'Interactive investment portfolio dashboard with charts and filters',
    prompt:
      'Create a complete, stunning interactive Financial Portfolio & Market Dashboard in HTML/Tailwind/JS. Include real-time simulation tickers, interactive line charts for asset growth, asset allocation breakdown, transaction history, and dark mode support.',
  },
  {
    icon: Code2,
    title: 'Fullstack Modern API & State Machine',
    desc: 'TypeScript data pipeline with reactive state store & live preview',
    prompt:
      'Write a complete interactive TypeScript & HTML state-machine application that simulates an asynchronous distributed task queue with real-time throughput metrics, visual progress bars, and execution logs.',
  },
  {
    icon: Atom,
    title: 'Interactive 3D Quantum Galaxy',
    desc: 'HTML5 Canvas celestial physics with gravity & particle vortices',
    prompt:
      'Write a self-contained interactive 3D Celestial Particle Galaxy simulation in HTML5 Canvas and JavaScript. Include 1,500 glowing stars, gravitational attraction toward the mouse pointer, orbital rotation speed controls, and a cosmic color palette picker.',
  },
];

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // User Auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'Mokola Explorer',
      email: 'user@mokola.ai',
      plan: 'Mokola Pro',
      isLoggedIn: true,
    };
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHATS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
    const defaultConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return [defaultConv];
  });

  const [activeConversationId, setActiveConversationId] = useState<string>(() => {
    return conversations[0]?.id || `conv-${Date.now()}`;
  });

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<AIModel>('claude-3-7-sonnet');
  const [thinkingEnabled, setThinkingEnabled] = useState(true);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [currentMode, setCurrentMode] = useState<AppMode>('chat');
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync theme with DOM
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [isDark]);

  // Persist conversations
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(conversations));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [conversations]);

  // Persist user profile
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  };

  const handleLogout = () => {
    const guest: UserProfile = {
      name: 'Guest User',
      email: '',
      plan: 'Mokola Pro',
      isLoggedIn: false,
    };
    setCurrentUser(guest);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(guest));
  };

  // Active conversation helper
  const activeConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  // Keyboard shortcut Cmd+K for new chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleNewChat();
      }
      if (e.key === 'Escape') {
        if (activeArtifact) setActiveArtifact(null);
        if (settingsOpen) setSettingsOpen(false);
        if (authModalOpen) setAuthModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeArtifact, settingsOpen, authModalOpen]);

  // Create new chat
  const handleNewChat = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setActiveArtifact(null);
    setInputText('');
    if (textareaRef.current) textareaRef.current.focus();
  };

  // Delete chat
  const handleDeleteConversation = (id: string) => {
    const remaining = conversations.filter((c) => c.id !== id);
    if (remaining.length === 0) {
      const fresh: Conversation = {
        id: `conv-${Date.now()}`,
        title: 'New Conversation',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setConversations([fresh]);
      setActiveConversationId(fresh.id);
    } else {
      setConversations(remaining);
      if (activeConversationId === id) {
        setActiveConversationId(remaining[0].id);
      }
    }
  };

  // Clear all chats
  const handleClearAllChats = () => {
    const fresh: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations([fresh]);
    setActiveConversationId(fresh.id);
    setActiveArtifact(null);
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  // Stop response generation
  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  // Send message with animated streaming
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt || isStreaming) return;

    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    };

    const assistantMsgId = `asst-${Date.now() + 1}`;
    const assistantPlaceholder: ChatMessageType = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now() + 1,
      modelUsed: 'Mokola Prime Reasoning',
      isStreaming: true,
      artifacts: [],
    };

    const updatedMessages = [...activeConversation.messages, userMessage, assistantPlaceholder];
    const newTitle =
      activeConversation.messages.length === 0
        ? prompt.slice(0, 32) + (prompt.length > 32 ? '...' : '')
        : activeConversation.title;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              title: newTitle,
              messages: updatedMessages,
              updatedAt: Date.now(),
            }
          : c
      )
    );

    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    try {
      const payloadMessages = [...activeConversation.messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          model: currentModel,
          thinking: thinkingEnabled,
          webSearch: webSearchEnabled,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      if (!res.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            try {
              const data = JSON.parse(jsonStr);
              if (data.text) {
                accumulatedText += data.text;

                const foundArtifacts = extractArtifacts(accumulatedText);

                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === activeConversationId
                      ? {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === assistantMsgId
                              ? {
                                  ...m,
                                  content: accumulatedText,
                                  artifacts: foundArtifacts,
                                }
                              : m
                          ),
                        }
                      : c
                  )
                );

                if (foundArtifacts.length > 0 && !activeArtifact) {
                  setActiveArtifact(foundArtifacts[foundArtifacts.length - 1]);
                }
              }
            } catch (err) {
              console.error('SSE parse error:', err);
            }
          }
        }
      }

      const finalArtifacts = extractArtifacts(accumulatedText);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        content: accumulatedText,
                        isStreaming: false,
                        artifacts: finalArtifacts,
                      }
                    : m
                ),
              }
            : c
        )
      );

      if (finalArtifacts.length > 0) {
        setActiveArtifact(finalArtifacts[finalArtifacts.length - 1]);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Stream stopped by user');
      } else {
        console.error('Streaming error:', err);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content:
                            m.content ||
                            'Mokola AI experienced a brief network variance. Please click retry.',
                          isStreaming: false,
                        }
                      : m
                  ),
                }
              : c
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleRegenerate = () => {
    if (isStreaming) return;
    const msgs = activeConversation.messages;
    if (msgs.length < 2) return;
    const lastUserMsg = [...msgs].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex h-screen w-full bg-[#FAF8F5] dark:bg-[#181715] text-[#242424] dark:text-[#ECE8E1] overflow-hidden select-text">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Header */}
        <Header
          currentModel={currentModel}
          onSelectModel={setCurrentModel}
          thinkingEnabled={thinkingEnabled}
          onToggleThinking={() => setThinkingEnabled(!thinkingEnabled)}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          onOpenSettings={() => setSettingsOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          currentMode={currentMode}
          onSelectMode={setCurrentMode}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
        />

        {/* Specialized Views */}
        {currentMode === 'coding-studio' ? (
          <CodeStudio />
        ) : currentMode === 'image-studio' ? (
          <ImageStudio />
        ) : currentMode === 'video-studio' ? (
          <VideoStudio />
        ) : (
          /* Chat & Artifacts Split View Area */
          <div className="flex-1 flex min-h-0 overflow-hidden relative">
            {/* Left: Chat Feed */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
              {/* Messages Scroll Area */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col"
              >
                {activeConversation.messages.length === 0 ? (
                  /* Mokola AI Welcome Screen */
                  <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-2xl mx-auto my-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="relative group">
                      <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-violet-600 via-amber-400 to-pink-500 opacity-70 blur-md group-hover:opacity-100 transition duration-500 animate-pulse" />
                      <div className="relative w-18 h-18 rounded-2xl bg-white dark:bg-[#23211E] border border-[#E8E2D9] dark:border-[#383530] flex items-center justify-center shadow-xl">
                        <MokolaLogo size={42} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h1 className="font-serif-claude text-3xl sm:text-4xl text-[#1E1E1E] dark:text-[#F3EFEA] font-bold">
                        {getGreeting()}, Mokola AI
                      </h1>
                      <p className="text-xs sm:text-sm text-[#6E6D6A] dark:text-[#A09B93] max-w-md mx-auto leading-relaxed">
                        The world-class AI system with real-time streaming, answer synthesis animations, full Code Studio, live interactive Artifacts, and media synthesis.
                      </p>
                    </div>

                    {/* Starter Inspiration Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left pt-2">
                      {INITIAL_SUGGESTIONS.map((sug, i) => {
                        const Icon = sug.icon;
                        return (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(sug.prompt)}
                            className="p-3.5 rounded-xl border border-[#E8E2D9] dark:border-[#383530] bg-[#FFFFFF] dark:bg-[#22201D] hover:border-violet-500 dark:hover:border-violet-400 transition-all flex flex-col gap-1 group shadow-2xs hover:shadow-xs"
                          >
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#242424] dark:text-[#ECE8E1] group-hover:text-violet-600 dark:group-hover:text-violet-400">
                              <Icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                              <span>{sug.title}</span>
                            </div>
                            <p className="text-[11px] text-[#6E6D6A] dark:text-[#A09B93] line-clamp-2">
                              {sug.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Active Message History */
                  <div className="divide-y divide-[#F0ECE5] dark:divide-[#282622]">
                    {activeConversation.messages.map((msg) => (
                      <ChatMessage
                        key={msg.id}
                        message={msg}
                        userName={currentUser?.name}
                        onOpenArtifact={(artifact) => setActiveArtifact(artifact)}
                        onRegenerate={msg.role === 'assistant' ? handleRegenerate : undefined}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Mokola Bottom Input Bar */}
              <div className="p-3 sm:p-5 shrink-0 bg-[#FAF8F5]/80 dark:bg-[#181715]/80 backdrop-blur-xs border-t border-[#E8E2D9] dark:border-[#33302B]">
                <div className="max-w-3xl mx-auto">
                  <div className="relative rounded-2xl bg-white dark:bg-[#23211E] border border-[#E4DDD2] dark:border-[#3A3731] shadow-md focus-within:border-violet-500 dark:focus-within:border-violet-400 transition-all p-2.5 sm:p-3 flex flex-col gap-2">
                    {/* Textarea */}
                    <textarea
                      ref={textareaRef}
                      value={inputText}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Message Mokola AI or ask to write code, design an app, or analyze data..."
                      rows={1}
                      className="w-full bg-transparent text-xs sm:text-sm text-[#242424] dark:text-[#ECE8E1] placeholder:text-[#9A958E] focus:outline-none resize-none max-h-48 px-1"
                    />

                    {/* Bottom toolbar inside input box */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#F2ECE3] dark:border-[#2C2A26]">
                      {/* Left toggles */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                          className={`flex items-center gap-1 px-2 py-1 text-[11px] rounded-lg transition-colors ${
                            webSearchEnabled
                              ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-semibold'
                              : 'text-[#8A857D] hover:text-[#242424] dark:hover:text-[#ECE8E1]'
                          }`}
                          title="Search Grounding"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Search</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setThinkingEnabled(!thinkingEnabled)}
                          className={`flex items-center gap-1 px-2 py-1 text-[11px] rounded-lg transition-colors ${
                            thinkingEnabled
                              ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-semibold'
                              : 'text-[#8A857D] hover:text-[#242424] dark:hover:text-[#ECE8E1]'
                          }`}
                          title="Mokola Quantum Thinking"
                        >
                          <Brain className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Thinking: {thinkingEnabled ? 'On' : 'Off'}</span>
                        </button>
                      </div>

                      {/* Right: Send or Stop button */}
                      <div className="flex items-center gap-1.5">
                        {isStreaming ? (
                          <button
                            type="button"
                            onClick={handleStopStreaming}
                            className="p-2 rounded-xl bg-[#242424] dark:bg-[#ECE8E1] text-white dark:text-[#181715] hover:opacity-85 transition-opacity"
                            title="Stop generating"
                          >
                            <Square className="w-4 h-4 fill-current" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSendMessage()}
                            disabled={!inputText.trim()}
                            className="p-2 rounded-xl bg-gradient-to-r from-violet-600 to-amber-600 hover:opacity-90 text-white disabled:opacity-40 transition-all shadow-xs"
                            title="Send prompt"
                          >
                            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8A857D] dark:text-[#8D8881] px-2 pt-1.5">
                    <span>Mokola AI delivers world-class answers. Verify critical computation.</span>
                    <span className="hidden sm:inline">Shift + Enter for new line</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Artifact Live Split Panel */}
            {activeArtifact && (
              <ArtifactPanel
                artifact={activeArtifact}
                onClose={() => setActiveArtifact(null)}
              />
            )}
          </div>
        )}
      </div>

      {/* Auth Modal for Login / Sign In */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        systemPrompt={systemPrompt}
        onUpdateSystemPrompt={setSystemPrompt}
        temperature={temperature}
        onUpdateTemperature={setTemperature}
        onClearAllChats={handleClearAllChats}
      />
    </div>
  );
}
