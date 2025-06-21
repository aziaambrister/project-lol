import React, { useState } from 'react';
import { Settings, LogOut, Play, Volume2, VolumeX, Monitor, Gamepad2 } from 'lucide-react';

interface EscapeMenuProps {
  onClose: () => void;
}

const EscapeMenu: React.FC<EscapeMenuProps> = ({ onClose }) => {
  const [currentView, setCurrentView] = useState<'main' | 'settings'>('main');
  const [settings, setSettings] = useState({
    soundEnabled: true,
    musicVolume: 70,
    sfxVolume: 80,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    showMinimap: true,
    autoSave: true
  });

  const handleReturnToGame = () => {
    onClose();
  };

  const handleSettings = () => {
    setCurrentView('settings');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
  };

  const handleExitGame = () => {
    if (confirm('Are you sure you want to exit the game? Any unsaved progress will be lost.')) {
      window.location.reload();
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border-2 border-yellow-400/50 shadow-2xl p-8 w-96 max-w-[90vw]">
        
        {currentView === 'main' ? (
          <>
            {/* Main Menu */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                Game Menu
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-4">
              {/* Return to Game */}
              <button
                onClick={handleReturnToGame}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Play size={24} />
                <span>Return to Game</span>
              </button>

              {/* Settings */}
              <button
                onClick={handleSettings}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Settings size={24} />
                <span>Settings</span>
              </button>

              {/* Exit Game */}
              <button
                onClick={handleExitGame}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <LogOut size={24} />
                <span>Exit Game</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-black/30 rounded-lg border border-gray-600">
              <h3 className="text-yellow-400 font-bold mb-2 text-center">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-300">Level:</div>
                <div className="text-white font-bold">1</div>
                <div className="text-gray-300">Coins:</div>
                <div className="text-yellow-400 font-bold">100</div>
                <div className="text-gray-300">Health:</div>
                <div className="text-red-400 font-bold">100/100</div>
                <div className="text-gray-300">Enemies:</div>
                <div className="text-orange-400 font-bold">8 Active</div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Settings Menu */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                Settings
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-6 max-h-80 overflow-y-auto">
              {/* Audio Settings */}
              <div className="space-y-4">
                <h3 className="text-yellow-400 font-bold flex items-center">
                  <Volume2 size={20} className="mr-2" />
                  Audio
                </h3>
                
                {/* Sound Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Sound Enabled</span>
                  <button
                    onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                      settings.soundEnabled ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>

                {/* Music Volume */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Music Volume</span>
                    <span className="text-white font-bold">{settings.musicVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.musicVolume}
                    onChange={(e) => handleSettingChange('musicVolume', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* SFX Volume */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">SFX Volume</span>
                    <span className="text-white font-bold">{settings.sfxVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.sfxVolume}
                    onChange={(e) => handleSettingChange('sfxVolume', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Gameplay Settings */}
              <div className="space-y-4">
                <h3 className="text-yellow-400 font-bold flex items-center">
                  <Gamepad2 size={20} className="mr-2" />
                  Gameplay
                </h3>
                
                {/* Difficulty */}
                <div className="space-y-2">
                  <span className="text-gray-300">Difficulty</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['easy', 'medium', 'hard'].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => handleSettingChange('difficulty', diff)}
                        className={`py-2 px-3 rounded-lg font-bold text-sm transition-all duration-300 ${
                          settings.difficulty === diff
                            ? 'bg-yellow-500 text-black'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Show Minimap */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Show Minimap</span>
                  <button
                    onClick={() => handleSettingChange('showMinimap', !settings.showMinimap)}
                    className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                      settings.showMinimap ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      settings.showMinimap ? 'translate-x-6' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>

                {/* Auto Save */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Auto Save</span>
                  <button
                    onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                    className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                      settings.autoSave ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6">
              <button
                onClick={handleBackToMain}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <span>← Back to Menu</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fbbf24;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fbbf24;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default EscapeMenu;