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

  const bucketWidth = 5;
  const bucketHeight = 95;

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
      setNumbers([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching question:', error);
      setLoading(false);
    }
  }, [score]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  useEffect(() => {
    if (!loading && solution !== null) {
      // Function to generate unique random numbers
      const generateUniqueNumbers = (exclude, count, min, max) => {
        const uniqueNumbers = new Set([exclude]); // Start with solution
        while (uniqueNumbers.size < count) {
          const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
          uniqueNumbers.add(randomNum);
        }
        return Array.from(uniqueNumbers);
      };

      const randomNumbers = generateUniqueNumbers(solution, 4, 0, 9); // 4 unique numbers including solution
      const shuffledNumbers = randomNumbers.sort(() => Math.random() - 0.5); // Shuffle them
      setNumbers(shuffledNumbers.map((num, idx) => ({
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
          if (num.top >= bucketHeight && num.top <= bucketHeight + 1) {
            const bucketLeft = bucketPosition;
            const bucketRight = bucketPosition + bucketWidth;
            if (
              num.value === solution &&
              num.position >= bucketLeft && num.position <= bucketRight
            ) {
              setScore((prev) => prev + 10);
              fetchQuestion();
              return false;
            }
          } else if (num.top > 100) {
            setHealth((prev) => prev - 1);
            return false;
          }
          return true;
        })
      );
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [bucketPosition, solution, score, fetchQuestion, bucketWidth, bucketHeight]);

  useEffect(() => {
    if (health <= 0) {
      onGameOver(score);
    }
  }, [health, score, onGameOver]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && bucketPosition > 0) {
        setBucketPosition(bucketPosition - 1);
      } else if (e.key === 'ArrowRight' && bucketPosition < 90) {
        setBucketPosition(bucketPosition + 1);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [bucketPosition]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="game-container">
      <h2>Game</h2>
      <img src= {question} alt="Quteion.img"/>
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