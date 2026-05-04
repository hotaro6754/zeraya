import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../hooks/useFirebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { googleProvider } from '../lib/firebase';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import googleIcon from '../assets/google-icon.svg';

export default function Login() {
  const navigate = useNavigate();
  const { auth, db } = useFirebase();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
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
          onboardingComplete: false,
        });
      }

      // onboardingComplete is checked in OnboardingRoute
      navigate('/home');
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <div className="page" style={{ justifyContent: 'center', padding: '0 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', textAlign: 'center' }}
      >
        <div style={{ marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)'
          }}>
            <Lock color="white" size={32} />
          </div>
          <h1 className="hero" style={{ fontSize: 32, marginBottom: 8 }}>Welcome Back</h1>
          <p className="caption">Secure access to your Student Life OS</p>
        </div>

        <button
          onClick={handleLogin}
          className="btn-secondary"
          style={{
            width: '100%',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <img src={googleIcon} alt="Google icon" style={{ marginRight: 12, width: 20, height: 20 }} />
          Sign In with Google
          <ArrowRight size={20} style={{ marginLeft: 'auto' }} />
        </button>
      </motion.div>
    </div>
  );
}
