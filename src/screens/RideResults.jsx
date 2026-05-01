import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Shield, ExternalLink } from 'lucide-react';
import MathCurveLoader from '../components/MathCurveLoader';
import AnimatedMap from '../components/AnimatedMap';
import getRidePrices from '../utils/getRidePrices';

export default function RideResults() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};
  const from = state.from || { name: 'Maharani College', lat: 26.9155, lng: 75.8166 };
  const to = state.to || { name: 'World Trade Park', lat: 26.8530, lng: 75.8047 };

  const [isLoading, setIsLoading] = useState(true);
  const [rideData, setRideData] = useState(null);
  const [filter, setFilter] = useState('All'); // All, Bikes, Autos, Cabs

  useEffect(() => {
    const fetchRidePrices = async () => {
      try {
        const result = await getRidePrices({ from, to });
        setRideData(result.data);
      } catch (error) {
        console.error("Error fetching ride prices: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRidePrices();
  }, [from, to]);

  const filteredRides = rideData ? (filter === 'All' ? rideData.rides : rideData.rides.filter(r => r.type === filter)) : [];
  const cheapestOverall = rideData ? rideData.rides[0] : null;

  if (isLoading) {
    return (
      <div className="page">
        <MathCurveLoader message="Scraping Live Aggregator APIs..." />
      </div>
    );
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
        {rideData && rideData.context !== "Standard Fares" && (
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
                borderColor: r.highlight || (cheapestOverall && r.id === cheapestOverall.id) ? 'var(--accent-secondary)' : 'var(--border-subtle)',
                borderWidth: r.highlight || (cheapestOverall && r.id === cheapestOverall.id) ? 2 : 1,
                position: 'relative'
              }}
            >
              {(r.highlight || (cheapestOverall && r.id === cheapestOverall.id)) && (
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
