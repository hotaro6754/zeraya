import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

// Using Unsplash source for realistic student images
const PINS = [
  { id: 1, img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80', height: 200 },
  { id: 2, img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80', height: 160 },
  { id: 3, img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80', height: 240 },
  { id: 4, img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80', height: 180 },
  { id: 5, img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', height: 220 },
  { id: 6, img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80', height: 190 },
]

export default function SocialExplore() {
  const navigate = useNavigate()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ paddingTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', padding: 4, backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
          <ArrowLeft size={20} color="var(--text-primary)" />
        </div>
        <h1 className="h2">Explore</h1>
      </div>

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
              borderRadius: 'var(--radius-md)',
              backgroundImage: `url(${pin.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
