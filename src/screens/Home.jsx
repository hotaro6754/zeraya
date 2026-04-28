import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Bell, Car, CalendarDays, Compass, Brain, BookOpen, Users, ChevronRight, TrendingUp, Zap, Sparkles } from 'lucide-react'

const quickActions = [
  { icon: Car, label: 'Rides', path: '/ride-search' },
  { icon: CalendarDays, label: 'Events', path: '/events' },
  { icon: Compass, label: 'Explore', path: '/discover' },
  { icon: Brain, label: 'AI Plan', path: '/ai-planner' },
  { icon: BookOpen, label: 'Vault', path: '/smart-book' },
  { icon: Users, label: 'Social', path: '/social' },
]

const trendingEvents = [
  { id: 1, title: 'TEDx Maharani College', date: 'Apr 28', attendees: 234, tag: 'Popular' },
  { id: 2, title: 'Startup Weekend', date: 'May 3', attendees: 189, tag: 'New' },
  { id: 3, title: 'Cultural Night 2026', date: 'May 10', attendees: 456, tag: 'Hot' },
]

const recentRides = [
  { from: 'Maharani College', to: 'C-Scheme', best: 'Rapido', price: '₹45', time: '12 min' },
  { from: 'Tonk Road', to: 'Mansarovar', best: 'Ola Auto', price: '₹62', time: '18 min' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="page"
      style={{ paddingTop: 16, position: 'relative' }}
    >
      {/* Ambient Violet Glow */}
      <div style={{
        position: 'absolute', top: -100, right: -50, width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(7,6,26,0) 70%)',
        borderRadius: '50%', zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="body-sm" style={{ color: 'var(--text-tertiary)' }}>Good evening,</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h1 className="hero" style={{ marginTop: 2 }}>Pooja ✦</h1>
          </div>
        </motion.div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Bell size={18} color="var(--text-secondary)" />
          </div>
          <div className="avatar" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>P</div>
        </div>
      </div>

      {/* Search Bar */}
      <div
        onClick={() => navigate('/ride-search')}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px', backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)', cursor: 'pointer', marginBottom: 28,
          boxShadow: 'var(--shadow-sm)', transition: 'border-color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'}
        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
      >
        <Search size={18} color="var(--text-tertiary)" />
        <span style={{ fontSize: 15, color: 'var(--text-tertiary)' }}>Where to?</span>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
        {quickActions.map((a, i) => (
          <motion.div
            key={a.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(a.path)}
            className="card card-interactive"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              padding: '16px 8px', borderRadius: 'var(--radius-lg)',
            }}
          >
            <a.icon size={22} color="var(--text-primary)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{a.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Trending Events */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={16} color="var(--text-primary)" />
          <span className="h3">Trending Campus</span>
        </div>
        <span className="see-all" onClick={() => navigate('/events')}>See all</span>
      </div>

      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, marginBottom: 16, margin: '0 -16px', padding: '0 16px 16px' }}>
        {trendingEvents.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => navigate(`/event/${e.id}`)}
            className="card card-interactive"
            style={{
              minWidth: 240, padding: 16, flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
              <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', flex: 1, lineHeight: 1.3 }}>{e.title}</h4>
              <span className="badge badge-neutral" style={{ marginLeft: 8 }}>{e.tag}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="caption" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarDays size={12} /> {e.date}
              </span>
              <span className="caption" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users size={12} /> {e.attendees}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Rides */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={16} color="var(--text-primary)" />
          <span className="h3">Quick Rides</span>
        </div>
      </div>

      {recentRides.map((r, i) => (
        <motion.div
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 + (i * 0.08), ease: [0.16, 1, 0.3, 1] }}
          onClick={() => navigate('/ride-search')}
          className="card card-interactive"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, position: 'relative', zIndex: 1 }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--text-tertiary)' }} />
              <span className="body-sm" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.from}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, backgroundColor: 'var(--text-primary)' }} />
              <span className="body-sm" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.to}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="mono" style={{ fontSize: 16, color: 'var(--text-primary)' }}>{r.price}</div>
            <span className="caption mono">{r.best} · {r.time}</span>
          </div>
          <ChevronRight size={16} color="var(--text-tertiary)" style={{ marginLeft: 12 }} />
        </motion.div>
      ))}
    </motion.div>
  )
}
