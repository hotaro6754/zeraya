import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('login') // 'login', 'otp'
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // For demo purposes, we'll simulate the 2FA flow
    // In a real Supabase setup, you'd use supabase.auth.signInWithPassword()
    // and then handle the MFA challenge if enabled.
    
    setTimeout(() => {
      setStep('otp')
      setLoading(false)
    }, 1500)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate verification
    setTimeout(() => {
      navigate('/interests')
      setLoading(false)
    }, 1500)
  }

  const handleOtpChange = (e, index) => {
    const value = e.target.value
    if (value.length > 1) return
    
    setOtp(prev => {
      const newOtp = prev.split('')
      newOtp[index] = value
      return newOtp.join('')
    })

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus()
    }
  }

  return (
    <div className="page" style={{ justifyContent: 'center', padding: '0 24px' }}>
      <AnimatePresence mode="wait">
        {step === 'login' ? (
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

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                style={{ marginTop: 8, height: 56 }}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ArrowRight size={20} style={{ marginLeft: 8 }} />}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ width: '100%' }}
          >
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ 
                width: 64, height: 64, borderRadius: 20, 
                background: 'var(--accent-secondary)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 24px rgba(96, 165, 250, 0.3)'
              }}>
                <ShieldCheck color="white" size={32} />
              </div>
              <h1 className="hero" style={{ fontSize: 32, marginBottom: 8 }}>2-Step Verification</h1>
              <p className="caption">Enter the code sent to your email</p>
            </div>

            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength="1"
                    onChange={(e) => handleOtpChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    style={{
                      width: 48, height: 60, borderRadius: 12,
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-s2)',
                      textAlign: 'center', fontSize: 24, fontWeight: 700,
                      color: 'var(--accent-secondary)', outline: 'none'
                    }}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                style={{ height: 56, background: 'var(--accent-secondary)' }}
              >
                {loading ? 'Verifying...' : 'Complete Secure Login'}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep('login')}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14 }}
              >
                Back to Sign In
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
