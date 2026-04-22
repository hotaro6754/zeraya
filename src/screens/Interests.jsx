import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Laptop, Music, Trophy, Palette, Pizza, Plane, Book, Dumbbell, Film, Gamepad2, Camera, Code, Mic, Rocket, Shirt, Check } from 'lucide-react'

const ALL_INTERESTS = [
  { id: 'tech', label: 'Technology', icon: Laptop },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'sports', label: 'Sports', icon: Trophy },
  { id: 'art', label: 'Design', icon: Palette },
  { id: 'food', label: 'Food', icon: Pizza },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'books', label: 'Books', icon: Book },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'photo', label: 'Photography', icon: Camera },
  { id: 'coding', label: 'Coding', icon: Code },
  { id: 'dance', label: 'Dance', icon: Mic },
  { id: 'startups', label: 'Startups', icon: Rocket },
  { id: 'fashion', label: 'Fashion', icon: Shirt },
]

export default function Interests() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])

  const toggle = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const isValid = selected.length >= 3

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-no-nav" style={{ paddingTop: 40 }}>
      <div style={{ marginBottom: 32 }}>
        <p className="overline" style={{ marginBottom: 8, color: 'var(--accent-secondary)' }}>STEP 1 OF 2</p>
        <h1 className="h1" style={{ marginBottom: 8 }}>What are you into?</h1>
        <p className="body-lg">Pick at least 3. This tailors your feed.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        flex: 1,
        alignContent: 'start'
      }}>
        {ALL_INTERESTS.map((int, i) => {
          const isSelected = selected.includes(int.id)
          return (
            <motion.div
              key={int.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => toggle(int.id)}
              className="card-interactive"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '16px 8px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-surface)',
                border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                color: isSelected ? 'var(--text-inverse)' : 'var(--text-secondary)',
                transition: 'all 0.2s var(--transition-spring)'
              }}
            >
              <int.icon size={24} color={isSelected ? 'var(--text-inverse)' : 'var(--text-primary)'} />
              <span style={{ fontSize: 13, fontWeight: 500, textAlign: 'center' }}>{int.label}</span>
              
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 16, height: 16, borderRadius: '50%',
                  backgroundColor: 'var(--bg-background)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <Check size={10} color="var(--accent-primary)" />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ marginTop: 24, paddingTop: 16 }}
      >
        <button
          className={`btn btn-full btn-lg ${isValid ? 'btn-primary' : 'btn-secondary'}`}
          disabled={!isValid}
          onClick={() => navigate('/location')}
          style={{ 
            opacity: isValid ? 1 : 0.5, 
            cursor: isValid ? 'pointer' : 'not-allowed'
          }}
        >
          {isValid ? 'Continue' : `Select ${3 - selected.length} more`}
        </button>
      </motion.div>
    </motion.div>
  )
}
