import { create } from 'zustand';

export interface Insights {
  symptoms: string[];
  medications: string[];
  followUpDate: string;
  actionItems: string[];
  summary: string;
}

interface ConsultationState {
  transcript: string;
  interimTranscript: string;
  isRecording: boolean;
  insights: Insights | null;
  isAnalyzing: boolean;
  error: string | null;
  appendTranscript: (text: string) => void;
  setInterimTranscript: (text: string) => void;
  setIsRecording: (value: boolean) => void;
  setInsights: (insights: Insights | null) => void;
  setIsAnalyzing: (value: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useConsultationStore = create<ConsultationState>((set) => ({
  transcript: '',
  interimTranscript: '',
  isRecording: false,
  insights: null,
  isAnalyzing: false,
  error: null,
  appendTranscript: (text) => set((state) => ({ transcript: state.transcript + text })),
  setInterimTranscript: (text) => set({ interimTranscript: text }),
  setIsRecording: (value) => set({ isRecording: value }),
  setInsights: (insights) => set({ insights }),
  setIsAnalyzing: (value) => set({ isAnalyzing: value }),
  setError: (error) => set({ error }),
  reset: () => set({
    transcript: '',
    interimTranscript: '',
    isRecording: false,
    insights: null,
    isAnalyzing: false,
    error: null,
  }),
}));
