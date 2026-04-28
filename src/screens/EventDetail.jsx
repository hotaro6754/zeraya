import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, Clock, Share2, Info } from 'lucide-react'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // In a real app, fetch event by id
  // For demo, we use TEDx Jaipur
  const event = {
    title: 'TEDx Jaipur: Future Tense',
    club: 'TEDx Community',
    date: 'May 12, 2024',
    time: '4:00 PM - 8:00 PM',
    location: 'Deep Smriti Auditorium, Jaipur',
    attendees: 420,
    price: '₹299',
    description: 'Join us for an evening of thought-provoking ideas and inspiring stories. Future Tense explores the intersection of technology, humanity, and our shared future in a rapidly changing world.',
    image: 'https://images.unsplash.com/photo-1540575861501-7ad0582371f3?w=800&q=80',
    speakers: [
      { name: 'Dr. Anjali Sharma', role: 'AI Ethicist', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80' },
      { name: 'Vikram Singh', role: 'Urban Architect', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80' }
    ]
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ padding: 0 }}>
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
          <span className="badge badge-warning" style={{ marginBottom: 12 }}>Limited Seats</span>
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
              <div style={{ fontSize: 13, fontWeight: 600 }}>{event.date}</div>
            </div>
          </div>
          <div className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={18} color="var(--accent-primary)" />
            <div>
              <div className="caption">Time</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{event.time}</div>
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
        <div>
          <div className="overline" style={{ marginBottom: 12 }}>FEATURED SPEAKERS</div>
          <div style={{ display: 'flex', gap: 16 }}>
            {event.speakers.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={s.img} style={{ width: 44, height: 44, borderRadius: 'var(--radius-full)', objectFit: 'cover', border: '2px solid var(--border-subtle)' }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                  <div className="caption">{s.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Booking Action */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 16, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <div className="caption">Ticket Price</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{event.price}</div>
          </div>
          <button className="btn btn-primary" style={{ flex: 1, height: 54 }}>Book Your Slot</button>
        </div>
      </div>
    </motion.div>
  )
}
