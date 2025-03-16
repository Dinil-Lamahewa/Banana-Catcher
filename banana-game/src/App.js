import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import Auth from './components/Auth';
import Menu from './components/Menu';
import Game from './components/Game';
import Scores from './components/Scores';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('menu');
  const [finalScore, setFinalScore] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleGameOver = (score) => {
    setFinalScore(score);
    setScreen('scores');
  };

  return (
    <div className="App">
      {user ? (
        screen === 'menu' ? (
          <Menu
            onPlay={() => setScreen('game')}
            onScores={() => setScreen('scores')}
          />
        ) : screen === 'game' ? (
          <Game onGameOver={handleGameOver} />
        ) : (
          <Scores />
        )
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;