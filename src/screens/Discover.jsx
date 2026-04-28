import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const TABS = ['For You', 'Trending', 'Campus', 'Style', 'Tech']

const PINS = [
  { id: 1, img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80', title: 'Campus life', height: 200 },
  { id: 2, img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80', title: 'Setup goals', height: 160 },
  { id: 3, img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80', title: 'Gaming', height: 240 },
  { id: 4, img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80', title: 'Fashion', height: 180 },
  { id: 5, img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', title: 'Foodie', height: 220 },
  { id: 6, img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80', title: 'Music festival', height: 190 },
]

export default function Discover() {
  const [activeTab, setActiveTab] = useState('For You')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ paddingTop: 16 }}>
      {/* Header */}
      <h1 className="h1" style={{ marginBottom: 20 }}>Explore</h1>

      {/* Search Input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
        marginBottom: 20, boxShadow: 'var(--shadow-sm)'
      }}>
        <Search size={18} color="var(--text-tertiary)" />
        <input 
          type="text" 
          placeholder="Search ideas, people, groups..." 
          style={{
            border: 'none', background: 'transparent', width: '100%',
            outline: 'none', color: 'var(--text-primary)', fontSize: 15,
            fontFamily: 'var(--font-body)'
          }}
        />
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

      {/* Masonry Grid */}
      <div className="masonry">
        {PINS.map((pin, i) => (
          <motion.div
            key={pin.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="card-interactive"
            style={{
              height: pin.height,
              borderRadius: 'var(--radius-lg)',
              backgroundImage: `url(${pin.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {/* Gradient overlay for text readability */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)'
            }} />
            <div style={{
              position: 'absolute', bottom: 12, left: 12, right: 12,
              color: '#FFFFFF', fontSize: 14, fontWeight: 600,
              textShadow: '0 1px 3px rgba(0,0,0,0.5)'
            }}>
              {pin.title}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
