import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';

function Scores() {
  const [highestScore, setHighestScore] = useState(0);

  useEffect(() => {
    const fetchScore = async () => {
      const doc = await db.collection('scores').doc(auth.currentUser.uid).get();
      if (doc.exists) {
        setHighestScore(doc.data().highestScore);
      }
    };
    fetchScore();
  }, []);

  return (
    <div>
      <h2>Scores</h2>
      <p>Your Highest Score: {highestScore}</p>
    </div>
  );
}

export default Scores;