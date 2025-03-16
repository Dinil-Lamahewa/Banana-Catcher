import React from 'react';

function Menu({ onPlay, onScores }) {
  return (
    <div>
      <h2>Menu</h2>
      <button onClick={onPlay}>Play</button>
      <button onClick={onScores}>Scores</button>
    </div>
  );
}

export default Menu;