import React, { useState } from "react";

// Character data
const CHARACTERS = [
  { name: "Ninja", img: "/ninja.jpg" },
  { name: "Knight", img: "/knight.png" }
];

export default function App() {
  const [selected, setSelected] = useState(0);

  return (
    <div
      style={{
        background: "#181818",
        color: "#fff",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <h1 style={{ marginBottom: "2rem" }}>Choose Your Character</h1>
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
            <img
              src={char.img}
              alt={char.name}
              style={{
                width: 128,
                height: 128,
                objectFit: "contain",
                display: "block",
                marginBottom: "1rem",
                borderRadius: "8px",
                background: "#111"
              }}
            />
            <div style={{ textAlign: "center", fontWeight: "bold" }}>
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
        onClick={() =>
          alert(`You selected: ${CHARACTERS[selected].name}`)
        }
      >
        Start Game
      </button>
    </div>
  );
}
