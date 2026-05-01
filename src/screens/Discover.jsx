import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const TABS = ['For You', 'Trending', 'Campus', 'Style', 'Tech'];

export default function Discover() {
  const [activeTab, setActiveTab] = useState('For You');
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const pinsCollection = collection(db, 'discover_pins');
        const querySnapshot = await getDocs(pinsCollection);
        const pinsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPins(pinsData);
      } catch (err) {
        setError("Failed to fetch pins. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, []);

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
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      {!loading && !error && (
        <div className="masonry">
          {pins.map((pin, i) => (
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
      )}
    </motion.div>
  )
}
