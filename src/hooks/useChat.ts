import { useState, useCallback } from 'react';
import { Message, ChatState } from '../types/chat';
import { getMedicalResponse } from '../services/api';

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    currentLanguage: 'en',
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      language: state.currentLanguage,
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const assistantMessage = await getMedicalResponse(content, state.currentLanguage);

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
      }));
    }
  }, [state.currentLanguage]);

  const setLanguage = useCallback((language: string) => {
    setState((prev) => ({
      ...prev,
      currentLanguage: language,
    }));
  }, []);

  return {
    ...state,
    sendMessage,
    setLanguage,
  };
}