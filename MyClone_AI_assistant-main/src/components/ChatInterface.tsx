import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send as SendIcon } from 'lucide-react';
import { useStore } from '../store';
import { Message } from '../types';
import { ModelSelector } from './ModelSelector';
import { useTranslation } from 'react-i18next';

export const ChatInterface: React.FC = () => {
  const { t } = useTranslation();
  const { messages, isListening, setListening, addMessage, generateResponse, ai, isTyping } = useStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = React.useState('');
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'es-ES';

      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (isListening && recognition.current) {
      recognition.current.start();
    } else if (!isListening && recognition.current) {
      recognition.current.stop();
    }
  }, [isListening]);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !ai.selectedModel) return;
    
    const message: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    addMessage(message);
    setInput('');
    
    await generateResponse(input);
  };

  const handleSend = async () => {
    await handleSubmit({ preventDefault: () => {}, ...({} as React.FormEvent<HTMLFormElement>) });
  };

  return (
    <div className="flex flex-col h-full">
      <ModelSelector />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block max-w-[70%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-gray-500 text-sm">
            {t('chat.thinking')}
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chat.placeholder')}
            className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 disabled:bg-gray-400"
          >
            <SendIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setListening(!isListening)}
            className={`p-2 rounded-full ${
              isListening ? 'bg-red-500' : 'bg-gray-200'
            }`}
            disabled={!ai.selectedModel || ai.isProcessing}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </form>
        {ai.isProcessing && (
          <div className="mt-2 text-sm text-gray-500 text-center">
            Generando respuesta...
          </div>
        )}
      </div>
    </div>
  );
};