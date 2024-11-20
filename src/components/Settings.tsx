import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useStore } from '../store';

export const Settings: React.FC = () => {
  const { voiceConfig, updateVoiceConfig } = useStore();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="w-6 h-6 text-gray-600" />
        <h2 className="text-xl font-semibold">Configuración</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Velocidad de voz
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={voiceConfig.speed}
            onChange={(e) =>
              updateVoiceConfig({ speed: parseFloat(e.target.value) })
            }
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Lento</span>
            <span>Normal</span>
            <span>Rápido</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tono de voz
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={voiceConfig.pitch}
            onChange={(e) =>
              updateVoiceConfig({ pitch: parseFloat(e.target.value) })
            }
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Grave</span>
            <span>Normal</span>
            <span>Agudo</span>
          </div>
        </div>
      </div>
    </div>
  );
};