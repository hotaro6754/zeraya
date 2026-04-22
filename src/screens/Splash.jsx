import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/welcome'), 1800)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-background)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient Violet Orb Glow */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(7,6,26,0) 70%)',
          borderRadius: '50%', zIndex: 0, pointerEvents: 'none'
        }} 
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', zIndex: 1 }}
      >
        <h1
          className="hero"
          style={{
            fontSize: 48,
            background: 'var(--grad)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}
        >
          Zeraya
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{
            marginTop: 12,
            color: 'var(--text-tertiary)',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.05em'
          }}
        >
          STUDENT LIFE OS
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
