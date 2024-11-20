import { create } from 'zustand';
import { Message, KnowledgeItem, VoiceConfig, ModelConfig, AIState } from '../types';
import { loadModel, generateText } from '../lib/api';

interface AppState {
  messages: Message[];
  knowledgeBase: KnowledgeItem[];
  voiceConfig: VoiceConfig;
  isListening: boolean;
  ai: AIState;
  addMessage: (message: Message) => void;
  addKnowledgeItem: (item: KnowledgeItem) => void;
  updateVoiceConfig: (config: Partial<VoiceConfig>) => void;
  setListening: (isListening: boolean) => void;
  selectModel: (model: ModelConfig) => Promise<void>;
  generateResponse: (prompt: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  messages: [],
  knowledgeBase: [],
  voiceConfig: {
    language: 'es-ES',
    speed: 1,
    pitch: 1,
  },
  isListening: false,
  ai: {
    selectedModel: null,
    isProcessing: false,
    error: null,
  },
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  addKnowledgeItem: (item) =>
    set((state) => ({ knowledgeBase: [...state.knowledgeBase, item] })),
  updateVoiceConfig: (config) =>
    set((state) => ({ voiceConfig: { ...state.voiceConfig, ...config } })),
  setListening: (isListening) => set({ isListening }),
  selectModel: async (model: ModelConfig) => {
    set((state) => ({
      ai: { ...state.ai, selectedModel: model, loading: true, error: null },
    }));

    try {
      await loadModel(model.id);
      set((state) => ({
        ai: { ...state.ai, loading: false },
      }));
    } catch (error) {
      set((state) => ({
        ai: {
          ...state.ai,
          loading: false,
          error: 'Error loading model: ' + (error as Error).message,
        },
      }));
    }
  },
  generateResponse: async (prompt: string) => {
    const state = get();
    if (!state.ai.selectedModel || state.ai.isProcessing) return;

    set((state) => ({
      ai: { ...state.ai, isProcessing: true, error: null },
    }));

    try {
      const response = await generateText(prompt);
      const message: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      get().addMessage(message);
    } catch (error) {
      set((state) => ({
        ai: {
          ...state.ai,
          error: 'Error generating response: ' + (error as Error).message,
        },
      }));
    } finally {
      set((state) => ({
        ai: { ...state.ai, isProcessing: false },
      }));
    }
  },
}));