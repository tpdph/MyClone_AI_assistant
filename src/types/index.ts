export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface KnowledgeItem {
  id: string;
  type: 'pdf' | 'video' | 'text' | 'url';
  title: string;
  content: string;
  timestamp: Date;
}

export interface VoiceConfig {
  language: string;
  speed: number;
  pitch: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  task: 'text-generation' | 'conversational';
  loading: boolean;
}

export interface AIState {
  selectedModel: ModelConfig | null;
  isProcessing: boolean;
  error: string | null;
}