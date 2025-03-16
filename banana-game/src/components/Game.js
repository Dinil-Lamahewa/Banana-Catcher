import React, { useState, useEffect } from 'react';
import './Game.css';
import { db, auth } from '../firebase';

function Game({ onGameOver }) {
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [bucketPosition, setBucketPosition] = useState(50);
  const [health, setHealth] = useState(3);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    if (!loading) {
      const randomNumbers = [
        solution,
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ].sort(() => Math.random() - 0.5);
      setNumbers(randomNumbers.map((num, idx) => ({
        value: num,
        position: 25 * idx + 10,
        top: 0,
      })));
    }
  }, [loading, solution]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNumbers((prev) =>
        prev.map((num) => ({
          ...num,
          top: num.top + 1,
        })).filter((num) => {
          if (num.top >= 90) {
            if (
              num.value === solution &&
              Math.abs(num.position - bucketPosition) < 10
            ) {
              setScore((prev) => prev + 10);
              fetchQuestion(); // New question
              return false;
            } else if (num.top > 100) {
              setHealth((prev) => {
                const newHealth = prev - 1;
                if (newHealth <= 0) onGameOver(score);
                return newHealth;
              });
              return false;
            }
          }
          return true;
        })
      );
    }, 1000 / 60); // 60 FPS
    return () => clearInterval(interval);
  }, [bucketPosition, solution, onGameOver, score]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && bucketPosition > 0) {
        setBucketPosition(bucketPosition - 10);
      } else if (e.key === 'ArrowRight' && bucketPosition < 90) {
        setBucketPosition(bucketPosition + 10);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [bucketPosition]);

  const fetchQuestion = async () => {
    if (score > 0) {
      await db.collection('scores').doc(auth.currentUser.uid).set({
        userId: auth.currentUser.uid,
        highestScore: score,
      }, { merge: true });
    }
    try {
      const response = await fetch('https://marcconrad.com/uob/banana/api.php?json');
      const data = await response.json();
      setQuestion(data.question);
      setSolution(data.solution);
      setNumbers([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching question:', error);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="game-container">
      <h2>Game</h2>
      <p>Question: {question}</p>
      <p>Health: {health} | Score: {score}</p>
      <div className="game-area">
        {numbers.map((num, idx) => (
          <div
            key={idx}
            className="falling-number"
            style={{ left: `${num.position}%`, top: `${num.top}%` }}
          >
            {num.value}
          </div>
        ))}
        <div
          className="bucket"
          style={{ left: `${bucketPosition}%` }}
        />
      </div>
    </div>
  );
}

export default Game;