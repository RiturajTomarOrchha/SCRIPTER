import { useState, useEffect, useRef, useCallback } from 'react';

// Web Speech API interface declarations
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

export interface UseSpeechToTextOptions {
  onFinalResult?: (text: string) => void;
  lang?: string;
}

export const useSpeechToText = (options: UseSpeechToTextOptions = {}) => {
  const { onFinalResult, lang = 'en-US' } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping speech recognition:', err);
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, [isListening]);

  const startListening = useCallback(
    (customLang?: string) => {
      setError(null);
      if (!isSupported) {
        setError('Speech recognition is not supported in this browser. Please use Google Chrome or a Chromium browser.');
        return;
      }

      try {
        const SpeechRecognitionClass =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (e) {
            // ignore
          }
        }

        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = customLang || lang || 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let currentInterim = '';
          let finalChunk = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const item = event.results[i];
            if (item.isFinal) {
              finalChunk += item[0].transcript;
            } else {
              currentInterim += item[0].transcript;
            }
          }

          if (finalChunk) {
            setTranscript((prev) => (prev ? `${prev} ${finalChunk}` : finalChunk));
            if (onFinalResult) {
              onFinalResult(finalChunk.trim());
            }
          }

          setInterimTranscript(currentInterim);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.warn('Speech recognition error event:', event.error);
          if (event.error === 'not-allowed') {
            setError('Microphone permission was denied. Please allow microphone access in your browser settings.');
          } else if (event.error !== 'no-speech') {
            setError(`Speech recognition notice: ${event.error}`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };

        recognition.start();
      } catch (err: any) {
        console.error('Failed to start speech recognition:', err);
        setError(err.message || 'Could not start speech recognition');
        setIsListening(false);
      }
    },
    [isSupported, lang, onFinalResult]
  );

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};
