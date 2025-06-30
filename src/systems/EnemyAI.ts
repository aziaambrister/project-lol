import { Enemy, Character } from '../types/game';

export interface Vector2D {
  x: number;
  y: number;
}

export interface AIState {
  current: 'idle' | 'pursuit' | 'attack' | 'retreat';
  lastStateChange: number;
  stateData: any;
}

export interface AttackCycle {
  lastAttackTime: number;
  cooldownDuration: number;
  isAttacking: boolean;
  attackRange: number;
}

export class EnemyAISystem {
  private enemies: Map<string, Enemy> = new Map();
  private aiStates: Map<string, AIState> = new Map();
  private attackCycles: Map<string, AttackCycle> = new Map();
  private lastUpdateTime = 0;
  private debugMode = false;
  private performanceMetrics = {
    updateTime: 0,
    pathfindingTime: 0,
    collisionChecks: 0
  };

  constructor() {
    this.initializeSystem();
  }

  private initializeSystem() {
    console.log('🤖 Enhanced Enemy AI System initialized');
  }

  public addEnemy(enemy: Enemy) {
    this.enemies.set(enemy.id, enemy);
    this.aiStates.set(enemy.id, {
      current: 'idle',
      lastStateChange: Date.now(),
      stateData: {}
    });
    this.attackCycles.set(enemy.id, {
      lastAttackTime: 0,
      cooldownDuration: 1200, // Faster attacks
      isAttacking: false,
      attackRange: 80
    });
    
    console.log(`🎯 Added enemy ${enemy.id} to AI system`);
  }

  public removeEnemy(enemyId: string) {
    this.enemies.delete(enemyId);
    this.aiStates.delete(enemyId);
    this.attackCycles.delete(enemyId);
    console.log(`🗑️ Removed enemy ${enemyId} from AI system`);
  }

  public updateEnemies(playerPosition: Vector2D, playerCharacter: Character, deltaTime: number): Enemy[] {
    const startTime = performance.now();
    this.performanceMetrics.collisionChecks = 0;

    const updatedEnemies: Enemy[] = [];

    for (const [enemyId, enemy] of this.enemies) {
      if (enemy.state === 'dead') {
        updatedEnemies.push(enemy);
        continue;
      }

      const aiState = this.aiStates.get(enemyId)!;
      const attackCycle = this.attackCycles.get(enemyId)!;

      // Calculate distance to player
      const distanceToPlayer = this.calculateDistance(enemy.position, playerPosition);
      
      // Update AI state machine
      this.updateAIStateMachine(enemy, aiState, playerPosition, distanceToPlayer);

      // Update enemy movement toward player
      this.updateEnemyMovement(enemy, aiState, playerPosition, deltaTime, distanceToPlayer);

      // Update attack behavior
      this.updateAttackBehavior(enemy, attackCycle, playerPosition, distanceToPlayer);

      // Ensure enemy stays within world bounds
      this.constrainToWorldBounds(enemy);

      updatedEnemies.push(enemy);
    }

    this.performanceMetrics.updateTime = performance.now() - startTime;
    this.lastUpdateTime = Date.now();

    return updatedEnemies;
  }

  private updateAIStateMachine(
    enemy: Enemy, 
    aiState: AIState, 
    playerPosition: Vector2D,
    distanceToPlayer: number
  ) {
    const currentTime = Date.now();
    const detectionRange = enemy.detectionRadius * 1.5; // Increased detection
    const attackRange = this.attackCycles.get(enemy.id)!.attackRange;

    switch (aiState.current) {
      case 'idle':
        // Start chasing when player is within detection range
        if (distanceToPlayer <= detectionRange) {
          this.changeState(aiState, 'pursuit', currentTime);
          if (this.debugMode) {
            console.log(`🎯 Enemy ${enemy.id} detected player at distance ${distanceToPlayer.toFixed(1)}`);
          }
        }
        break;

      case 'pursuit':
        // Switch to attack when close enough
        if (distanceToPlayer <= attackRange) {
          this.changeState(aiState, 'attack', currentTime);
          if (this.debugMode) {
            console.log(`⚔️ Enemy ${enemy.id} entering attack range`);
          }
        } 
        // Stop chasing if player gets too far away
        else if (distanceToPlayer > detectionRange * 2) {
          this.changeState(aiState, 'idle', currentTime);
          if (this.debugMode) {
            console.log(`😴 Enemy ${enemy.id} lost player, returning to idle`);
          }
        }
        break;

      case 'attack':
        // Continue attacking if in range, otherwise pursue
        if (distanceToPlayer > attackRange * 1.3) {
          this.changeState(aiState, 'pursuit', currentTime);
          if (this.debugMode) {
            console.log(`🏃 Enemy ${enemy.id} pursuing player again`);
          }
        }
        break;

      case 'retreat':
        // Return to pursuit if health recovers or player is far
        if (enemy.health > enemy.maxHealth * 0.3 || distanceToPlayer > detectionRange) {
          this.changeState(aiState, 'pursuit', currentTime);
        }
        break;
    }

    // Update enemy state property for visual feedback
    enemy.state = aiState.current === 'idle' ? 'patrol' : 
                  aiState.current === 'pursuit' || aiState.current === 'attack' ? 'chase' : 'patrol';
  }

