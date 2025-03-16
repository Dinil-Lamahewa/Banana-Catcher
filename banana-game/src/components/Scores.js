import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore'; // Import modular Firestore functions

function Scores() {
  const [highestScore, setHighestScore] = useState(0);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const docRef = doc(db, 'scores', auth.currentUser.uid); // Reference to the document
        const docSnap = await getDoc(docRef); // Get the document
        if (docSnap.exists()) {
          setHighestScore(docSnap.data().highestScore);
        }
      } catch (error) {
        console.error('Error fetching score:', error);
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