import { create } from 'zustand';

interface AvatarState {
  avatarModel: string | null;
  isTraining: boolean;
  error: string | null;
  setAvatarModel: (model: string) => void;
  startTraining: () => void;
  finishTraining: (error?: string) => void;
}

export const useAvatarStore = create<AvatarState>((set) => ({
  avatarModel: null,
  isTraining: false,
  error: null,
  
  setAvatarModel: (model) => set({ avatarModel: model }),
  
  startTraining: () => set({ 
    isTraining: true, 
    error: null 
  }),
  
  finishTraining: (error) => set({ 
    isTraining: false,
    error: error || null,
  }),
}));