  private updateEnemyMovement(
    enemy: Enemy, 
    aiState: AIState, 
    playerPosition: Vector2D, 
    deltaTime: number,
    distanceToPlayer: number
  ) {
    // Base movement speed (adjusted for frame rate)
    const baseSpeed = enemy.speed * (deltaTime / 16) * 1.2; // Increased speed
    let targetPosition = { ...enemy.position };

    switch (aiState.current) {
      case 'idle':
        // Patrol around spawn point
        targetPosition = this.calculatePatrolMovement(enemy);
        break;

      case 'pursuit':
        // Chase player aggressively
        targetPosition = this.calculateChaseMovement(enemy, playerPosition, baseSpeed * 1.8);
        break;

      case 'attack':
        // Move closer for attack, but slower to avoid overshooting
        if (distanceToPlayer > 50) {
          targetPosition = this.calculateChaseMovement(enemy, playerPosition, baseSpeed * 0.6);
        }
        break;

      case 'retreat':
        // Move away from player
        targetPosition = this.calculateRetreatMovement(enemy, playerPosition, baseSpeed);
        break;
    }

    // Apply smooth movement
    enemy.position = this.applySmoothMovement(enemy.position, targetPosition, baseSpeed);
  }

  private calculateChaseMovement(enemy: Enemy, playerPosition: Vector2D, speed: number): Vector2D {
    // Calculate direction vector from enemy to player
    const direction = {
      x: playerPosition.x - enemy.position.x,
      y: playerPosition.y - enemy.position.y
    };
    
    // Normalize the direction vector
    const distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (distance === 0) return enemy.position;
    
    const normalizedDirection = {
      x: direction.x / distance,
      y: direction.y / distance
    };
    
    // Calculate new position
    return {
      x: enemy.position.x + normalizedDirection.x * speed,
      y: enemy.position.y + normalizedDirection.y * speed
    };
  }

  private calculatePatrolMovement(enemy: Enemy): Vector2D {
    // Simple circular patrol around spawn point
    const time = Date.now() / 1000;
    const angle = time * 0.3; // Slow rotation
    const radius = enemy.patrolRadius * 0.2;
    
    return {
      x: enemy.patrolCenter.x + Math.cos(angle) * radius,
      y: enemy.patrolCenter.y + Math.sin(angle) * radius
    };
  }

  private calculateRetreatMovement(enemy: Enemy, playerPosition: Vector2D, speed: number): Vector2D {
    // Move away from player
    const direction = {
      x: enemy.position.x - playerPosition.x,
      y: enemy.position.y - playerPosition.y
    };
    
    const distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (distance === 0) return enemy.position;
    
    const normalizedDirection = {
      x: direction.x / distance,
      y: direction.y / distance
    };
    
    return {
      x: enemy.position.x + normalizedDirection.x * speed,
      y: enemy.position.y + normalizedDirection.y * speed
    };
  }

  private applySmoothMovement(currentPos: Vector2D, targetPos: Vector2D, maxSpeed: number): Vector2D {
    // Calculate movement vector
    const movement = {
      x: targetPos.x - currentPos.x,
      y: targetPos.y - currentPos.y
    };
    
    // Limit movement to max speed
    const distance = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
    if (distance > maxSpeed) {
      movement.x = (movement.x / distance) * maxSpeed;
      movement.y = (movement.y / distance) * maxSpeed;
    }
    
    return {
      x: currentPos.x + movement.x,
      y: currentPos.y + movement.y
    };
  }

  private updateAttackBehavior(
    enemy: Enemy, 
    attackCycle: AttackCycle, 
    playerPosition: Vector2D,
    distanceToPlayer: number
  ) {
    const currentTime = Date.now();

    // Attack if in range and cooldown is ready
    if (distanceToPlayer <= attackCycle.attackRange && 
        currentTime - attackCycle.lastAttackTime >= attackCycle.cooldownDuration) {
      
      attackCycle.lastAttackTime = currentTime;
      attackCycle.isAttacking = true;
      enemy.lastAction = currentTime;
      
      if (this.debugMode) {
        console.log(`💥 Enemy ${enemy.id} attacking! Distance: ${distanceToPlayer.toFixed(1)}`);
      }

      // Reset attack flag after animation
      setTimeout(() => {
        attackCycle.isAttacking = false;
      }, 300);
    }
  }

  private calculateDistance(pos1: Vector2D, pos2: Vector2D): number {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private constrainToWorldBounds(enemy: Enemy) {
    const worldBounds = { width: 4000, height: 4000 };
    
    enemy.position.x = Math.max(50, Math.min(worldBounds.width - 50, enemy.position.x));
    enemy.position.y = Math.max(50, Math.min(worldBounds.height - 50, enemy.position.y));
  }

  private changeState(aiState: AIState, newState: AIState['current'], currentTime: number) {
    if (aiState.current !== newState) {
      aiState.current = newState;
      aiState.lastStateChange = currentTime;
      aiState.stateData = {};
    }
  }

  public enableDebugMode(enabled: boolean) {
    this.debugMode = enabled;
    console.log(`🐛 AI Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  public getEnemyState(enemyId: string): AIState | undefined {
    return this.aiStates.get(enemyId);
  }

  public getAttackCycle(enemyId: string): AttackCycle | undefined {
    return this.attackCycles.get(enemyId);
  }

  public getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }
}