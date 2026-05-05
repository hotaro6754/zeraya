import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Settings, ChevronRight, Car, CalendarDays, Brain, BookOpen, Heart, LogOut, Star, Award, Shield, Moon, Sun } from 'lucide-react'
import { useTheme } from '../App'

const stats = [
  { label: 'Rides', value: '47', icon: Car },
  { label: 'Events', value: '12', icon: CalendarDays },
  { label: 'Trips', value: '3', icon: Brain },
  { label: 'Saved', value: '₹2.4k', icon: Star },
]

export default function Profile() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const menu = [
    { icon: theme === 'dark' ? Sun : Moon, label: 'Appearance', sub: theme === 'dark' ? 'Dark Mode' : 'Light Mode', action: toggleTheme },
    { icon: BookOpen, label: 'Smart Book', sub: '23 receipts saved', path: '/smart-book' },
    { icon: Brain, label: 'AI Travel Plans', sub: '3 itineraries', path: '/ai-planner' },
    { icon: Heart, label: 'Saved Places', sub: '8 locations' },
    { icon: Award, label: 'Achievements', sub: '5 badges earned' },
    { icon: Shield, label: 'Privacy & Safety', sub: 'Manage your data' },
    { icon: Settings, label: 'Settings', sub: 'Account, notifications' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ paddingTop: 24 }}>
      {/* Profile Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div className="avatar" style={{
          width: 80, height: 80, fontSize: 32,
          margin: '0 auto 16px',
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-md)',
        }}>P</div>
        <h1 className="h2">Pooja Choudhary</h1>
        <p className="body-sm" style={{ marginTop: 4 }}>Maharani College, Jaipur</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          <span className="badge badge-neutral" style={{ padding: '4px 10px' }}>Founder @Zeraya</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32,
      }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            style={{
              textAlign: 'center', padding: '16px 8px',
              backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <s.icon size={18} color="var(--text-secondary)" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{s.value}</div>
            <div className="caption" style={{ marginTop: 2 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Menu */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        {menu.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => {
              if (m.action) m.action()
              else if (m.path) navigate(m.path)
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px',
              borderBottom: i < menu.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-background)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--border-subtle)'
            }}>
              <m.icon size={18} color="var(--text-secondary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{m.label}</div>
              <div className="caption">{m.sub}</div>
            </div>
            <ChevronRight size={16} color="var(--text-tertiary)" />
          </motion.div>
        ))}
      </div>

      <button className="btn btn-ghost btn-full" style={{ marginTop: 24, color: 'var(--error)', gap: 8 }}>
        <LogOut size={16} /> Sign Out
      </button>
    </motion.div>
  )
}
