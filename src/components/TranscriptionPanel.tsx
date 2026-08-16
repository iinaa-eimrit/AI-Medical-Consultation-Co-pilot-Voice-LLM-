import { useEffect, useRef } from 'react';
import { useClinicalAudioStream } from '../hooks/useClinicalAudioStream';
import { useConsultationStore } from '../store/useConsultationStore';
import { Mic, MicOff, RotateCcw, FileCog, Loader2, ShieldCheck } from 'lucide-react';
import { extractInsights, generateSystemReply } from '../lib/gemini';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';

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

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastRepliedToId = useRef<string | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [utterances, interimTranscript, isReplying]);

  useEffect(() => {
    const lastUtt = utterances[utterances.length - 1];
    if (lastUtt && lastUtt.speaker === 'HCP' && !isReplying && lastRepliedToId.current !== lastUtt.id) {
      lastRepliedToId.current = lastUtt.id;
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
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shrink-0">
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
          <Button
            variant="ghost"
            size="icon"
            onClick={reset}
            className="text-slate-500"
            title="Clear transcript"
            aria-label="Clear transcript"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            onClick={isRecording ? stop : start}
            variant={isRecording ? "destructive" : "default"}
            className={!isRecording ? "bg-teal-700 hover:bg-teal-800 text-white" : ""}
          >
            {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
            {isRecording ? 'Stop' : 'Start'}
          </Button>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 p-4 pb-24 overflow-y-auto space-y-4 scroll-smooth scrollbar-hide">
        {error && <div className="mb-3 text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
        
        <div className="flex flex-col space-y-4">
          {utterances.map((utt) => {
            const isSystem = utt.speaker === 'SYSTEM';
            return (
              <div key={utt.id} className={`flex w-full ${isSystem ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] md:max-w-[75%] flex flex-col ${isSystem ? 'items-start' : 'items-end'}`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className={`text-[10px] font-bold ${isSystem ? 'text-slate-500' : 'text-teal-700'}`}>
                      {utt.speaker}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{formatTimestamp(utt.timestamp)}</span>
                  </div>
                  
                  <div className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md break-words whitespace-pre-wrap ${
                    isSystem 
                      ? 'bg-slate-100 text-slate-700 rounded-tl-sm border border-gray-200/60' 
                      : 'bg-white text-slateNavy rounded-tr-sm border border-teal-100/50'
                  }`}>
                    {utt.text}
                    {utt.flags && (
                      <div className="mt-2 inline-flex items-center px-2 py-1 rounded bg-red-500 text-white text-[10px] font-bold tracking-wide shadow-sm border border-red-600">
                        ⚠️ {utt.flags.replace('_', ' ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isRecording && interimTranscript && (
            <div className="flex w-full justify-end opacity-60">
              <div className="max-w-[85%] md:max-w-[75%] flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] font-bold text-teal-700">HCP</span>
                </div>
                <div className="relative px-4 py-3 rounded-2xl text-sm leading-relaxed bg-white text-slate-500 italic rounded-tr-sm border border-teal-100/50 shadow-md break-words whitespace-pre-wrap">
                  {interimTranscript}
                  <span className="ml-1 animate-pulse">...</span>
                </div>
              </div>
            </div>
          )}

          {isReplying && (
            <div className="flex w-full justify-start opacity-70">
              <div className="max-w-[85%] md:max-w-[75%] flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] font-bold text-slate-500">SYSTEM</span>
                </div>
                <div className="relative px-4 py-4 rounded-2xl bg-slate-100 rounded-tl-sm border border-gray-200/60 shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {utterances.length === 0 && !isRecording && (
          <p className="text-slate-400 text-sm mt-4 text-center">Click "Start" and begin speaking. The clinical transcript will appear here.</p>
        )}
      </div>
      <div className="p-4 border-t border-gray-100 bg-slate-50 shrink-0">
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || utterances.length === 0}
            className="w-full py-6 text-base font-semibold bg-teal-700 hover:bg-teal-800 text-white shadow-sm"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileCog className="w-4 h-4 mr-2" />}
            {isAnalyzing ? 'Processing AI Models...' : 'Extract Clinical Insights'}
          </Button>
          <div className="flex items-center text-[10px] text-slate-400 font-medium tracking-wide">
            <ShieldCheck className="w-3 h-3 mr-1" />
            HIPAA COMPLIANT ENVIRONMENT
          </div>
        </div>
      </div>
    </section>
  );
}
