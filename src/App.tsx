import React, { useState } from 'react';

// --- SVG Character Components ---
function NinjaSVG() {
  return (
    <svg width="100" height="100" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="50" fill="#222" stroke="#444" strokeWidth="6" />
      <ellipse cx="45" cy="65" rx="8" ry="5" fill="#fff" />
      <ellipse cx="75" cy="65" rx="8" ry="5" fill="#fff" />
      <rect x="25" y="80" width="70" height="20" rx="10" fill="#007" />
      <rect x="30" y="35" width="60" height="15" rx="7" fill="#0af" />
    </svg>
  );
}

function KnightSVG() {
  return (
    <svg width="100" height="100" viewBox="0 0 120 120">
      <ellipse cx="60" cy="60" rx="45" ry="50" fill="#ccc" stroke="#888" strokeWidth="6" />
      <rect x="40" y="55" width="40" height="20" rx="8" fill="#888" />
      <rect x="55" y="20" width="10" height="25" rx="5" fill="#d21" />
    </svg>
  );
}

// --- Character Select Component ---
const CHARACTERS = [
  { name: "Ninja", svg: <NinjaSVG /> },
  { name: "Knight", svg: <KnightSVG /> }
];

function CharacterSelect({ onSelectComplete, setSelectedCharacter }: { onSelectComplete: () => void, setSelectedCharacter: (idx: number) => void }) {
  const [selected, setSelected] = useState(0);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#181818",
      color: "#fff"
    }}>
      <h2 style={{ marginBottom: "2rem", fontSize: "2rem", fontWeight: "bold" }}>Select Your Character</h2>
      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
        {CHARACTERS.map((char, i) => (
          <div
            key={char.name}
            style={{
              border: selected === i ? "4px solid gold" : "2px solid #444",
              borderRadius: "12px",
              padding: "1rem",
              cursor: "pointer",
              background: selected === i ? "#333" : "#222",
              transition: "border 0.2s"
            }}
            onClick={() => setSelected(i)}
          >
            {char.svg}
            <div style={{ textAlign: "center", fontWeight: "bold", marginTop: "1rem" }}>
              {char.name}
            </div>
          </div>
        ))}
      </div>
      <button
        style={{
          padding: "0.75rem 2rem",
          fontSize: "1.15rem",
          borderRadius: "8px",
          border: "none",
          background: "gold",
          color: "#222",
          fontWeight: "bold",
          cursor: "pointer"
        }}
        onClick={() => {
          setSelectedCharacter(selected);
          onSelectComplete();
        }}
      >
        Start Game
      </button>
    </div>
  );
}

// --- Welcome and Start Screens ---
function WelcomePage({ onEnter }: { onEnter: () => void }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#222",
      color: "#fff"
    }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Welcome to SVG Fighter's Realm!</h1>
      <button
        style={{
          padding: "1rem 2.5rem",
          fontSize: "1.25rem",
          borderRadius: "8px",
          background: "gold",
          color: "#222",
          fontWeight: "bold",
          border: "none",
          cursor: "pointer"
        }}
        onClick={onEnter}
      >
        Enter
      </button>
    </div>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#111",
      color: "#fff"
    }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Get Ready!</h2>
      <button
        style={{
          padding: "1rem 2.5rem",
          fontSize: "1.25rem",
          borderRadius: "8px",
          background: "gold",
          color: "#222",
          fontWeight: "bold",
          border: "none",
          cursor: "pointer"
        }}
        onClick={onStart}
      >
        Start
      </button>
    </div>
  );
}

// --- Game World Screen ---
function GameWorld({ selectedCharacter }: { selectedCharacter: number }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#222",
      color: "#fff"
    }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Game World</h2>
      <div>
        {CHARACTERS[selectedCharacter].svg}
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem", marginTop: "1rem" }}>
          {CHARACTERS[selectedCharacter].name}
        </div>
      </div>
    </div>
  );
}

// --- Main App ---
function App() {
  const [gameState, setGameState] = useState<'welcome' | 'start' | 'character-select' | 'playing'>('welcome');
  const [selectedCharacter, setSelectedCharacter] = useState(0);

  const handleEnterGame = () => setGameState('start');
  const handleStartGame = () => setGameState('character-select');
  const handleCharacterSelected = () => setGameState('playing');

  return (
    <div>
      {gameState === 'welcome' && <WelcomePage onEnter={handleEnterGame} />}
      {gameState === 'start' && <StartScreen onStart={handleStartGame} />}
      {gameState === 'character-select' && (
        <CharacterSelect
          onSelectComplete={handleCharacterSelected}
          setSelectedCharacter={setSelectedCharacter}
        />
      )}
      {gameState === 'playing' && (
        <GameWorld selectedCharacter={selectedCharacter} />
      )}
    </div>
  );
}

export default App;
