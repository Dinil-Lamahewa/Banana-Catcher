import React, { useState } from 'react';
import { auth } from '../firebase'; // No change here
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; // Add these imports

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password); // Updated syntax
        alert('Account created!');
      } else {
        await signInWithEmailAndPassword(auth, email, password); // Updated syntax
        alert('Logged in!');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
      </form>
      <button onClick={() => setIsSignup(!isSignup)}>
        Switch to {isSignup ? 'Login' : 'Sign Up'}
      </button>
    </div>
  );
}

export default Auth;