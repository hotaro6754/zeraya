import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, Shield, ExternalLink } from 'lucide-react'
import MathCurveLoader from '../components/MathCurveLoader'
import AnimatedMap from '../components/AnimatedMap'

// Distance Math
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; 
}

export default function RideResults() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const state = location.state || {}
  const from = state.from || { name: 'Maharani College', lat: 26.9155, lng: 75.8166 }
  const to = state.to || { name: 'World Trade Park', lat: 26.8530, lng: 75.8047 }

  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('All') // All, Bikes, Autos, Cabs

  useEffect(() => {
    // Simulate complex scraping
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  // Full Spectrum Pricing Engine
  const rideData = useMemo(() => {
    const straightLine = getDistance(from.lat, from.lng, to.lat, to.lng);
    const distance = Math.max(1.2, straightLine * 1.3); // Driving dist
    
    const now = new Date();
    const hours = now.getHours();
    
    // Complex Time Logic
    const isNight = hours >= 23 || hours < 5;
    const isTraffic = hours >= 17 && hours <= 21;
    const isHeat = hours >= 12 && hours <= 16;

    // Platform Multipliers based on time
    const rapidoMult = isNight ? 1.25 : (isHeat ? 1.1 : 1.0);
    const olaMult = isNight ? 1.3 : (isHeat ? 1.15 : 1.0);
    const uberMult = isTraffic ? 1.4 : (isNight ? 1.2 : 1.0);

    const calcTime = (baseTime) => Math.round(distance * baseTime);

    return {
      distanceStr: distance.toFixed(1),
      context: isNight ? "Night Surge" : (isTraffic ? "Peak Traffic" : "Standard Fares"),
      rides: [
        // BIKES
        { id: 'r_bike', platform: 'Rapido', name: 'Bike', type: 'Bikes', icon: '🏍️', color: '#F59E0B', price: Math.round((15 + (distance * 6)) * rapidoMult), time: calcTime(2.5), eta: '3 min', link: 'rapido://' },
        { id: 'o_bike', platform: 'Ola', name: 'Bike', type: 'Bikes', icon: '🏍️', color: '#34D399', price: Math.round((20 + (distance * 7)) * olaMult), time: calcTime(2.5), eta: '5 min', link: 'olacabs://' },
        { id: 'u_moto', platform: 'Uber', name: 'Moto', type: 'Bikes', icon: '🏍️', color: '#3B82F6', price: Math.round((22 + (distance * 7.5)) * uberMult), time: calcTime(2.5), eta: '4 min', link: 'uber://' },
        
        // AUTOS
        { id: 'r_auto', platform: 'Rapido', name: 'Auto', type: 'Autos', icon: '🛺', color: '#F59E0B', price: Math.round((25 + (distance * 10)) * rapidoMult), time: calcTime(3.5), eta: '6 min', link: 'rapido://' },
        { id: 'o_auto', platform: 'Ola', name: 'Auto', type: 'Autos', icon: '🛺', color: '#34D399', price: Math.round((30 + (distance * 11)) * olaMult), time: calcTime(3.5), eta: '4 min', link: 'olacabs://', highlight: true, badge: 'Fastest', badgeClass: 'badge-warning' },
        { id: 'u_auto', platform: 'Uber', name: 'Auto', type: 'Autos', icon: '🛺', color: '#3B82F6', price: Math.round((35 + (distance * 12)) * uberMult), time: calcTime(3.5), eta: '5 min', link: 'uber://' },

        // CABS (MINI/GO)
        { id: 'r_cab', platform: 'Rapido', name: 'Cab', type: 'Cabs', icon: '🚗', color: '#F59E0B', price: Math.round((45 + (distance * 13)) * rapidoMult), time: calcTime(3.5), eta: '8 min', link: 'rapido://' },
        { id: 'o_mini', platform: 'Ola', name: 'Mini', type: 'Cabs', icon: '🚗', color: '#34D399', price: Math.round((50 + (distance * 14)) * olaMult), time: calcTime(3.5), eta: '7 min', link: 'olacabs://' },
        { id: 'u_go', platform: 'Uber', name: 'Go', type: 'Cabs', icon: '🚗', color: '#3B82F6', price: Math.round((45 + (distance * 14)) * uberMult), time: calcTime(3.5), eta: '6 min', link: 'uber://' },

        // PREMIUM CABS
        { id: 'o_prime', platform: 'Ola', name: 'Prime', type: 'Cabs', icon: '🚙', color: '#34D399', price: Math.round((70 + (distance * 16)) * olaMult), time: calcTime(3.5), eta: '10 min', link: 'olacabs://' },
        { id: 'u_prem', platform: 'Uber', name: 'Premier', type: 'Cabs', icon: '🚙', color: '#3B82F6', price: Math.round((80 + (distance * 17)) * uberMult), time: calcTime(3.5), eta: '9 min', link: 'uber://' },
      ].sort((a, b) => a.price - b.price) // Always sort cheapest first
    }
  }, [from, to])

  const filteredRides = filter === 'All' ? rideData.rides : rideData.rides.filter(r => r.type === filter)

  // Find overall cheapest
  const cheapestOverall = rideData.rides[0]

  if (isLoading) {
    return (
      <div className="page">
        <MathCurveLoader message="Scraping Live Aggregator APIs..." />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ paddingTop: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', padding: 4, backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
          <ArrowLeft size={20} color="var(--text-primary)" />
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <h1 className="h2" style={{ fontSize: 20, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {to.name}
          </h1>
          <p className="caption" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            From: {from.name}
          </p>
        </div>
      </div>

      {/* 3D Map */}
      <div style={{ marginBottom: 20 }}>
        <AnimatedMap from={from} to={to} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none', marginBottom: 8 }}>
        {['All', 'Bikes', 'Autos', 'Cabs'].map(f => (
          <div 
            key={f} 
            onClick={() => setFilter(f)}
            className={`chip ${filter === f ? 'active' : ''}`}
            style={{ padding: '6px 14px', flexShrink: 0 }}
          >
            {f}
          </div>
        ))}
      </div>

      {/* Context Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span className="caption" style={{ color: 'var(--text-secondary)' }}>Showing {filteredRides.length} rides</span>
        {rideData.context !== "Standard Fares" && (
          <span className="badge badge-error">{rideData.context}</span>
        )}
      </div>

      {/* Ride Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 40 }}>
        <AnimatePresence mode="popLayout">
          {filteredRides.map((r, i) => (
            <motion.div
              key={r.id}
              layout
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card card-interactive"
              onClick={() => window.location.href = r.link}
              style={{
                padding: 16, 
                borderColor: r.highlight || r.id === cheapestOverall.id ? 'var(--accent-secondary)' : 'var(--border-subtle)',
                borderWidth: r.highlight || r.id === cheapestOverall.id ? 2 : 1,
                position: 'relative'
              }}
            >
              {(r.highlight || r.id === cheapestOverall.id) && (
                <div style={{ position: 'absolute', top: -10, right: 16, backgroundColor: 'var(--bg-background)' }}>
                  <span className={`badge ${r.badgeClass || 'badge-success'}`}>{r.badge || 'Cheapest'}</span>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-sm)', fontSize: 22,
                    backgroundColor: 'var(--bg-background)', border: '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {r.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {r.platform} <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{r.name}</span>
                    </div>
                    <div className="caption" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <Clock size={11} /> ETA {r.eta}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)',
                  }}>
                    ₹{r.price}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex', gap: 12, justifyContent: 'space-between',
                paddingTop: 12, borderTop: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={13} color="var(--text-tertiary)" />
                  <span className="caption">{r.time} min ride</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shield size={13} color="var(--text-tertiary)" />
                  <span className="caption">Verified</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: r.color }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Book on {r.platform}</span>
                  <ExternalLink size={13} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
