import React, { useState, KeyboardEvent } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'regenerator-runtime/runtime';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  language: string;
}

export function ChatInput({ onSendMessage, disabled, language }: ChatInputProps) {
  const [input, setInput] = useState('');
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  React.useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      resetTranscript();
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ 
        continuous: true,
        language: language 
      });
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <textarea
            className="flex-1 resize-none rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[60px]"
            placeholder="Type your medical query here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={disabled}
            rows={1}
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || !input.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex gap-2 max-w-4xl mx-auto">
        <textarea
          className="flex-1 resize-none rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[60px]"
          placeholder="Type your medical query here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={disabled}
          rows={1}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={toggleListening}
            disabled={disabled}
            className={`p-3 rounded-lg transition-colors ${
              listening
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            title={listening ? 'Stop listening' : 'Start listening'}
          >
            {listening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleSubmit}
            disabled={disabled || !input.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}