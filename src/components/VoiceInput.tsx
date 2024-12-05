import React, { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import 'regenerator-runtime/runtime';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  disabled: boolean;
  language: string;
}

export function VoiceInput({ onTranscript, disabled, language }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        if (event.results[0].isFinal) {
          onTranscript(transcript);
          setIsListening(false);
          recognition.stop();
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!recognition) {
    return null;
  }

  return (
    <button
      onClick={toggleListening}
      disabled={disabled}
      className={`p-3 rounded-lg transition-colors ${
        isListening
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-blue-600 hover:bg-blue-700'
      } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isListening ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}