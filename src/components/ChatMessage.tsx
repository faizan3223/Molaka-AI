import React, { useState } from 'react';
import { ChatMessage as ChatMessageType, Artifact } from '../types';
import { MokolaLogo } from './MokolaLogo';
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Code,
  FileCode,
  Layers,
  ChevronDown,
  ChevronRight,
  Brain,
  Play,
  Terminal,
  HelpCircle,
  MessageCircleQuestion,
  User,
} from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  onOpenArtifact: (artifact: Artifact) => void;
  onRegenerate?: () => void;
  userName?: string;
}

export function ChatMessage({ message, onOpenArtifact, onRegenerate, userName }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [thinkingExpanded, setThinkingExpanded] = useState(false);

  const isUser = message.role === 'user';
  const displayName = isUser ? (userName?.trim() || 'You') : 'Mokola AI';
  const userInitial = isUser ? (userName?.trim() ? userName.trim().charAt(0).toUpperCase() : 'U') : 'M';

  // Handle Copy text
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle TTS Speech
  const handleToggleSpeech = async () => {
    if (speaking && audioElement) {
      audioElement.pause();
      setSpeaking(false);
      return;
    }

    try {
      setSpeaking(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message.content, voice: 'Kore' }),
      });
      const data = await res.json();
      if (data.audio) {
        const audio = new Audio(data.audio);
        setAudioElement(audio);
        audio.play();
        audio.onended = () => setSpeaking(false);
        audio.onerror = () => setSpeaking(false);
      } else {
        setSpeaking(false);
      }
    } catch (err) {
      console.error('Speech error:', err);
      setSpeaking(false);
    }
  };

  // Parse thinking tags if returned inside text
  let displayContent = message.content;
  let inlineThinking = message.thinking || '';

  const thinkingMatch = displayContent.match(/<thinking>([\s\S]*?)<\/thinking>/i);
  if (thinkingMatch) {
    inlineThinking = thinkingMatch[1].trim();
    displayContent = displayContent.replace(/<thinking>[\s\S]*?<\/thinking>/i, '').trim();
  }

  return (
    <div
      className={`w-full py-5 px-3 sm:px-6 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
        isUser
          ? 'bg-transparent'
          : 'bg-[#FAF8F5]/80 dark:bg-[#1E1D1A]/60 border-y border-[#F0EAE1]/80 dark:border-[#282622]'
      }`}
    >
      <div className="max-w-3xl mx-auto flex gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5 relative">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 via-purple-600 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-violet-500/20">
              {userInitial}
            </div>
          ) : (
            <div className="relative">
              {message.isStreaming && (
                <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-500 via-amber-400 to-pink-500 opacity-75 blur-xs animate-pulse" />
              )}
              <div className="relative w-8 h-8 rounded-xl bg-white dark:bg-[#2A2420] border border-[#E8E2D9] dark:border-[#463830] flex items-center justify-center shadow-xs">
                <MokolaLogo size={20} animated={message.isStreaming} />
              </div>
            </div>
          )}
        </div>

        {/* Message Body */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* Header Info: User Question Banner vs AI Answer Banner */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-[#242424] dark:text-[#ECE8E1]">
                {displayName}
              </span>

              {/* Distinct Badge for User Question */}
              {isUser ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/40">
                  <MessageCircleQuestion className="w-3 h-3" />
                  <span>Your Question</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                  <Sparkles className="w-3 h-3" />
                  <span>{message.modelUsed || 'Mokola AI Response'}</span>
                </span>
              )}
            </div>

            {/* Answer animation soundwave/pulse indicator */}
            {!isUser && message.isStreaming && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/40 text-violet-600 dark:text-violet-400 text-[10px] font-semibold animate-pulse">
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-violet-600 dark:bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s] h-full" />
                  <span className="w-0.5 bg-violet-600 dark:bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s] h-2/3" />
                  <span className="w-0.5 bg-violet-600 dark:bg-violet-400 rounded-full animate-bounce [animation-delay:0s] h-full" />
                  <span className="w-0.5 bg-violet-600 dark:bg-violet-400 rounded-full animate-bounce [animation-delay:-0.2s] h-1/2" />
                </div>
                <span>Synthesizing...</span>
              </div>
            )}
          </div>

          {/* Thinking process accordion */}
          {inlineThinking && !isUser && (
            <div className="mb-2 rounded-xl border border-[#E8E2D9] dark:border-[#383530] bg-[#F5F2EB]/50 dark:bg-[#24221E]/60 overflow-hidden">
              <button
                onClick={() => setThinkingExpanded(!thinkingExpanded)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-[#6E6D6A] dark:text-[#A09B93] hover:text-[#242424] dark:hover:text-[#ECE8E1] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Brain className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  <span>Mokola Reasoning Chain (Thinking)</span>
                </span>
                {thinkingExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
              {thinkingExpanded && (
                <div className="px-3.5 pb-3 text-xs text-[#55524E] dark:text-[#A8A39C] leading-relaxed border-t border-[#E8E2D9] dark:border-[#33302B] pt-2 whitespace-pre-wrap font-mono-claude">
                  {inlineThinking}
                </div>
              )}
            </div>
          )}

          {/* User Question Card Styling vs AI Answer Styling */}
          {isUser ? (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-violet-50/70 via-purple-50/40 to-transparent dark:from-violet-950/20 dark:via-purple-950/10 dark:to-transparent border-l-3 border-violet-500 border border-violet-200/50 dark:border-violet-800/30 text-xs sm:text-sm font-medium text-[#1E1E1E] dark:text-[#F3EFEA] leading-relaxed">
              {displayContent}
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none text-[#242424] dark:text-[#ECE8E1] leading-relaxed break-words text-xs sm:text-sm">
              <RenderFormattedContent
                content={displayContent}
                artifacts={message.artifacts || []}
                onOpenArtifact={onOpenArtifact}
              />
            </div>
          )}

          {/* Artifact Highlights Card (if artifacts are attached) */}
          {message.artifacts && message.artifacts.length > 0 && !isUser && (
            <div className="mt-3 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-300">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8A857D] dark:text-[#8D8881]">
                Generated Artifacts ({message.artifacts.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {message.artifacts.map((artifact) => (
                  <div
                    key={artifact.id}
                    onClick={() => onOpenArtifact(artifact)}
                    className="p-3.5 rounded-xl border border-[#E8E2D9] dark:border-[#383530] bg-[#FFFFFF] dark:bg-[#252320] hover:border-violet-500 dark:hover:border-violet-400 transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-50 to-amber-50 dark:from-violet-950/40 dark:to-amber-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 border border-violet-200 dark:border-violet-800/40">
                        {artifact.type === 'react' || artifact.type === 'html' ? (
                          <Layers className="w-4 h-4" />
                        ) : artifact.type === 'svg' ? (
                          <Sparkles className="w-4 h-4" />
                        ) : (
                          <FileCode className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-[#242424] dark:text-[#ECE8E1] truncate group-hover:text-violet-600 dark:group-hover:text-violet-400">
                          {artifact.title}
                        </div>
                        <div className="text-[11px] text-[#8A857D] dark:text-[#8D8881] capitalize">
                          {artifact.type} · Live Interactive Preview
                        </div>
                      </div>
                    </div>
                    <span className="p-1.5 rounded-lg bg-[#F5F2EB] dark:bg-[#302D29] text-[#6E6D6A] dark:text-[#A09B93] group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors shrink-0">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar for Assistant Messages */}
          {!isUser && !message.isStreaming && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 text-[#8A857D] dark:text-[#8D8881]">
              <button
                onClick={handleCopy}
                title="Copy response"
                className="p-1.5 hover:text-[#242424] dark:hover:text-[#ECE8E1] hover:bg-[#EAE4DC] dark:hover:bg-[#2C2A26] rounded-md transition-colors text-xs flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleToggleSpeech}
                title="Read aloud"
                className="p-1.5 hover:text-[#242424] dark:hover:text-[#ECE8E1] hover:bg-[#EAE4DC] dark:hover:bg-[#2C2A26] rounded-md transition-colors text-xs flex items-center gap-1"
              >
                {speaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
                    <span className="text-[11px] text-violet-600">Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Read</span>
                  </>
                )}
              </button>

              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  title="Retry response"
                  className="p-1.5 hover:text-[#242424] dark:hover:text-[#ECE8E1] hover:bg-[#EAE4DC] dark:hover:bg-[#2C2A26] rounded-md transition-colors text-xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Retry</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RenderFormattedContent({
  content,
  artifacts,
  onOpenArtifact,
}: {
  content: string;
  artifacts: Artifact[];
  onOpenArtifact: (artifact: Artifact) => void;
}) {
  const parts = content.split(/(```[a-zA-Z0-9_\-+]*\s*[\s\S]*?```)/g);

  return (
    <div className="space-y-3">
      {parts.map((part, idx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const match = part.match(/^```([a-zA-Z0-9_\-+]*)\s*([\s\S]*?)```$/);
          const lang = match ? match[1] : 'code';
          const code = match ? match[2].trim() : '';
          const matchedArtifact = artifacts.find((a) => a.code.trim() === code);

          return (
            <div
              key={idx}
              className="my-3 rounded-xl overflow-hidden border border-[#E0D9CE] dark:border-[#3A3731] bg-[#1E1E1E] text-slate-100 shadow-xs"
            >
              <div className="px-4 py-2 bg-[#2D2D2D] border-b border-[#3D3D3D] flex items-center justify-between text-xs text-slate-300">
                <span className="font-mono uppercase font-semibold text-[11px] text-amber-400">
                  {lang || 'code'}
                </span>
                <div className="flex items-center gap-2">
                  {matchedArtifact && (
                    <button
                      onClick={() => onOpenArtifact(matchedArtifact)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-violet-600 text-white hover:bg-violet-700 font-medium text-xs transition-colors shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Run Live Preview</span>
                    </button>
                  )}
                  <CopyCodeButton code={code} />
                </div>
              </div>
              <pre className="p-4 overflow-x-auto text-xs font-mono-claude leading-relaxed bg-[#191919]">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        return <FormattedProse key={idx} text={part} />;
      })}
    </div>
  );
}

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1 text-slate-400 hover:text-white rounded transition-colors flex items-center gap-1"
      title="Copy code"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

function FormattedProse({ text }: { text: string }) {
  if (!text.trim()) return null;

  const paragraphs = text.split('\n\n');

  return (
    <>
      {paragraphs.map((p, pIdx) => {
        if (p.trim().startsWith('- ') || p.trim().startsWith('* ')) {
          const items = p.split('\n').filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
          return (
            <ul key={pIdx} className="list-disc pl-5 my-2 space-y-1">
              {items.map((it, itIdx) => (
                <li key={itIdx}>
                  <InlineMarkdown text={it.replace(/^[-*]\s+/, '')} />
                </li>
              ))}
            </ul>
          );
        }

        if (/^\d+\.\s/.test(p.trim())) {
          const items = p.split('\n').filter((l) => /^\d+\.\s/.test(l.trim()));
          return (
            <ol key={pIdx} className="list-decimal pl-5 my-2 space-y-1">
              {items.map((it, itIdx) => (
                <li key={itIdx}>
                  <InlineMarkdown text={it.replace(/^\d+\.\s+/, '')} />
                </li>
              ))}
            </ol>
          );
        }

        if (p.startsWith('### ')) {
          return (
            <h3 key={pIdx} className="text-base font-bold mt-3 mb-1 text-[#1E1E1E] dark:text-[#F3EFEA]">
              <InlineMarkdown text={p.replace(/^###\s+/, '')} />
            </h3>
          );
        }

        if (p.startsWith('## ')) {
          return (
            <h2 key={pIdx} className="text-lg font-extrabold mt-4 mb-2 text-[#1E1E1E] dark:text-[#F3EFEA]">
              <InlineMarkdown text={p.replace(/^##\s+/, '')} />
            </h2>
          );
        }

        return (
          <p key={pIdx} className="my-1.5 leading-relaxed text-[#242424] dark:text-[#ECE8E1]">
            <InlineMarkdown text={p} />
          </p>
        );
      })}
    </>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return (
    <>
      {tokens.map((token, i) => {
        if (token.startsWith('`') && token.endsWith('`')) {
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 mx-0.5 rounded text-xs bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-mono-claude"
            >
              {token.slice(1, -1)}
            </code>
          );
        }
        if (token.startsWith('**') && token.endsWith('**')) {
          return (
            <strong key={i} className="font-bold text-[#111111] dark:text-[#FFFFFF]">
              {token.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{token}</span>;
      })}
    </>
  );
}
