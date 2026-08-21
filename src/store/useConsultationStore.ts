import { create } from 'zustand';
import type { TranscriptUtterance, ClinicalInsights } from '../types/clinical';

interface ConsultationState {
  activeTab: string;
  isMobileMenuOpen: boolean;
  utterances: TranscriptUtterance[];
  interimTranscript: string;
  isRecording: boolean;
  isReplying: boolean;
  insights: ClinicalInsights | null;
  isAnalyzing: boolean;
  agentState: string | null;
  error: string | null;
  appendUtterance: (utterance: TranscriptUtterance) => void;
  setInterimTranscript: (text: string) => void;
  setIsRecording: (value: boolean) => void;
  setIsReplying: (value: boolean) => void;
  setInsights: (insights: ClinicalInsights | null) => void;
  setIsAnalyzing: (value: boolean) => void;
  setAgentState: (state: string | null) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: string) => void;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  reset: () => void;
}

const mockInitialUtterances: TranscriptUtterance[] = [
  {
    id: '1',
    speaker: 'HCP',
    text: "Good morning. I'd like to discuss the new oncology regimen for patient JD, specifically regarding Pembrolizumab.",
    timestamp: 12000,
  },
  {
    id: '2',
    speaker: 'SYSTEM',
    text: "Patient JD records accessed. Current regimen includes Pembrolizumab 200mg IV every 3 weeks.",
    timestamp: 16000,
  },
  {
    id: '3',
    speaker: 'HCP',
    text: "The patient reported a grade 2 rash after the second cycle. We might need to consider topical corticosteroids and monitor closely before the next infusion.",
    timestamp: 25000,
    flags: 'ADVERSE_EVENT'
  }
];

export const useConsultationStore = create<ConsultationState>((set) => ({
  activeTab: 'Dashboard',
  isMobileMenuOpen: false,
  utterances: mockInitialUtterances,
  interimTranscript: '',
  isRecording: false,
  isReplying: false,
  insights: null,
  isAnalyzing: false,
  agentState: null,
  error: null,
  appendUtterance: (utterance) => set((state) => ({ utterances: [...state.utterances, utterance] })),
  setInterimTranscript: (text) => set({ interimTranscript: text }),
  setIsRecording: (value) => set({ isRecording: value }),
  setIsReplying: (value) => set({ isReplying: value }),
  setInsights: (insights) => set({ insights }),
  setIsAnalyzing: (value) => set({ isAnalyzing: value }),
  setAgentState: (state) => set({ agentState: state }),
  setActiveTab: (tab) => set({ activeTab: tab, isMobileMenuOpen: false }), // Auto close on navigation
  setIsMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  setError: (error) => set({ error }),
  reset: () => set({
    utterances: [],
    interimTranscript: '',
    isRecording: false,
    insights: null,
    isReplying: false,
    isAnalyzing: false,
    agentState: null,
    error: null
  }),
}));
