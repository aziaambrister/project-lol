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
  private spatialGrid: Map<string, string[]> = new Map();
  private gridSize = 200;
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
    console.log('🤖 Enemy AI System initialized');
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
      cooldownDuration: 1500, // Reduced from 2000ms to 1500ms for more aggressive combat
      isAttacking: false,
      attackRange: 60 // Increased from 50 to 60 for better attack range
    });
    this.updateSpatialGrid(enemy);
  }

  public removeEnemy(enemyId: string) {
    this.enemies.delete(enemyId);
    this.aiStates.delete(enemyId);
    this.attackCycles.delete(enemyId);
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

      // FIXED: Always keep enemies active and moving toward player
      const distanceToPlayer = this.calculateDistance(enemy.position, playerPosition);
      
      // FIXED: Increased active distance and always update AI
      const maxActiveDistance = 1200; // Increased from 800
      
      // Always update AI state machine for better enemy behavior
      this.updateAIStateMachine(enemy, aiState, playerPosition, playerCharacter, deltaTime);

      // FIXED: Always update movement - enemies should always move toward player
      this.updateEnemyMovement(enemy, aiState, playerPosition, deltaTime);

      // FIXED: Update attack behavior with better range
      if (distanceToPlayer <= 200) { // Increased from 150 to 200
        this.updateAttackBehavior(enemy, attackCycle, playerPosition, deltaTime);
      }

      // Ensure enemy stays within world bounds
      this.constrainToWorldBounds(enemy);

      // Update spatial grid
      this.updateSpatialGrid(enemy);

      updatedEnemies.push(enemy);
    }

    this.performanceMetrics.updateTime = performance.now() - startTime;
    this.lastUpdateTime = Date.now();

    if (this.debugMode) {
      this.logPerformanceMetrics();
    }

    return updatedEnemies;
  }

  private updateAIStateMachine(
    enemy: Enemy, 
    aiState: AIState, 
    playerPosition: Vector2D, 
    playerCharacter: Character,
    deltaTime: number
  ) {
    const distanceToPlayer = this.calculateDistance(enemy.position, playerPosition);
    const currentTime = Date.now();

    // FIXED: More aggressive AI - always pursue player when in range
    switch (aiState.current) {
      case 'idle':
        // FIXED: Larger detection radius and always pursue
        if (distanceToPlayer <= enemy.detectionRadius * 1.5) { // Increased detection
          this.changeState(aiState, 'pursuit', currentTime);
          if (this.debugMode) console.log(`🎯 Enemy ${enemy.id} detected player - switching to pursuit`);
        }
        break;

      case 'pursuit':
        if (distanceToPlayer <= this.attackCycles.get(enemy.id)!.attackRange) {
          this.changeState(aiState, 'attack', currentTime);
          if (this.debugMode) console.log(`⚔️ Enemy ${enemy.id} in attack range`);
        } else if (distanceToPlayer > enemy.detectionRadius * 2) { // Increased pursuit range
          this.changeState(aiState, 'idle', currentTime);
          if (this.debugMode) console.log(`😴 Enemy ${enemy.id} lost player - returning to idle`);
        }
        break;

      case 'attack':
        if (distanceToPlayer > this.attackCycles.get(enemy.id)!.attackRange * 1.3) {
          this.changeState(aiState, 'pursuit', currentTime);
        }
        break;

      case 'retreat':
        // FIXED: Less retreating, more aggressive
        if (enemy.health > enemy.maxHealth * 0.3) { // Reduced retreat threshold
          this.changeState(aiState, 'pursuit', currentTime);
        } else if (distanceToPlayer > enemy.detectionRadius * 2) {
          this.changeState(aiState, 'idle', currentTime);
        }
        break;
    }

    // Update enemy state property
    enemy.state = aiState.current === 'idle' ? 'patrol' : 
                  aiState.current === 'pursuit' || aiState.current === 'attack' ? 'chase' : 'patrol';
  }

  private updateEnemyMovement(enemy: Enemy, aiState: AIState, playerPosition: Vector2D, deltaTime: number) {
    const moveSpeed = enemy.speed * (deltaTime / 16) * 1.5; // FIXED: Increased speed multiplier
    let targetPosition = enemy.position;

    switch (aiState.current) {
      case 'idle':
        // FIXED: Move toward player even when idle if close enough
        const idleDistance = this.calculateDistance(enemy.position, playerPosition);
        if (idleDistance <= enemy.detectionRadius) {
          targetPosition = this.calculatePursuitMovement(enemy, playerPosition, moveSpeed);
        } else {
          targetPosition = this.calculatePatrolMovement(enemy, deltaTime);
        }
        break;

      case 'pursuit':
      case 'attack':
        // FIXED: Always move toward player aggressively
        targetPosition = this.calculatePursuitMovement(enemy, playerPosition, moveSpeed * 1.2); // Extra speed boost
        break;

      case 'retreat':
        // Move away from player
        targetPosition = this.calculateRetreatMovement(enemy, playerPosition, moveSpeed);
        break;
    }

    // Apply collision detection and movement
    const newPosition = this.applyCollisionDetection(enemy, targetPosition);
    enemy.position = newPosition;
  }

  private updateAttackBehavior(enemy: Enemy, attackCycle: AttackCycle, playerPosition: Vector2D, deltaTime: number) {
    const currentTime = Date.now();
    const distanceToPlayer = this.calculateDistance(enemy.position, playerPosition);

    // FIXED: More frequent attacks with better range
    if (distanceToPlayer <= attackCycle.attackRange && 
        currentTime - attackCycle.lastAttackTime >= attackCycle.cooldownDuration) {
      
      attackCycle.lastAttackTime = currentTime;
      attackCycle.isAttacking = true;
      
      // Trigger attack event
      enemy.lastAction = currentTime;
      
      if (this.debugMode) {
        console.log(`💥 Enemy ${enemy.id} attacking player! Distance: ${distanceToPlayer.toFixed(2)}`);
      }

      // Reset attack flag after animation duration
      setTimeout(() => {
        attackCycle.isAttacking = false;
      }, 400); // Reduced from 500ms to 400ms for faster attacks
    }
  }

  private calculateDistance(pos1: Vector2D, pos2: Vector2D): number {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private normalizeVector(vector: Vector2D): Vector2D {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (length === 0) return { x: 0, y: 0 };
    return { x: vector.x / length, y: vector.y / length };
  }

  private calculatePursuitMovement(enemy: Enemy, playerPosition: Vector2D, moveSpeed: number): Vector2D {
    const direction = {
      x: playerPosition.x - enemy.position.x,
      y: playerPosition.y - enemy.position.y
    };
    
    const normalizedDirection = this.normalizeVector(direction);
    
    // FIXED: More aggressive pursuit with better speed
    return {
      x: enemy.position.x + normalizedDirection.x * moveSpeed * 1.5, // Increased multiplier
      y: enemy.position.y + normalizedDirection.y * moveSpeed * 1.5
    };
  }

  private calculateRetreatMovement(enemy: Enemy, playerPosition: Vector2D, moveSpeed: number): Vector2D {
    const direction = {
      x: enemy.position.x - playerPosition.x, // Opposite direction
      y: enemy.position.y - playerPosition.y
    };
    
    const normalizedDirection = this.normalizeVector(direction);
    
    return {
      x: enemy.position.x + normalizedDirection.x * moveSpeed,
      y: enemy.position.y + normalizedDirection.y * moveSpeed
    };
  }

  private calculatePatrolMovement(enemy: Enemy, deltaTime: number): Vector2D {
    // FIXED: Smaller patrol radius to keep enemies closer to action
    const angle = (Date.now() / 1000) * 0.3; // Slower rotation
    const patrolRadius = enemy.patrolRadius * 0.2; // Reduced from 0.3 to 0.2
    
    return {
      x: enemy.patrolCenter.x + Math.cos(angle) * patrolRadius,
      y: enemy.patrolCenter.y + Math.sin(angle) * patrolRadius
    };
  }

  private hasLineOfSight(from: Vector2D, to: Vector2D): boolean {
    // FIXED: Always return true for better enemy behavior
    return true; // Simplified - enemies can always see player
  }

  private applyCollisionDetection(enemy: Enemy, targetPosition: Vector2D): Vector2D {
    this.performanceMetrics.collisionChecks++;
    
    // World boundaries
    const worldBounds = { width: 4000, height: 4000 };
    
    const clampedPosition = {
      x: Math.max(50, Math.min(worldBounds.width - 50, targetPosition.x)),
      y: Math.max(50, Math.min(worldBounds.height - 50, targetPosition.y))
    };

    return clampedPosition;
  }

  private constrainToWorldBounds(enemy: Enemy) {
    const worldBounds = { width: 4000, height: 4000 };
    
    // Ensure enemy stays within world bounds
    enemy.position.x = Math.max(50, Math.min(worldBounds.width - 50, enemy.position.x));
    enemy.position.y = Math.max(50, Math.min(worldBounds.height - 50, enemy.position.y));
  }

  private updateSpatialGrid(enemy: Enemy) {
    const gridX = Math.floor(enemy.position.x / this.gridSize);
    const gridY = Math.floor(enemy.position.y / this.gridSize);
    const gridKey = `${gridX},${gridY}`;
    
    if (!this.spatialGrid.has(gridKey)) {
      this.spatialGrid.set(gridKey, []);
    }
    
    // Remove enemy from old grid cells and add to new one
    for (const [key, enemies] of this.spatialGrid) {
      const index = enemies.indexOf(enemy.id);
      if (index > -1) {
        enemies.splice(index, 1);
      }
    }
    
    this.spatialGrid.get(gridKey)!.push(enemy.id);
  }

  private changeState(aiState: AIState, newState: AIState['current'], currentTime: number) {
    aiState.current = newState;
    aiState.lastStateChange = currentTime;
    aiState.stateData = {};
  }

  private logPerformanceMetrics() {
    if (Date.now() - this.lastUpdateTime > 1000) { // Log every second
      console.log('🔧 AI Performance Metrics:', {
        updateTime: `${this.performanceMetrics.updateTime.toFixed(2)}ms`,
        collisionChecks: this.performanceMetrics.collisionChecks,
        activeEnemies: this.enemies.size
      });
    }
  }

  public enableDebugMode(enabled: boolean) {
    this.debugMode = enabled;
    console.log(`🐛 Debug mode ${enabled ? 'enabled' : 'disabled'}`);
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