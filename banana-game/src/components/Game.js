import React, { useState, useEffect } from 'react';

function Game() {
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const response = await fetch('https://marcconrad.com/uob/banana/api.php?json');
      const data = await response.json();
      setQuestion(data.question);
      setSolution(data.solution);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching question:', error);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Game</h2>
      <p>Question: {question}</p>
      <p>Solution: {solution}</p>
    </div>
  );
}

export default Game;