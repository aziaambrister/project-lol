import React from 'react';
import { useGame } from '../context/GameContext';
import { MapPin } from 'lucide-react';
import { locations } from '../data/locations';

const LocationInfo: React.FC = () => {
  const { state, travel } = useGame();
  const { currentLocation } = state;
  
  return (
    <div className="bg-black bg-opacity-60 p-3 rounded-lg text-white max-w-xs">
      <div className="flex items-center mb-2">
        <MapPin className="text-yellow-500 mr-2" size={20} />
        <h2 className="text-lg font-bold">{currentLocation.name}</h2>
      </div>
      
      <p className="text-sm text-gray-300 mb-4">{currentLocation.description}</p>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-yellow-300">Connections:</h3>
        <div className="grid grid-cols-2 gap-2">
          {currentLocation.connections.map(locationId => {
            const location = locations.find(loc => loc.id === locationId);
            if (!location) return null;
            
            return (
              <button
                key={locationId}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded flex items-center justify-between"
                onClick={() => travel(locationId)}
              >
                <span>{location.name}</span>
                <span className="text-yellow-400">→</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {currentLocation.enemies.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-red-300">Enemies in this area:</h3>
          <ul className="text-xs text-gray-300 mt-1">
            {currentLocation.enemies.map(enemy => (
              <li key={enemy.id} className="flex justify-between">
                <span>{enemy.name}</span>
                <span className="text-red-400">Lvl {Math.floor(enemy.strength / 2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationInfo;