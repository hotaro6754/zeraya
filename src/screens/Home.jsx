import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Bell, Car, CalendarDays, Compass, Brain, BookOpen, Users, ChevronRight, TrendingUp, Zap } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';

const quickActions = [
  { icon: Car, label: 'Rides', path: '/ride-search' },
  { icon: CalendarDays, label: 'Events', path: '/events' },
  { icon: Compass, label: 'Explore', path: '/discover' },
  { icon: Brain, label: 'AI Plan', path: '/ai-planner' },
  { icon: BookOpen, label: 'Vault', path: '/smart-book' },
  { icon: Users, label: 'Social', path: '/social' },
];

const recentRides = [
  { from: 'Maharani College', to: 'C-Scheme', best: 'Rapido', price: '₹45', time: '12 min' },
  { from: 'Tonk Road', to: 'Mansarovar', best: 'Ola Auto', price: '₹62', time: '18 min' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user, events, dataLoading } = useFirebase();

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
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="body-sm" style={{ color: 'var(--text-tertiary)' }}>Good evening,</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h1 className="hero" style={{ marginTop: 2 }}>{user?.displayName ? user.displayName.split(' ')[0] : 'User'} ✦</h1>
          </div>
        </motion.div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="icon-btn">
            <Bell size={18} />
          </div>
          <div className="avatar" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            {user?.photoURL ? <img src={user.photoURL} alt="profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : (user?.displayName?.[0] || 'U')}
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div
        onClick={() => navigate('/ride-search')}
        className="search-bar"
      >
        <Search size={18} color="var(--text-tertiary)" />
        <span>Where to?</span>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        {quickActions.map((a, i) => (
          <motion.div
            key={a.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(a.path)}
            className="card card-interactive quick-action-card"
          >
            <a.icon size={22} color="var(--text-primary)" />
            <span className="quick-action-label">{a.label}</span>
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

      {dataLoading.events && <p>Loading events...</p>}
      
      {!dataLoading.events && (
        <div className="horizontal-scroll-container">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => navigate(`/event/${event.id}`)}
              className="card card-interactive event-card"
            >
              <div className="event-card-header">
                <h4 className="event-card-title">{event.title}</h4>
                <span className="badge badge-neutral">{event.category || 'New'}</span>
              </div>
              <div className="event-card-footer">
                <span className="caption">
                  <CalendarDays size={12} /> {event.date?.seconds ? new Date(event.date.seconds * 1000).toLocaleDateString() : event.date}
                </span>
                <span className="caption">
                  <Users size={12} /> {event.attendees}
                </span>
              </div>
            </motion.div>
          ))}
          {events.length === 0 && <p className="caption" style={{ padding: 16 }}>No upcoming events.</p>}
        </div>
      )}

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
          className="card card-interactive recent-ride-card"
        >
          <div style={{ flex: 1 }}>
            <div className="recent-ride-location">
              <div className="location-dot-start" />
              <span className="body-sm font-medium">{r.from}</span>
            </div>
            <div className="recent-ride-location">
              <div className="location-dot-end" />
              <span className="body-sm font-medium">{r.to}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="mono price-tag">{r.price}</div>
            <span className="caption mono">{r.best} · {r.time}</span>
          </div>
          <ChevronRight size={16} color="var(--text-tertiary)" style={{ marginLeft: 12 }} />
        </motion.div>
      ))}
    </motion.div>
  )
}
