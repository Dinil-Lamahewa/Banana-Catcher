import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import Auth from './components/Auth';
import Menu from './components/Menu';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('menu');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="App">
      {user ? (
        screen === 'menu' ? (
          <Menu
            onPlay={() => setScreen('game')}
            onScores={() => setScreen('scores')}
          />
        ) : screen === 'game' ? (
          <h1>Game Screen (To Be Built)</h1>
        ) : (
          <h1>Scores Screen (To Be Built)</h1>
        )
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;