import { useEffect, useRef } from 'react';
import { useConsultationStore } from '../store/useConsultationStore';
import { v4 as uuidv4 } from 'uuid';
import type { TranscriptUtterance } from '../types/clinical';

export function useClinicalAudioStream() {
  const appendUtterance = useConsultationStore((s) => s.appendUtterance);
  const setInterimTranscript = useConsultationStore((s) => s.setInterimTranscript);
  const setIsRecording = useConsultationStore((s) => s.setIsRecording);
  const setError = useConsultationStore((s) => s.setError);
  const isRecording = useConsultationStore((s) => s.isRecording);

  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log("[Web Speech API] Started listening...");
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      console.log("[Web Speech API] Result received:", { interimTranscript, finalTranscript });

      if (finalTranscript.trim()) {
        const timestamp = Date.now() - startTimeRef.current;
        const utterance: TranscriptUtterance = {
          id: uuidv4(),
          speaker: 'HCP', // Defaulting to HCP for demo
          text: finalTranscript.trim(),
          timestamp
        };
        appendUtterance(utterance);
      }
      setInterimTranscript(interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("[Web Speech API] Error:", event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access blocked. Please click the lock icon in your browser address bar and allow microphone access.');
      } else if (event.error === 'no-speech') {
        // Just ignore no-speech, it happens if the room is quiet.
      } else {
        setError(`Microphone Error: ${event.error}.`);
      }
    };

    recognition.onend = () => {
      console.log("[Web Speech API] Stopped listening.");
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [appendUtterance, setInterimTranscript, setIsRecording, setError]);

  const start = () => {
    setError(null);
    setIsRecording(true);
    startTimeRef.current = Date.now();
    try {
      recognitionRef.current?.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
    }
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  return { isRecording, start, stop };
}
