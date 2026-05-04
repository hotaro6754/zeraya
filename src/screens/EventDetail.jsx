import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, Clock, Share2, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore'
import { useFirebase } from '../hooks/useFirebase'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { db, user } = useFirebase()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'events', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() })
        } else {
          console.log("No such document!")
        }
      } catch (error) {
        console.error("Error fetching event:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id, db])

  const handleJoinToggle = async () => {
    if (!user) {
      setToast("Please log in to join events")
      setTimeout(() => setToast(null), 2500)
      return
    }

    const isJoined = event.joinedBy && event.joinedBy.includes(user.uid)
    const eventRef = doc(db, 'events', id)

    try {
      await updateDoc(eventRef, {
        joinedBy: isJoined ? arrayRemove(user.uid) : arrayUnion(user.uid),
        attendees: increment(isJoined ? -1 : 1)
      })

      // Update local state
      setEvent(prev => ({
        ...prev,
        joinedBy: isJoined
          ? prev.joinedBy.filter(uid => uid !== user.uid)
          : [...(prev.joinedBy || []), user.uid],
        attendees: isJoined ? prev.attendees - 1 : prev.attendees + 1
      }))

      setToast(isJoined ? "You've left the event" : "You're in! 🎉")
      setTimeout(() => setToast(null), 2500)
    } catch (error) {
      console.error("Error updating event:", error)
      setToast("Something went wrong.")
      setTimeout(() => setToast(null), 2500)
    }
  }

  if (loading) return <div className="page-loading">Loading event...</div>
  if (!event) return <div className="page centered"><p>Event not found.</p><button className="btn btn-primary" onClick={() => navigate('/events')}>Back to Events</button></div>

  const isJoined = user && event.joinedBy && event.joinedBy.includes(user.uid)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ padding: 0 }}>
      {toast && <div className="toast" style={{ zIndex: 1000 }}>{toast}</div>}

      {/* Hero Header */}
      <div style={{ height: 300, position: 'relative', overflow: 'hidden' }}>
        <img src={event.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(7,6,26,0.9) 100%)' }} />
        
        {/* Navigation */}
        <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 12 }}>
          <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', padding: 8, backgroundColor: 'rgba(7,6,26,0.5)', backdropFilter: 'blur(10px)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </div>
        </div>
        
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 12 }}>
          <div style={{ cursor: 'pointer', padding: 8, backgroundColor: 'rgba(7,6,26,0.5)', backdropFilter: 'blur(10px)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Share2 size={18} color="#FFFFFF" />
          </div>
        </div>

        {/* Title Content */}
        <div style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
          <span className="badge badge-warning" style={{ marginBottom: 12 }}>{event.category}</span>
          <h1 className="hero" style={{ color: '#FFFFFF', fontSize: 28 }}>{event.title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Quick Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={18} color="var(--accent-primary)" />
            <div>
              <div className="caption">Date</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {event.date?.seconds ? new Date(event.date.seconds * 1000).toLocaleDateString() : event.date}
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={18} color="var(--accent-primary)" />
            <div>
              <div className="caption">Going</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{event.attendees} attendees</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <MapPin size={18} color="var(--accent-secondary)" />
          <div>
            <div className="caption">Location</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{event.location}</div>
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="overline" style={{ marginBottom: 12 }}>ABOUT EVENT</div>
          <p className="body" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{event.description}</p>
        </div>

        {/* Speakers */}
        {event.speakers && event.speakers.length > 0 && (
          <div>
            <div className="overline" style={{ marginBottom: 12 }}>FEATURED SPEAKERS</div>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
              {event.speakers.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <img src={s.img} style={{ width: 44, height: 44, borderRadius: 'var(--radius-full)', objectFit: 'cover', border: '2px solid var(--border-subtle)' }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                    <div className="caption">{s.role || 'Speaker'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Booking Action */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 16, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
          <button
            className={`btn ${isJoined ? 'btn-secondary' : 'btn-primary'}`}
            style={{ flex: 1, height: 54 }}
            onClick={handleJoinToggle}
          >
            {isJoined ? '✓ Joined' : 'Join Event'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
