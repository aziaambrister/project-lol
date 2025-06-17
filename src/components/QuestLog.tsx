import React from 'react';
import { useGame } from '../context/GameContext';
import { CheckCircle, Circle } from 'lucide-react';

const QuestLog: React.FC = () => {
  const { state } = useGame();
  const { quests } = state.player;
  
  // Get available quests based on location
  const availableQuests = [] // In a real implementation, this would be based on NPCs in the current location
  
  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-90 text-white z-20 overflow-hidden">
      <div className="container mx-auto h-full p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Quest Log</h2>
        
        <div className="flex-1 overflow-y-auto">
          {quests.length > 0 ? (
            <div className="space-y-4">
              {quests.map(quest => (
                <div 
                  key={quest.id}
                  className={`p-4 rounded-md ${quest.completed ? 'bg-green-900 bg-opacity-30' : 'bg-gray-800'}`}
                >
                  <div className="flex items-start">
                    <div className="mr-2 mt-1">
                      {quest.completed ? (
                        <CheckCircle className="text-green-500\" size={20} />
                      ) : (
                        <Circle className="text-yellow-500" size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{quest.name}</h3>
                      <p className="text-sm text-gray-300 mb-3">{quest.description}</p>
                      
                      {/* Objectives */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Objectives:</h4>
                        <ul className="space-y-2">
                          {quest.objectives.map(objective => (
                            <li key={objective.id} className="flex items-center">
                              <div className="mr-2">
                                {objective.completed ? (
                                  <CheckCircle className="text-green-500\" size={16} />
                                ) : (
                                  <Circle className="text-gray-500" size={16} />
                                )}
                              </div>
                              <div className="flex-1">
                                <span className="text-sm">{objective.description}</span>
                                {objective.count > 1 && (
                                  <span className="text-xs text-gray-400 ml-2">
                                    ({objective.progress}/{objective.count})
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Rewards */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Rewards:</h4>
                        <div className="flex flex-wrap gap-3 text-xs">
                          <div className="bg-gray-700 px-2 py-1 rounded-md">
                            {quest.rewards.experience} XP
                          </div>
                          <div className="bg-gray-700 px-2 py-1 rounded-md">
                            {quest.rewards.currency} Coins
                          </div>
                          {quest.rewards.items.map(item => (
                            <div 
                              key={item.id} 
                              className={`px-2 py-1 rounded-md ${
                                item.rarity === 'common' ? 'bg-gray-600' : 
                                item.rarity === 'uncommon' ? 'bg-green-700' : 
                                item.rarity === 'rare' ? 'bg-blue-700' : 
                                item.rarity === 'epic' ? 'bg-purple-700' : 'bg-yellow-700'
                              }`}
                            >
                              {item.icon} {item.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>No active quests. Visit NPCs in the world to find quests.</p>
            </div>
          )}
        </div>
        
        {/* Available quests */}
        {availableQuests.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Available Quests:</h3>
            <div className="space-y-2">
              {availableQuests.map(quest => (
                <div key={quest.id} className="p-3 bg-gray-800 rounded-md">
                  <h4 className="font-medium">{quest.name}</h4>
                  <p className="text-sm text-gray-300">{quest.description}</p>
                  <button className="mt-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-md text-sm">
                    Accept Quest
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestLog;