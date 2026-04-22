import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Users, Filter, Plus, Loader2 } from 'lucide-react'
import { fetchLiveJaipurEvents } from '../services/eventService'

const TABS = ['All', 'Today', 'Hackathons', 'Cultural', 'Sports']

export default function Events() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [joinedEvents, setJoinedEvents] = useState([])
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      const data = await fetchLiveJaipurEvents()
      setEvents(data)
      setLoading(false)
    }
    loadEvents()
  }, [])

  const handleJoin = (e, eventId) => {
    e.stopPropagation()
    setJoinedEvents(prev => [...prev, eventId])
    setToast("You're in! 🎉")
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="page" style={{ paddingTop: 16 }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--bg-glass)', backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-strong)', padding: '12px 24px',
              borderRadius: '100px', color: 'var(--text-primary)', zIndex: 1000,
              boxShadow: 'var(--shadow-md)', fontWeight: 600
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="h1">Events</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Filter size={18} color="var(--text-primary)" />
          </div>
          <div onClick={() => navigate('/post-event')} style={{
            width: 40, height: 40, borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--accent-primary)', color: 'var(--text-inverse)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Plus size={20} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar" style={{ marginBottom: 24, overflowX: 'auto', display: 'flex', gap: 12, paddingBottom: 8, scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <div 
            key={t} 
            className={`tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
            style={{ 
              whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: 'var(--radius-full)',
              background: activeTab === t ? 'var(--accent-primary)' : 'var(--bg-surface)',
              color: activeTab === t ? 'var(--text-inverse)' : 'var(--text-secondary)',
              border: activeTab === t ? 'none' : '1px solid var(--border-subtle)',
              cursor: 'pointer', fontSize: 14, fontWeight: 600
            }}
          >
            {t}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 16 }}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Loader2 size={32} color="var(--accent-primary)" />
              </motion.div>
              <p className="caption">Scraping live Jaipur events...</p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {events
                .filter(e => activeTab === 'All' || e.category === activeTab)
                .map((event, i) => {
                  const isJoined = joinedEvents.includes(event.id)
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => navigate(`/event/${event.id}`)}
                      className="card"
                      style={{ overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', padding: 0 }}
                    >
                      <div style={{ height: 160, backgroundImage: `url(${event.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      <div style={{ padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-primary)' }}>{event.club}</span>
                          <span className="badge" style={{ backgroundColor: 'var(--bg-s2)', color: 'var(--text-secondary)', border: 'none', fontSize: 11 }}>{event.category}</span>
                        </div>
                        <h3 className="h3" style={{ marginBottom: 12 }}>{event.title}</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                            <Calendar size={14} />
                            <span style={{ fontSize: 13 }}>{event.date}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                            <MapPin size={14} />
                            <span style={{ fontSize: 13 }}>{event.location}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                            <Users size={14} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{isJoined ? event.attendees + 1 : event.attendees} going</span>
                          </div>
                        </div>
                        
                        <motion.button 
                          whileTap={{ scale: isJoined ? 1 : 0.95 }}
                          onClick={(ev) => !isJoined && handleJoin(ev, event.id)}
                          className="btn-primary" 
                          style={{ 
                            width: '100%', marginTop: 20, height: 44, fontSize: 14,
                            background: isJoined ? 'var(--bg-s2)' : 'var(--accent-primary)',
                            color: isJoined ? 'var(--text-secondary)' : 'var(--text-inverse)',
                            border: isJoined ? '1px solid var(--border-subtle)' : 'none'
                          }}
                        >
                          {isJoined ? '✓ Joined' : 'Join Event'}
                        </motion.button>
                      </div>
                    </motion.div>
                  )
                })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
