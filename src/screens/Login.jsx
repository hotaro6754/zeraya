import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../hooks/useFirebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Login() {
  const navigate = useNavigate();
  const { auth, db } = useFirebase();
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If user is new, create a new document in Firestore
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          onboardingComplete: false, // <-- set onboarding to false for new users
        });
      }

      navigate('/home');
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <div className="page centered">
      <h1 className="h1">Login</h1>
      <p className="body-lg" style={{ textAlign: 'center', maxWidth: 300, margin: '16px 0' }}>
        Welcome back! Please login to continue.
      </p>
      <button className="btn btn-primary" onClick={handleLogin}>
        Login with Google
      </button>
    </div>
  );
}
