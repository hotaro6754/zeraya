import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useFirebase } from '../hooks/useFirebase'

const CATEGORIES = ['Hackathon', 'Cultural', 'Sports', 'Seminar', 'Workshop', 'Party']

export default function PostEvent() {
  const navigate = useNavigate()
  const { db, user } = useFirebase()
  const [selectedCat, setSelectedCat] = useState('Cultural')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePost = async () => {
    if (!title || !date || !location) {
      alert('Please fill in required fields')
      return
    }

    setLoading(true)
    try {
      await addDoc(collection(db, 'events'), {
        title,
        club: user?.displayName || 'Campus Member',
        date,
        time,
        location,
        category: selectedCat,
        description,
        attendees: 0,
        joinedBy: [],
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', // Default image
        createdAt: serverTimestamp(),
        authorId: user?.uid
      })
      navigate('/events')
    } catch (error) {
      console.error("Error posting event:", error)
      alert('Failed to post event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ paddingTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', padding: 4, backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
            <ArrowLeft size={20} color="var(--text-primary)" />
          </div>
          <h1 className="h2">Host Event</h1>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handlePost} disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>

      {/* Cover Upload */}
      <div style={{
        height: 180,
        backgroundColor: 'var(--bg-surface)',
        border: '1px dashed var(--border-strong)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 24,
        cursor: 'pointer'
      }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--bg-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ImageIcon size={24} color="var(--text-secondary)" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Upload Cover Image</div>
          <div className="caption">16:9 ratio recommended</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label className="caption" style={{ marginBottom: 8, display: 'block', fontWeight: 600 }}>Event Title *</label>
          <input
            className="input"
            placeholder="e.g. Annual Tech Fest 2026"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="caption" style={{ marginBottom: 8, display: 'block', fontWeight: 600 }}>Date *</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="caption" style={{ marginBottom: 8, display: 'block', fontWeight: 600 }}>Time</label>
            <input
              type="time"
              className="input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="caption" style={{ marginBottom: 8, display: 'block', fontWeight: 600 }}>Location *</label>
          <input
            className="input"
            placeholder="e.g. Main Auditorium, Maharani College"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label className="caption" style={{ marginBottom: 8, display: 'block', fontWeight: 600 }}>Category</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(c => (
              <div
                key={c}
                onClick={() => setSelectedCat(c)}
                className={`chip ${selectedCat === c ? 'active' : ''}`}
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="caption" style={{ marginBottom: 8, display: 'block', fontWeight: 600 }}>Description</label>
          <textarea 
            className="input" 
            placeholder="What's your event about?" 
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
