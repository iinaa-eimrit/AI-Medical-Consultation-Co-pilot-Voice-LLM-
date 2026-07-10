import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useConsultationStore } from '../store/useConsultationStore';
import { Mic, MicOff, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { extractInsights } from '../lib/gemini';

export default function TranscriptionPanel() {
  const { isRecording, start, stop } = useSpeechRecognition();
  const transcript = useConsultationStore((s) => s.transcript);
  const interimTranscript = useConsultationStore((s) => s.interimTranscript);
  const isAnalyzing = useConsultationStore((s) => s.isAnalyzing);
  const error = useConsultationStore((s) => s.error);
  const setInsights = useConsultationStore((s) => s.setInsights);
  const setIsAnalyzing = useConsultationStore((s) => s.setIsAnalyzing);
  const setError = useConsultationStore((s) => s.setError);
  const reset = useConsultationStore((s) => s.reset);

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError('Nothing to analyze yet. Start recording first.');
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    try {
      const insights = await extractInsights(transcript);
      setInsights(insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Check your API key and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-medium">Live Transcription</h2>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            title="Clear transcript"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={isRecording ? stop : start}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white ${
              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isRecording ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {transcript}
          {isRecording && <span className="text-blue-500">{interimTranscript}</span>}
        </p>
        {!transcript && !isRecording && (
          <p className="text-gray-400 mt-2">Click "Start" and begin speaking. The transcript will appear here.</p>
        )}
      </div>
      <div className="p-4 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !transcript.trim()}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white ${
            isAnalyzing || !transcript.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isAnalyzing ? 'Analyzing...' : 'Analyze with Gemini'}
        </button>
      </div>
    </section>
  );
}
