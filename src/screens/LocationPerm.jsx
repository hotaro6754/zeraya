import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { useFirebase } from '../hooks/useFirebase';

export default function LocationPerm() {
  const navigate = useNavigate();
  const { user, db } = useFirebase();

  const handleLocationPreference = async (preference) => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          locationPermission: preference,
        }, { merge: true });
      } catch (error) {
        console.error("Error saving location preference: ", error);
        // Still navigate, don't block the user.
      }
    }
    navigate('/home');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-no-nav" style={{ paddingTop: 60, alignItems: 'center', textAlign: 'center' }}>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        style={{
          width: 80, height: 80, borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 32, boxShadow: 'var(--shadow-md)'
        }}
      >
        <MapPin size={40} color="var(--accent-secondary)" />
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <h1 className="h1" style={{ marginBottom: 12 }}>Enable location</h1>
        <p className="body-lg" style={{ marginBottom: 32, maxWidth: 280 }}>
          We need your location for ride comparisons, nearby events, and campus discovery.
        </p>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 16px', borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--success-bg)', color: 'var(--success)',
          border: '1px solid var(--success)', marginBottom: 48
        }}>
          <ShieldCheck size={16} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Never shared. Only used on-device.</span>
        </div>
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button className="btn btn-primary btn-full btn-lg" onClick={() => handleLocationPreference('granted')}>
          Allow Location Access
        </button>
        <button className="btn btn-ghost btn-full" onClick={() => handleLocationPreference('denied')}>
          Maybe later
        </button>
      </motion.div>

    </motion.div>
  );
}
