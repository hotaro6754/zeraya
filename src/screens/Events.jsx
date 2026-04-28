import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Users, Filter, Plus } from 'lucide-react'

const TABS = ['All', 'Today', 'Hackathons', 'Cultural', 'Sports']

import { events } from '../data/mockEvents'

export default function Events() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')
  const [joinedEvents, setJoinedEvents] = useState([])
  const [toast, setToast] = useState(null)

  const filtered = activeTab === 'All' ? events : events.filter(e => e.category === activeTab)

  const handleJoin = (e, eventId) => {
    e.stopPropagation()
    setJoinedEvents(prev => [...prev, eventId])
    setToast("You're in! 🎉")
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="page" style={{ paddingTop: 16 }}>
      {/* Toast Notification */}
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
      <div className="tab-bar" style={{ marginBottom: 24 }}>
        {TABS.map(t => (
          <div 
            key={t} 
            className={`tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </div>
        ))}
      </div>

      {/* Event Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map((e, i) => {
          const isJoined = joinedEvents.includes(e.id)
          return (
          <motion.div
            key={e.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => navigate(`/event/${e.id}`)}
            className="card-interactive"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {/* Real Image Placeholder instead of Gradient */}
            <div style={{
              height: 140,
              backgroundImage: `url(${e.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: 12, right: 12, backgroundColor: 'var(--bg-glass)', backdropFilter: 'blur(10px)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                {e.category}
              </div>
            </div>

            <div style={{ padding: 16 }}>
              <div className="caption" style={{ color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: 4 }}>{e.club}</div>
              <h3 className="h3" style={{ marginBottom: 12 }}>{e.title}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                  <Calendar size={14} />
                  <span className="body-sm">{e.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                  <MapPin size={14} />
                  <span className="body-sm">{e.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                  <Users size={14} />
                  <span className="mono">{isJoined ? e.attendees + 1 : e.attendees} going</span>
                </div>
              </div>

              {/* Join Button (Signature Moment) */}
              <motion.button
                whileTap={{ scale: isJoined ? 1 : 0.95 }}
                onClick={(ev) => !isJoined && handleJoin(ev, e.id)}
                className="btn btn-full"
                style={{
                  marginTop: 16,
                  background: isJoined ? 'var(--bg-card-hover)' : 'var(--grad)',
                  color: isJoined ? 'var(--text-tertiary)' : '#EDE9FF',
                  border: isJoined ? '1px solid var(--border-subtle)' : 'none'
                }}
              >
                {isJoined ? '✓ Joined' : 'Join Event'}
              </motion.button>
            </div>
          </motion.div>
        )
      })}
      </div>
    </motion.div>
  )
}
