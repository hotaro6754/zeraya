
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { Lock, Mail, ArrowRight } from 'lucide-react';

// Import the Google icon
import googleIcon from '../assets/google-icon.svg';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/interests');
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
      console.error('Firebase Auth Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/interests');
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Google Sign-In Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ justifyContent: 'center', padding: '0 24px' }}>
      <motion.div
        key="login"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{ width: '100%' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
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

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: '0 16px', display: 'flex', alignItems: 'center', background: 'var(--bg-s2)' }}>
            <Mail size={20} color="var(--text-secondary)" style={{ marginRight: 12 }} />
            <input
              type="email"
              placeholder="University Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1, padding: '16px 0', border: 'none', background: 'none',
                color: 'var(--text-primary)', outline: 'none', fontSize: 16
              }}
              required
            />
          </div>

          <div className="card" style={{ padding: '0 16px', display: 'flex', alignItems: 'center', background: 'var(--bg-s2)' }}>
            <Lock size={20} color="var(--text-secondary)" style={{ marginRight: 12 }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                flex: 1, padding: '16px 0', border: 'none', background: 'none',
                color: 'var(--text-primary)', outline: 'none', fontSize: 16
              }}
              required
            />
          </div>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: 8, height: 56 }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight size={20} style={{ marginLeft: 8 }} />}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="btn-secondary"
            disabled={loading}
            style={{ marginTop: 8, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img src={googleIcon} alt="Google icon" style={{ marginRight: 12, width: 20, height: 20 }} />
            Sign In with Google
          </button>
        </form>
      </motion.div>
    </div>
  );
}
