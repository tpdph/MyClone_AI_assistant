import React from 'react';
import { Brain, MessageSquare, Settings as SettingsIcon } from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { KnowledgeBase } from './components/KnowledgeBase';
import { Settings } from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = React.useState<'chat' | 'knowledge' | 'settings'>('chat');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 bg-gray-900 flex flex-col items-center py-4 space-y-4">
        <button
          onClick={() => setActiveTab('chat')}
          className={`p-3 rounded-lg ${
            activeTab === 'chat'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-6 h-6" />
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`p-3 rounded-lg ${
            activeTab === 'knowledge'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Brain className="w-6 h-6" />
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`p-3 rounded-lg ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <SettingsIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === 'chat' && 'Chat con IA'}
            {activeTab === 'knowledge' && 'Base de Conocimiento'}
            {activeTab === 'settings' && 'Configuración'}
          </h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden">
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'knowledge' && <KnowledgeBase />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}

export default App;