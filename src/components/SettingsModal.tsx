import React from 'react';
import { X, Sliders, Brain, Sparkles, Shield, Trash2 } from 'lucide-react';
import { MokolaLogo } from './MokolaLogo';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemPrompt: string;
  onUpdateSystemPrompt: (prompt: string) => void;
  temperature: number;
  onUpdateTemperature: (temp: number) => void;
  onClearAllChats: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  systemPrompt,
  onUpdateSystemPrompt,
  temperature,
  onUpdateTemperature,
  onClearAllChats,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#201F1C] border border-[#E8E2D9] dark:border-[#383530] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E8E2D9] dark:border-[#33302B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MokolaLogo size={22} />
            <h3 className="font-serif-claude text-xl text-[#242424] dark:text-[#ECE8E1]">
              Mokola AI Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8A857D] hover:text-[#242424] dark:hover:text-[#ECE8E1] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs sm:text-sm">
          {/* Temperature */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-medium text-[#242424] dark:text-[#ECE8E1]">
              <span>Creativity & Temperature</span>
              <span className="font-mono text-xs text-violet-600 dark:text-violet-400 font-bold">{temperature.toFixed(2)}</span>
            </div>
            <p className="text-xs text-[#6E6D6A] dark:text-[#A09B93]">
              Lower values give focused, deterministic code. Higher values boost creative brainstorming.
            </p>
            <input
              type="range"
              min="0.1"
              max="1.2"
              step="0.05"
              value={temperature}
              onChange={(e) => onUpdateTemperature(parseFloat(e.target.value))}
              className="w-full accent-violet-600 cursor-pointer"
            />
          </div>

          {/* System Persona */}
          <div className="space-y-1.5">
            <label className="block font-medium text-[#242424] dark:text-[#ECE8E1]">
              Custom Mokola AI Persona Prompt
            </label>
            <textarea
              rows={3}
              value={systemPrompt}
              onChange={(e) => onUpdateSystemPrompt(e.target.value)}
              placeholder="Provide custom background instructions for Mokola AI..."
              className="w-full p-2.5 text-xs rounded-xl border border-[#E4DDD2] dark:border-[#3E3B35] bg-[#FAF8F5] dark:bg-[#1A1917] text-[#242424] dark:text-[#ECE8E1] focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Capabilities */}
          <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/40 text-xs text-violet-900 dark:text-violet-200 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-violet-700 dark:text-violet-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>World-Class Mokola Architecture</span>
            </div>
            <p>
              Includes real-time streaming with live answer synthesis animations, full Code Studio, interactive code Artifacts with live execution, image synthesis, and 60FPS motion canvas.
            </p>
          </div>

          {/* Data Cleanup */}
          <div className="pt-2 border-t border-[#E8E2D9] dark:border-[#33302B] flex items-center justify-between">
            <span className="text-xs text-[#6E6D6A] dark:text-[#A09B93]">Clear conversation history</span>
            <button
              onClick={() => {
                if (confirm('Clear all past chats?')) {
                  onClearAllChats();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E8E2D9] dark:border-[#33302B] bg-[#FAF8F5] dark:bg-[#1A1917] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
