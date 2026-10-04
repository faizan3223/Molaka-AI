export type AIModel = 
  | 'claude-3-7-sonnet'
  | 'claude-3-5-sonnet'
  | 'claude-3-5-haiku'
  | 'claude-3-opus'
  | 'gemini-3-8-flash';

export interface Artifact {
  id: string;
  title: string;
  type: 'html' | 'react' | 'svg' | 'javascript' | 'python' | 'markdown' | 'css' | 'json' | 'generic';
  language: string;
  code: string;
  version: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  artifacts?: Artifact[];
  timestamp: number;
  modelUsed?: string;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  activeArtifact?: Artifact | null;
}

export type AppMode = 'chat' | 'code-artifacts' | 'coding-studio' | 'image-studio' | 'video-studio';
