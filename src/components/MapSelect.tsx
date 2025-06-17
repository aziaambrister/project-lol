import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trees as Tree, Mountain, Home } from 'lucide-react';

interface MapSelectProps {
  onMapSelected: () => void;
}

const maps = [
  {
    id: 'forest',
    name: 'Mystic Forest',
    description: 'A dense forest filled with ancient trees, flowing streams, and hidden paths. Watch out for bandits and wild creatures lurking in the shadows.',
    image: 'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Tree,
    features: ['Natural pathways', 'Wooden bridges', 'Flowing streams', 'Dense vegetation']
  },
  {
    id: 'cave',
    name: 'Shadow Cave',
    description: 'Dark, winding caverns illuminated by mysterious crystals. The echoes of dripping water and unknown creatures fill the air.',
    image: 'https://images.pexels.com/photos/2437297/pexels-photo-2437297.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Mountain,
    features: ['Crystal formations', 'Underground streams', 'Hidden alcoves', 'Echo chambers']
  },
  {
    id: 'village',
    name: 'Ancient Village',
    description: 'A traditional Japanese village with paper lanterns, wooden bridges, and bustling markets. Be wary of corrupt guards and skilled warriors.',
    image: 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Home,
    features: ['Market stalls', 'Traditional architecture', 'Stone pathways', 'Sacred shrines']
  }
];

const MapSelect: React.FC<MapSelectProps> = ({ onMapSelected }) => {
  const [selectedMap, setSelectedMap] = useState<string>('forest'); // Default to forest
  const { travel } = useGame();
  
  const handleMapConfirm = () => {
    if (selectedMap) {
      // Travel to the selected location first
      travel(selectedMap);
      // Then trigger the state change to show the game world
      onMapSelected();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Choose Your Path</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {maps.map(map => {
            const Icon = map.icon;
            const isSelected = selectedMap === map.id;
            
            return (
              <div
                key={map.id}
                className={`
                  relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300
                  ${isSelected ? 'ring-4 ring-yellow-400 transform scale-105' : 'hover:transform hover:scale-102'}
                `}
                onClick={() => setSelectedMap(map.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                <img
                  src={map.image}
                  alt={map.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <div className="flex items-center mb-2">
                    <Icon className="w-6 h-6 mr-2 text-yellow-400" />
                    <h3 className="text-xl font-bold">{map.name}</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{map.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {map.features.map((feature, index) => (
                      <div
                        key={index}
                        className="text-xs bg-black bg-opacity-50 rounded px-2 py-1"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                
                {isSelected && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-sm">
                      Selected
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <button
            className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105"
            onClick={handleMapConfirm}
          >
            Begin Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapSelect;