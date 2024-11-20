import React from 'react';
import { useStore } from '../store';
import { ModelConfig } from '../types';

const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'Xenova/LaMini-Flan-T5-783M',
    name: 'LaMini-Flan-T5',
    task: 'text-generation',
    loading: false,
  },
  {
    id: 'Xenova/distilgpt2',
    name: 'DistilGPT2',
    task: 'text-generation',
    loading: false,
  },
];

export const ModelSelector: React.FC = () => {
  const { ai, selectModel } = useStore();

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Modelo de IA</h3>
      <div className="grid grid-cols-1 gap-2">
        {AVAILABLE_MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => selectModel(model)}
            className={`p-3 rounded-lg border ${
              ai.selectedModel?.id === model.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-500'
            }`}
            disabled={ai.loading}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{model.name}</span>
              {ai.selectedModel?.id === model.id && ai.loading && (
                <span className="text-sm text-blue-600">Cargando...</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{model.id}</p>
          </button>
        ))}
      </div>
      {ai.error && (
        <div className="mt-2 text-sm text-red-600">{ai.error}</div>
      )}
    </div>
  );
};