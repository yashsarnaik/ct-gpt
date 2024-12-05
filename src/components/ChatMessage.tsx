import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types/chat';
import { formatMessageTime } from '../utils/dateFormat';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} p-4`}>
      <div className={`flex ${isAssistant ? 'flex-row' : 'flex-row-reverse'} gap-4 max-w-[80%]`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isAssistant ? 'bg-blue-600' : 'bg-gray-600'
        }`}>
          {isAssistant ? (
            <Bot className="w-5 h-5 text-white" />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>
        <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className="font-medium text-sm text-gray-500">
              {isAssistant ? 'Clinical Trac GPT' : 'You'}
            </div>
            <div className="text-xs text-gray-400">
              {formatMessageTime(message.timestamp)}
            </div>
          </div>
          <div className={`prose prose-sm max-w-none p-4 rounded-lg ${
            isAssistant
              ? 'bg-gray-100 rounded-tl-none'
              : 'bg-blue-600 text-white rounded-tr-none'
          }`}>
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
}