import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, MapPin, Calendar, Users, IndianRupee } from 'lucide-react'

const VIBES = ['Adventure', 'Chill', 'Culture', 'Foodie', 'Nature', 'Party', 'Budget']

export default function AiPlanner() {
  const navigate = useNavigate()
  const [vibe, setVibe] = useState(['Budget'])
  const [destination, setDestination] = useState('Udaipur')
  const [days, setDays] = useState(3)
  const [budget, setBudget] = useState('4000')
  const [people, setPeople] = useState(2)

  const toggleVibe = (v) => {
    setVibe(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  const handleGenerate = () => {
    const preferences = {
      destination,
      days,
      budget,
      people,
      vibe: vibe.join(', ')
    }
    navigate('/ai-planner-result', { state: { preferences } })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ paddingTop: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', padding: 4, backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
          <ArrowLeft size={20} color="var(--text-primary)" />
        </div>
        <h1 className="h2">AI Travel Planner</h1>
      </div>

      {/* Hero */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 20px',
        textAlign: 'center',
        marginBottom: 32,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--accent-secondary)', color: 'var(--text-inverse)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(0,112,243,0.3)'
        }}>
          <Sparkles size={24} />
        </div>
        <h2 className="h2" style={{ marginBottom: 8 }}>Plan your perfect trip</h2>
        <p className="body-lg">Tell us where you want to go, and our AI creates a student-budget itinerary in seconds.</p>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label className="caption" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontWeight: 600 }}>
            <MapPin size={14} /> Destination
          </label>
          <input
            className="input"
            placeholder="e.g. Udaipur, Goa, Manali..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="caption" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontWeight: 600 }}>
              <Calendar size={14} /> Start Date
            </label>
            <input type="date" className="input" />
          </div>
          <div style={{ flex: 1 }}>
            <label className="caption" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontWeight: 600 }}>
              <Calendar size={14} /> Days
            </label>
            <input
              type="number"
              className="input"
              placeholder="3"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="caption" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontWeight: 600 }}>
              <Users size={14} /> People
            </label>
            <input
              type="number"
              className="input"
              placeholder="2"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="caption" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontWeight: 600 }}>
              <IndianRupee size={14} /> Budget
            </label>
            <input
              type="text"
              className="input"
              placeholder="₹5,000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="caption" style={{ marginBottom: 8, display: 'block', fontWeight: 600 }}>Vibe</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {VIBES.map(v => (
              <div
                key={v}
                onClick={() => toggleVibe(v)}
                className={`chip ${vibe.includes(v) ? 'active' : ''}`}
              >
                {v}
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ marginTop: 32 }}>
        <button 
          className="btn btn-primary btn-full btn-lg" 
          onClick={handleGenerate}
          style={{ gap: 8 }}
        >
          <Sparkles size={18} /> Generate Itinerary
        </button>
      </motion.div>
    </motion.div>
  )
}
