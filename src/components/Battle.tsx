import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Swords, Shield, Zap, Heart, Target } from 'lucide-react';

const Battle: React.FC = () => {
  const { state, performAction, endBattle, useItem } = useGame();
  const [selectedAction, setSelectedAction] = useState<'attack' | 'defend' | 'special' | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const [animation, setAnimation] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [enemyHealth, setEnemyHealth] = useState<number>(0);
  const [playerHealth, setPlayerHealth] = useState<number>(0);
  const [comboCount, setComboCount] = useState<number>(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, type: string}>>([]);
  
  const { battle, player } = state;
  const enemy = battle.enemy;
  
  useEffect(() => {
    if (enemy) {
      setEnemyHealth(enemy.health);
      setPlayerHealth(player.character.health);
      setLog([`A ${enemy.name} emerges from the shadows...`]);
    }
  }, [enemy, player.character.health]);

  useEffect(() => {
    if (!battle.inBattle || !enemy) return;
    
    if (battle.turn === 'enemy') {
      const attackTimer = setTimeout(() => {
        const enemyAbilities = enemy.abilities;
        const randomAbility = enemyAbilities[Math.floor(Math.random() * enemyAbilities.length)];
        
        const damage = Math.max(1, randomAbility.damage - player.character.defense / 2);
        const newPlayerHealth = Math.max(0, playerHealth - damage);
        
        setLog(prev => [...prev, `${enemy.name} uses ${randomAbility.name} for ${damage} damage!`]);
        setAnimation('player-hit');
        setPlayerHealth(newPlayerHealth);
        
        // Add hit particles
        addParticles('hit', 25, 75);
        
        setTimeout(() => {
          setAnimation(null);
          
          if (newPlayerHealth <= 0) {
            setLog(prev => [...prev, 'You have been defeated...']);
            setTimeout(() => endBattle(false), 2000);
          }
        }, 1000);
      }, 1500);
      
      return () => clearTimeout(attackTimer);
    }
  }, [battle.turn, battle.inBattle, enemy, playerHealth, player.character.defense]);

  const addParticles = (type: string, x: number, y: number) => {
    const newParticles = Array.from({length: 5}, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      type
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  const handleAction = (actionType: 'attack' | 'defend' | 'special') => {
    if (battle.turn !== 'player' || !enemy) return;
    setSelectedAction(actionType);
    if (actionType !== 'special') {
      executeAction(actionType);
    }
  };

  const handleSelectAbility = (abilityId: string) => {
    setSelectedAbility(abilityId);
    executeAction('special', abilityId);
  };

  const executeAction = (actionType: 'attack' | 'defend' | 'special', abilityId?: string) => {
    if (!enemy) return;
    
    let damage = 0;
    let actionText = '';
    let criticalHit = false;
    
    if (actionType === 'attack') {
      // Gun attack with combo system
      const baseDamage = 15 + (player.equippedItems.weapon?.effect?.value || 0);
      const comboMultiplier = 1 + (comboCount * 0.1);
      criticalHit = Math.random() < 0.15; // 15% crit chance
      
      damage = Math.max(1, Math.floor((baseDamage * comboMultiplier) * (criticalHit ? 1.5 : 1)) - enemy.defense / 2);
      
      setComboCount(prev => Math.min(prev + 1, 5));
      actionText = `You fire your weapon${criticalHit ? ' with perfect precision' : ''}${comboCount > 0 ? ` (Combo x${comboCount + 1})` : ''} for ${damage} damage!`;
      setAnimation('enemy-hit');
      addParticles('gunshot', 75, 50);
      
    } else if (actionType === 'defend') {
      damage = 0;
      setComboCount(0);
      actionText = 'You take a defensive stance, reducing incoming damage!';
      setAnimation('player-defend');
      
    } else if (actionType === 'special' && abilityId) {
      const ability = player.character.abilities.find(a => a.id === abilityId);
      if (ability) {
        const baseDamage = ability.damage + (player.character.strength / 2);
        damage = Math.max(1, baseDamage - enemy.defense / 2);
        setComboCount(0);
        actionText = `You unleash ${ability.name} for ${damage} damage!`;
        setAnimation('enemy-hit-special');
        addParticles('special', 75, 50);
      }
    }
    
    setLog(prev => [...prev, actionText]);
    
    if (damage > 0) {
      const newEnemyHealth = Math.max(0, enemyHealth - damage);
      setEnemyHealth(newEnemyHealth);
      
      if (newEnemyHealth <= 0) {
        setTimeout(() => {
          setLog(prev => [...prev, `${enemy.name} has been defeated!`]);
          setLog(prev => [...prev, `You gained ${enemy.experience} XP and ${enemy.currency} coins!`]);
          setTimeout(() => endBattle(true), 2000);
        }, 1000);
      } else {
        setTimeout(() => {
          setAnimation(null);
          setSelectedAction(null);
          setSelectedAbility(null);
        }, 1000);
      }
    } else {
      setTimeout(() => {
        setAnimation(null);
        setSelectedAction(null);
      }, 1000);
    }
  };

  const handleUseItem = (itemId: string) => {
    useItem(itemId);
    setLog(prev => [...prev, `You used a healing item!`]);
    setPlayerHealth(player.character.health);
  };

  if (!enemy) return null;

  return (
    <div 
      className="relative w-full h-full bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${state.currentLocation.background})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute w-2 h-2 rounded-full animate-ping ${
            particle.type === 'hit' ? 'bg-red-500' : 
            particle.type === 'gunshot' ? 'bg-yellow-400' : 'bg-purple-500'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDuration: '0.5s'
          }}
        />
      ))}
      
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className={`relative ${animation === 'enemy-hit' ? 'animate-shake' : animation === 'enemy-hit-special' ? 'animate-flash' : ''}`}>
          <div className="w-64 h-64 relative">
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg border-2 border-red-500/30">
              <img 
                src={enemy.sprite}
                alt={enemy.name}
                className="w-full h-full object-cover transform scale-110 filter contrast-125 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60"></div>
            </div>

            {/* Health bar */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-48">
              <div className="h-3 bg-black/90 rounded-full overflow-hidden border border-red-900/50">
                <div 
                  className="h-full bg-gradient-to-r from-red-900 to-red-500 transition-all duration-500"
                  style={{ width: `${(enemyHealth / enemy.maxHealth) * 100}%` }}
                ></div>
              </div>
              <div className="text-center text-red-400 text-sm mt-1 font-bold">
                {enemy.name}: {enemyHealth}/{enemy.maxHealth} HP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Battle log */}
      <div className="relative z-10 mx-auto w-3/4 max-w-2xl bg-black bg-opacity-90 rounded-t-lg p-4">
        <div className="h-24 overflow-y-auto">
          {log.map((entry, index) => (
            <p key={index} className="mb-1 text-gray-300 text-sm">{entry}</p>
          ))}
        </div>
      </div>
      
      {/* Player section */}
      <div className="relative z-10 h-52 bg-black bg-opacity-85">
        <div className="container mx-auto h-full flex">
          {/* Player info */}
          <div className="w-1/3 p-4 flex flex-col justify-center">
            <div className={`relative mb-4 ${animation === 'player-hit' ? 'animate-shake' : animation === 'player-defend' ? 'animate-pulse' : ''}`}>
              <div className="flex items-center mb-3">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full overflow-hidden border-3 border-yellow-400 mr-3 shadow-lg">
                  <img src={player.character.portrait} alt={player.character.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{player.character.name}</h3>
                  <p className="text-yellow-300 text-sm">Level {player.character.level}</p>
                  {comboCount > 0 && (
                    <p className="text-orange-400 text-xs font-bold">Combo x{comboCount + 1}</p>
                  )}
                </div>
              </div>
              
              {/* Health bar positioned in bottom right */}
              <div className="absolute bottom-4 right-4 w-32">
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-green-500/50">
                  <div 
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
                    style={{ width: `${(playerHealth / player.character.maxHealth) * 100}%` }}
                  ></div>
                </div>
                <div className="text-white text-xs mt-1 text-center font-bold">
                  {playerHealth}/{player.character.maxHealth} HP
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {player.inventory
                .filter(item => item.type === 'consumable' && item.effect?.type === 'heal')
                .slice(0, 3)
                .map(item => (
                  <button
                    key={item.id}
                    className="p-2 bg-green-700 hover:bg-green-600 rounded-md transition-colors shadow-lg"
                    onClick={() => handleUseItem(item.id)}
                    title={item.name}
                  >
                    <Heart size={16} className="text-white" />
                  </button>
                ))}
            </div>
          </div>
          
          {/* Battle actions */}
          <div className="w-2/3 p-4">
            {selectedAction === 'special' ? (
              <div>
                <h3 className="text-white text-lg font-bold mb-3 flex items-center">
                  <Zap className="mr-2 text-purple-400" />
                  Select Special Ability:
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {player.character.abilities
                    .filter(ability => ability.type === 'special')
                    .map(ability => (
                      <button
                        key={ability.id}
                        className="px-4 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-sm flex items-center justify-between transition-all duration-200 shadow-lg"
                        onClick={() => handleSelectAbility(ability.id)}
                        disabled={ability.currentCooldown > 0}
                      >
                        <span className="font-medium">{ability.name}</span>
                        {ability.currentCooldown > 0 && (
                          <span className="text-xs text-red-300 bg-red-900/50 px-2 py-1 rounded">{ability.currentCooldown} turns</span>
                        )}
                      </button>
                    ))}
                </div>
                <button 
                  className="mt-3 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                  onClick={() => setSelectedAction(null)}
                >
                  ← Back
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-white text-lg font-bold mb-3 flex items-center">
                  <Target className="mr-2 text-yellow-400" />
                  Combat Actions:
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    className="p-4 bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg flex flex-col items-center justify-center transition-all duration-200 shadow-lg transform hover:scale-105"
                    onClick={() => handleAction('attack')}
                  >
                    <Swords size={28} className="mb-2" />
                    <span className="font-bold">Fire Weapon</span>
                    <span className="text-xs opacity-75">Basic Attack</span>
                  </button>
                  <button
                    className="p-4 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg flex flex-col items-center justify-center transition-all duration-200 shadow-lg transform hover:scale-105"
                    onClick={() => handleAction('defend')}
                  >
                    <Shield size={28} className="mb-2" />
                    <span className="font-bold">Defend</span>
                    <span className="text-xs opacity-75">Reduce Damage</span>
                  </button>
                  <button
                    className="p-4 bg-gradient-to-b from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg flex flex-col items-center justify-center transition-all duration-200 shadow-lg transform hover:scale-105"
                    onClick={() => handleAction('special')}
                  >
                    <Zap size={28} className="mb-2" />
                    <span className="font-bold">Special</span>
                    <span className="text-xs opacity-75">Abilities</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;