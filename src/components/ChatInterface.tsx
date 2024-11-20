import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';
import { useStore } from '../store';
import { Message } from '../types';
import { ModelSelector } from './ModelSelector';

export const ChatInterface: React.FC = () => {
  const { messages, isListening, setListening, addMessage, generateResponse, ai } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = React.useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
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

  return (
    <div className="flex flex-col h-full">
      <ModelSelector />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
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
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              ai.selectedModel
                ? 'Escribe un mensaje...'
                : 'Selecciona un modelo para comenzar'
            }
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!ai.selectedModel || ai.isProcessing}
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!ai.selectedModel || ai.isProcessing || !input.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {ai.isProcessing && (
          <div className="mt-2 text-sm text-gray-500 text-center">
            Generando respuesta...
          </div>
        )}
      </div>
    </div>
  );
};