import React, { useState, useEffect, useCallback } from 'react';
import './Game.css';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function Game({ onGameOver }) {
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [bucketPosition, setBucketPosition] = useState(50);
  const [health, setHealth] = useState(3);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Memoize fetchQuestion with useCallback, only depending on score
  const fetchQuestion = useCallback(async () => {
    if (score > 0) {
      try {
        await setDoc(doc(db, 'scores', auth.currentUser.uid), {
          userId: auth.currentUser.uid,
          highestScore: score,
        }, { merge: true });
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
    try {
      const response = await fetch('https://marcconrad.com/uob/banana/api.php?json');
      const data = await response.json();
      setQuestion(data.question);
      setSolution(data.solution);
      setNumbers([]); // Reset numbers for new question
      setLoading(false);
    } catch (error) {
      console.error('Error fetching question:', error);
      setLoading(false);
    }
  }, [score]); // Only score is a dependency

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

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
              fetchQuestion();
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
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [bucketPosition, solution, onGameOver, score, fetchQuestion]);

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