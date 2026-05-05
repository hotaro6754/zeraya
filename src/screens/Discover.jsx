import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Star, Compass } from 'lucide-react'

/**
 * Jaipur-Centric Discover Page
 * Data influenced by Amadeus POI structure
 */

const CATEGORIES = ['All', 'Jaipur Guide', 'Cafes', 'Study Spots', 'Historical']

const POIS = [
  { 
    id: 1, 
    img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80', 
    title: 'Hawa Mahal Sunrise', 
    category: 'Historical',
    rating: 4.8,
    distance: '0.5 km',
    height: 240 
  },
  { 
    id: 2, 
    img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80', 
    title: 'Curious Life Coffee', 
    category: 'Cafes',
    rating: 4.9,
    distance: '2.1 km',
    height: 180 
  },
  { 
    id: 3, 
    img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80', 
    title: 'MNIT Central Library', 
    category: 'Study Spots',
    rating: 4.5,
    distance: '1.2 km',
    height: 220 
  },
  { 
    id: 4, 
    img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80', 
    title: 'World Trade Park', 
    category: 'Jaipur Guide',
    rating: 4.7,
    distance: '0.8 km',
    height: 200 
  },
  { 
    id: 5, 
    img: 'https://images.unsplash.com/photo-1590001158193-790179980530?w=400&q=80', 
    title: 'Nahargarh Sunset', 
    category: 'Historical',
    rating: 4.9,
    distance: '5.4 km',
    height: 260 
  },
  { 
    id: 6, 
    img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', 
    title: 'Tapri Central', 
    category: 'Cafes',
    rating: 4.8,
    distance: '3.0 km',
    height: 190 
  },
]

export default function Discover() {
  const [activeTab, setActiveTab] = useState('All')

  const filtered = activeTab === 'All' ? POIS : POIS.filter(p => p.category === activeTab)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ paddingTop: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="h1">Jaipur Explore</h1>
        <Compass size={24} color="var(--accent-primary)" />
      </div>

      {/* Search Input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
        marginBottom: 24, boxShadow: 'var(--shadow-sm)'
      }}>
        <Search size={18} color="var(--text-tertiary)" />
        <input 
          type="text" 
          placeholder="Find cafes, study spots in Jaipur..." 
          style={{
            border: 'none', background: 'transparent', width: '100%',
            outline: 'none', color: 'var(--text-primary)', fontSize: 15,
            fontFamily: 'var(--font-body)'
          }}
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'none', marginBottom: 8 }}>
        {CATEGORIES.map(t => (
          <div 
            key={t} 
            className={`chip ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
            style={{ flexShrink: 0 }}
          >
            {t}
          </div>
        ))}
      </div>

      {/* Masonry Grid (Amadeus Influenced) */}
      <div className="masonry" style={{ columnCount: 2, columnGap: 12 }}>
        {filtered.map((poi, i) => (
          <motion.div
            key={poi.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="card-interactive"
            style={{
              height: poi.height,
              borderRadius: 'var(--radius-lg)',
              backgroundImage: `url(${poi.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 12,
              breakInside: 'avoid',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {/* Glass Overlay for Metadata */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '12px', background: 'var(--bg-glass)',
              backdropFilter: 'blur(10px)', borderTop: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{poi.title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={10} color="var(--accent-secondary)" fill="var(--accent-secondary)" />
                  <span className="caption" style={{ fontWeight: 600 }}>{poi.rating}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-tertiary)' }}>
                  <MapPin size={10} />
                  <span className="caption">{poi.distance}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
