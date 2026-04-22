import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Star, Clock, Navigation } from 'lucide-react'

// Realistic Jaipur Locations Database
export const LOCATIONS = [
  { id: '1', name: 'Maharani College', sub: 'MI Road, Jaipur', lat: 26.9155, lng: 75.8166 },
  { id: '2', name: 'World Trade Park', sub: 'Malviya Nagar, Jaipur', lat: 26.8530, lng: 75.8047 },
  { id: '3', name: 'Jawahar Circle', sub: 'Malviya Nagar, Jaipur', lat: 26.8410, lng: 75.8014 },
  { id: '4', name: 'Hawa Mahal', sub: 'Badi Choupad, Jaipur', lat: 26.9239, lng: 75.8267 },
  { id: '5', name: 'Tapri Central', sub: 'C-Scheme, Jaipur', lat: 26.9042, lng: 75.8041 },
  { id: '6', name: 'MNIT Campus', sub: 'JLN Marg, Jaipur', lat: 26.8631, lng: 75.8105 },
  { id: '7', name: 'Sindhi Camp Bus Stand', sub: 'Station Road, Jaipur', lat: 26.9248, lng: 75.7981 },
  { id: '8', name: 'Jaipur Railway Station', sub: 'Gopalbari, Jaipur', lat: 26.9202, lng: 75.7877 },
]

export default function RideSearch() {
  const navigate = useNavigate()
  const [fromSearch, setFromSearch] = useState('Maharani College')
  const [toSearch, setToSearch] = useState('')
  const [fromLoc, setFromLoc] = useState(LOCATIONS[0])
  const [toLoc, setToLoc] = useState(null)
  
  const [activeInput, setActiveInput] = useState('to') // 'from' or 'to'
  
  const filteredPlaces = LOCATIONS.filter(l => 
    (activeInput === 'from' ? l.name.toLowerCase().includes(fromSearch.toLowerCase()) : l.name.toLowerCase().includes(toSearch.toLowerCase())) &&
    (activeInput === 'to' ? l.id !== fromLoc?.id : true)
  )

  const handleSelect = (loc) => {
    if (activeInput === 'from') {
      setFromLoc(loc)
      setFromSearch(loc.name)
      setActiveInput('to')
    } else {
      setToLoc(loc)
      setToSearch(loc.name)
      // Navigate to results immediately when destination is chosen
      setTimeout(() => {
        navigate('/ride-results', { state: { from: fromLoc, to: loc } })
      }, 150)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ paddingTop: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', padding: 4 }}>
          <ArrowLeft size={22} color="var(--text-primary)" />
        </div>
        <h1 className="h2">Where to?</h1>
      </div>

      {/* Input Group */}
      <div style={{
        backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
        border: `1px solid var(--border-subtle)`, padding: '16px', marginBottom: 24,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--success)', flexShrink: 0 }} />
          <input 
            className="input" 
            value={fromSearch} 
            onChange={e => setFromSearch(e.target.value)}
            onFocus={() => setActiveInput('from')}
            placeholder="Pickup location" 
            style={{ 
              backgroundColor: 'var(--bg-background)', 
              borderColor: activeInput === 'from' ? 'var(--accent-secondary)' : 'var(--border-subtle)' 
            }} 
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 8, height: 8, backgroundColor: 'var(--text-primary)', flexShrink: 0 }} />
          <input 
            className="input" 
            value={toSearch} 
            onChange={e => setToSearch(e.target.value)}
            onFocus={() => setActiveInput('to')}
            placeholder="Search destination..." 
            autoFocus 
            style={{ 
              backgroundColor: 'var(--bg-background)', 
              borderColor: activeInput === 'to' ? 'var(--accent-secondary)' : 'var(--border-subtle)' 
            }} 
          />
        </div>
      </div>

      {/* Results List */}
      <div style={{ padding: '0 4px' }}>
        <div className="overline" style={{ marginBottom: 12 }}>
          {toSearch || fromSearch ? 'SEARCH RESULTS' : 'SUGGESTIONS'}
        </div>
        
        <AnimatePresence>
          {filteredPlaces.map((l, i) => (
            <motion.div 
              key={l.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelect(l)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 12px', borderBottom: '1px solid var(--border-subtle)', 
                cursor: 'pointer', borderRadius: 'var(--radius-md)',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MapPin size={16} color="var(--text-secondary)" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{l.name}</div>
                <div className="caption">{l.sub}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
