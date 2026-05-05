import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, MapPin, Users, Share, Bookmark, Loader2 } from 'lucide-react'
import { fetchLiveJaipurEvents } from '../services/eventService'

export default function EventDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true)
      const data = await fetchLiveJaipurEvents()
      const found = data.find(e => e.id.toString() === id.toString())
      setEvent(found)
      setLoading(false)
    }
    loadEvent()
  }, [id])

  if (loading) {
    return (
      <div className="page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader2 size={32} color="var(--accent-primary)" />
        </motion.div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p className="caption">Event not found</p>
        <button onClick={() => navigate(-1)} className="btn-primary" style={{ marginTop: 16 }}>Go Back</button>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-no-nav" style={{ padding: 0, paddingBottom: 100 }}>
      {/* Hero Image with ShaderGradient aesthetics */}
      <div style={{
        height: 320,
        backgroundImage: `url(${event.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        borderBottomLeftRadius: 'var(--radius-xl)',
        borderBottomRightRadius: 'var(--radius-xl)',
        overflow: 'hidden'
      }}>
        {/* ShaderGradient Inspired Overlay */}
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: 'linear-gradient(180deg, rgba(7,6,26,0.2) 0%, rgba(139,92,246,0.3) 50%, rgba(7,6,26,0.95) 100%)',
          mixBlendMode: 'multiply'
        }} />
        
        {/* Top Nav */}
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
          <div onClick={() => navigate(-1)} style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={20} color="var(--text-primary)" />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bookmark size={20} color="var(--text-primary)" />
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Share size={20} color="var(--text-primary)" />
            </div>
          </div>
        </div>

        {/* Title overlay */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', bottom: 24, left: 16, right: 16, zIndex: 10 }}
        >
          <span className="badge" style={{ backgroundColor: 'var(--accent-primary)', color: '#EDE9FF', marginBottom: 12, border: 'none' }}>{event.category}</span>
          <h1 className="hero" style={{ color: '#fff', fontSize: 32, textShadow: '0 4px 12px rgba(0,0,0,0.5)', marginBottom: 4 }}>{event.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 500 }}>by {event.club}</p>
        </motion.div>
      </div>

      <div style={{ padding: '24px 16px' }}>
        {/* Metadata Grid */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}
        >
          <div className="card" style={{ padding: '16px', display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg-s2)' }}>
            <div style={{ padding: 10, background: 'rgba(139,92,246,0.1)', borderRadius: 'var(--radius-full)' }}>
              <Calendar size={20} color="var(--accent-primary)" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{event.date?.split(' • ')[0]}</div>
              <div className="mono caption" style={{ marginTop: 2 }}>{event.date?.split(' • ')[1]}</div>
            </div>
          </div>
          <div className="card" style={{ padding: '16px', display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg-s2)' }}>
            <div style={{ padding: 10, background: 'rgba(96,165,250,0.1)', borderRadius: 'var(--radius-full)' }}>
              <MapPin size={20} color="var(--accent-secondary)" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{event.location?.split(',')[0]}</div>
              <div className="caption" style={{ marginTop: 2 }}>Campus</div>
            </div>
          </div>
        </motion.div>

        {/* Social Media Clone Attendees Pile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, padding: '16px', background: 'var(--bg-s1)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
              'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
              'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80'
            ].map((img, i) => (
              <img key={i} src={img} alt="attendee" style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--bg-s1)', marginLeft: i > 0 ? -12 : 0, objectFit: 'cover' }} />
            ))}
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--bg-s1)', marginLeft: -12, backgroundColor: 'var(--bg-s2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
              +{event.attendees - 3}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{event.attendees} Going</div>
            <div className="caption">Including 12 friends</div>
          </div>
        </motion.div>

        {/* About */}
        <h3 className="h2" style={{ marginBottom: 12 }}>About</h3>
        <p className="body-lg" style={{ marginBottom: 32, color: 'var(--text-secondary)' }}>
          {event.description}
        </p>

        {/* Speakers */}
        <h3 className="h2" style={{ marginBottom: 16 }}>Speakers & Guests</h3>
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'none', margin: '0 -16px', padding: '0 16px 16px' }}>
          {event.speakers?.map((s, i) => (
            <div key={i} className="card" style={{ minWidth: 140, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flexShrink: 0, background: 'var(--bg-s2)' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 16, backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '2px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: 16, backgroundColor: 'var(--bg-glass)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border-subtle)' }}>
        <button className="btn btn-primary btn-full btn-lg">
          Register • ₹250
        </button>
      </div>
    </motion.div>
  )
}
