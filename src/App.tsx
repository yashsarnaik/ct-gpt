import React from 'react';
import 'regenerator-runtime/runtime'
import { Stethoscope } from 'lucide-react';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { LanguageSelector } from './components/LanguageSelector';
import { useChat } from './hooks/useChat';

function App() {
  const { messages, isLoading, sendMessage, currentLanguage, setLanguage } = useChat();

  return (
    <div className="h-screen flex flex-col bg-gray-100 ">
      {/* Fixed Header */}
      <header className="bg-white border-b border-gray-200 flex-none">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Clinical Trac GPT</h1>
          </div>
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={setLanguage}
          />
        </div>
      </header>

      {/* Main Chat Area with Fixed Height */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full bg-white shadow-lg my-4 rounded-lg overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div className="max-w-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome to Clinical Trac GPT
              </h2>
              <p className="text-gray-600">
                Ask Any  Question
              </p>
            </div>
          </div>
        ) : (
          <ChatWindow messages={messages} isLoading={isLoading} />
        )}
        <ChatInput
          onSendMessage={sendMessage}
          disabled={isLoading}
          language={currentLanguage}
        />
      </main>

      {/* Fixed Footer */}
      <footer className="bg-white border-t border-gray-200 flex-none">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-600">
          Clinical Trac GPT © {new Date().getFullYear()} - AI-Powered by onPoint  Software Service 
        </div>
      </footer>
    </div>
  );
}

export default App;