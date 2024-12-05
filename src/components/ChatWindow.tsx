import React, { useEffect, useRef } from 'react';
import { Message } from '../types/chat';
import { ChatMessage } from './ChatMessage';
import { useScrollToBottom } from '../hooks/useScrollToBottom.ts';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollToBottom, isNearBottom } = useScrollToBottom(scrollContainerRef);

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isLoading, scrollToBottom, isNearBottom]);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden"
      style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: '#CBD5E1 transparent'
      }}
    >
      <div className="flex flex-col">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex gap-4 p-4 bg-gray-50">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}