import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, CalendarDays, Compass, Brain, BookOpen } from 'lucide-react'

const features = [
  { icon: Car, label: 'Compare rides' },
  { icon: CalendarDays, label: 'Discover events' },
  { icon: Compass, label: 'Explore campus' },
  { icon: Brain, label: 'AI travel plans' },
  { icon: BookOpen, label: 'Receipt vault' },
]

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-no-nav"
      style={{ justifyContent: 'space-between', paddingTop: 60, paddingBottom: 40 }}
    >
      <div style={{
        position: 'absolute', top: -50, right: -50, width: 250, height: 250,
        background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(7,6,26,0) 70%)',
        borderRadius: '50%', zIndex: 0, pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="overline" style={{ marginBottom: 12 }}>WELCOME TO ZERAYA</p>
          <h1 className="hero" style={{ fontSize: 42, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            College life,<br />
            finally in one<br />
            place.
          </h1>
        </motion.div>

        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="body-lg"
          style={{ marginTop: 16, maxWidth: 300 }}
        >
          Rides, events, friends, travel plans, and receipts — zero chaos.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 32 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <f.icon size={14} color="var(--text-secondary)" />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{f.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={() => navigate('/interests')}
          style={{ gap: 10 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)' }}>
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </motion.div>
  )
}
