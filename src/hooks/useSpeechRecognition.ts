import { useEffect, useRef } from 'react';
import { useConsultationStore } from '../store/useConsultationStore';

export function useSpeechRecognition() {
  const appendTranscript = useConsultationStore((s) => s.appendTranscript);
  const setInterimTranscript = useConsultationStore((s) => s.setInterimTranscript);
  const setIsRecording = useConsultationStore((s) => s.setIsRecording);
  const setError = useConsultationStore((s) => s.setError);
  const isRecording = useConsultationStore((s) => s.isRecording);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Try Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

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
      if (finalTranscript) {
        appendTranscript(finalTranscript + ' ');
      }
      setInterimTranscript(interimTranscript);
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [appendTranscript, setInterimTranscript, setIsRecording, setError]);

  const start = () => {
    setError(null);
    setIsRecording(true);
    recognitionRef.current?.start();
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  return { isRecording, start, stop };
}
