import React, { useEffect, useState } from 'react';
import { Bot, Link, Volume2, VolumeX } from 'lucide-react';
import { Message } from '../types/chat';
import { formatMessageTime } from '../utils/dateFormat';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const [speakerOn, setSpeakerOn] = useState(false); // State to control speaker on/off

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = speechSynthesis.getVoices();
      setVoices(allVoices);
    };

    // Wait for voices to be loaded
    speechSynthesis.onvoiceschanged = loadVoices;

    // Initial voices load
    loadVoices();
  }, []);

  const handleToggleSpeaker = () => {
    setSpeakerOn(!speakerOn);

    if (!speakerOn && isAssistant) {
      const googleFemaleVoice = voices.find(
        (voice) =>
          voice.name.includes('Google') &&
          voice.lang.startsWith('en-US') &&
          voice.name.toLowerCase().includes('female')
      );

      const targetVoice =
        googleFemaleVoice ||
        voices.find((voice) => voice.lang.startsWith('en-US')) ||
        voices[0];

      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = 'en-US';
      utterance.voice = targetVoice;
      utterance.rate = 1;
      utterance.pitch = 1;

      speechSynthesis.speak(utterance);
    } else {
      speechSynthesis.cancel();
    }
  };

  // Function to convert text with URLs into clickable links
  const renderMessageContent = (content: string) => {
    const urlRegex = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;
    const parts = content.split(urlRegex);
    const urls = content.match(urlRegex);
  
    if (!urls) return content;
  
    return parts.reduce((acc: React.ReactNode[], part, i) => {
      acc.push(<span key={`text-${i}`}>{part}</span>);
      if (urls[i]) {
        const link = urls[i].startsWith('www.') ? `https://${urls[i]}` : urls[i];
        acc.push(
          <a
            key={`link-${i}`}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {urls[i]}
          </a>
        );
      }
      return acc;
    }, []);
  };
  

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} p-4`}>
      <div className={`flex ${isAssistant ? 'flex-row' : 'flex-row-reverse'} gap-4 max-w-[80%]`}>
        {isAssistant && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-600">
            <Bot className="w-5 h-5 text-white" />
          </div>
        )}
        <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className="font-medium text-sm text-gray-500">
              {isAssistant ? 'Clinical Trac GPT' : 'You'}
            </div>
            <div className="text-xs text-gray-400">
              {formatMessageTime(message.timestamp)}
            </div>
            {isAssistant && (
              <button
                onClick={handleToggleSpeaker}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                title={speakerOn ? 'Turn off speaker' : 'Turn on speaker'}
              >
                {speakerOn ? (
                  <Volume2 className="w-5 h-5 text-blue-500" />
                ) : (
                  <Volume2 className="w-5 h-5 text-gray-500" />
                )}
              </button>
            )}
          </div>
          <div
            className={`prose prose-sm max-w-none p-3 rounded-lg ${
              isAssistant
                ? 'bg-gray-100 rounded-tl-none'
                : 'bg-blue-600 text-white rounded-tr-none'
            }`}
          >
            {renderMessageContent(message.content)}
            {isAssistant && message.source_details && message.source_details.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600 font-medium mb-1">Sources:</div>
                <div className="space-y-1">
                  {message.source_details.map((source, index) => (
               <div key={index} className="flex items-center gap-1 text-sm">
               <Link className="w-4 h-4" />
               {source.metadata.url ? (
                 <a
                   href={
                     source.metadata.url.startsWith('http') 
                       ? source.metadata.url 
                       : `https://${source.metadata.url}`
                   }
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-blue-600 hover:underline"
                 >
                   {source.metadata.url}
                 </a>
               ) : (
                 <a
                   href={`https://${source.metadata.domain}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-blue-500 hover:underline"
                 >
                   {source.metadata.domain || 'Local source'}
                 </a>
               )}
             </div>
             
                
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
