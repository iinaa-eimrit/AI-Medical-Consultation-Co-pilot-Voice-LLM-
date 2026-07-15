import { useEffect, useRef } from 'react';
import { useClinicalAudioStream } from '../hooks/useClinicalAudioStream';
import { useConsultationStore } from '../store/useConsultationStore';
import { Mic, MicOff, RotateCcw, Sparkles, Loader2, ShieldCheck } from 'lucide-react';
import { extractInsights, generateSystemReply } from '../lib/gemini';
import { v4 as uuidv4 } from 'uuid';

function formatTimestamp(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}]`;
}

export default function TranscriptionPanel() {
  const { isRecording, start, stop } = useClinicalAudioStream();
  const utterances = useConsultationStore((s) => s.utterances);
  const interimTranscript = useConsultationStore((s) => s.interimTranscript);
  const isAnalyzing = useConsultationStore((s) => s.isAnalyzing);
  const error = useConsultationStore((s) => s.error);
  const setInsights = useConsultationStore((s) => s.setInsights);
  const setIsAnalyzing = useConsultationStore((s) => s.setIsAnalyzing);
  const setError = useConsultationStore((s) => s.setError);
  const reset = useConsultationStore((s) => s.reset);
  const isReplying = useConsultationStore((s) => s.isReplying);
  const setIsReplying = useConsultationStore((s) => s.setIsReplying);
  const appendUtterance = useConsultationStore((s) => s.appendUtterance);

  useEffect(() => {
    const lastUtt = utterances[utterances.length - 1];
    if (lastUtt && lastUtt.speaker === 'HCP' && !isReplying) {
      setIsReplying(true);
      const transcriptHistory = utterances.map(u => `${u.speaker}: ${u.text}`).join('\n');
      
      generateSystemReply(transcriptHistory).then(replyText => {
        appendUtterance({
          id: uuidv4(),
          speaker: 'SYSTEM',
          text: replyText,
          timestamp: lastUtt.timestamp + 1200 // Mock slightly delayed timestamp
        });
      }).catch(err => {
        console.error("Auto-reply failed:", err);
      }).finally(() => {
        setIsReplying(false);
      });
    }
  }, [utterances, isReplying, setIsReplying, appendUtterance]);

  const handleAnalyze = async () => {
    if (utterances.length === 0) {
      setError('Nothing to analyze yet. Start recording first.');
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    try {
      const fullText = utterances.map(u => `${u.speaker}: ${u.text}`).join('\n');
      const insights = await extractInsights(fullText);
      setInsights(insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Check your API key and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden h-full">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center pb-4 mb-2">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-slateNavy">Live Transcription</h2>
          {isRecording && (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-4 bg-red-500 rounded-full animate-waveform"></span>
              <span className="w-1.5 h-6 bg-red-500 rounded-full animate-waveform" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-4 bg-red-500 rounded-full animate-waveform" style={{ animationDelay: '0.4s' }}></span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            title="Clear transcript"
            aria-label="Clear transcript"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={isRecording ? stop : start}
            aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-700 hover:bg-teal-800'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isRecording ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {error && <div className="mb-3 text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
        
        {utterances.map((utt) => (
          <div key={utt.id} className="flex gap-3 w-full pr-4">
            <div className="w-16 shrink-0 flex flex-col items-end pt-1">
              <span className="text-[10px] font-mono text-slate-400">{formatTimestamp(utt.timestamp)}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                utt.speaker === 'HCP' ? 'bg-teal-100 text-deepTeal' : 
                utt.speaker === 'PATIENT' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
              }`}>
                {utt.speaker}
              </span>
            </div>
            <div className="flex-1 text-sm text-slateNavy leading-relaxed">
              {utt.text}
              {utt.flags && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  ⚠️ {utt.flags.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>
        ))}

        {isRecording && interimTranscript && (
          <div className="flex gap-3 w-full pr-4 opacity-50">
            <div className="w-16 shrink-0 flex flex-col items-end pt-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                ...
              </span>
            </div>
            <div className="flex-1 text-sm text-slate-500 leading-relaxed italic">
              {interimTranscript}
            </div>
          </div>
        )}

        {isReplying && (
          <div className="flex gap-3 w-full pr-4 opacity-70">
            <div className="w-16 shrink-0 flex flex-col items-end pt-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                SYSTEM
              </span>
            </div>
            <div className="flex-1 text-sm text-slate-500 leading-relaxed flex items-center gap-1 pt-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}

        {utterances.length === 0 && !isRecording && (
          <p className="text-slate-400 text-sm mt-4 text-center">Click "Start" and begin speaking. The clinical transcript will appear here.</p>
        )}
      </div>
      <div className="p-4 border-t border-gray-100 bg-slate-50">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || utterances.length === 0}
          aria-label="Extract Clinical Insights"
          className={`w-full py-3 rounded-lg font-semibold text-center flex items-center justify-center gap-2 text-white transition-all shadow-sm ${
            isAnalyzing || utterances.length === 0
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-teal-700 hover:bg-teal-800'
          }`}
        >
          {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isAnalyzing ? 'Processing AI Models...' : 'Extract Clinical Insights'}
        </button>
        <div className="flex justify-center items-center gap-1 mt-3 text-[10px] text-slate-400 font-medium tracking-wide">
          <ShieldCheck className="w-3 h-3" />
          HIPAA COMPLIANT ENVIRONMENT
        </div>
      </div>
    </section>
  );
}
