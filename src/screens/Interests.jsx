import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { useFirebase } from '../hooks/useFirebase';
import { ArrowRight, Laptop, Music, Trophy, Palette, Pizza, Plane, Book, Dumbbell, Film, Gamepad2, Camera, Code, Mic, Rocket, Shirt } from 'lucide-react';

const ALL_INTERESTS = [
  { id: 'tech', label: 'Technology', icon: Laptop },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'sports', label: 'Sports', icon: Trophy },
  { id: 'art', label: 'Design', icon: Palette },
  { id: 'food', label: 'Food', icon: Pizza },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'books', label: 'Books', icon: Book },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'photo', label: 'Photography', icon: Camera },
  { id: 'coding', label: 'Coding', icon: Code },
  { id: 'dance', label: 'Dance', icon: Mic },
  { id: 'startups', label: 'Startups', icon: Rocket },
  { id: 'fashion', label: 'Fashion', icon: Shirt },
];

export default function Interests() {
  const navigate = useNavigate();
  const { user, db } = useFirebase();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    if (selected.length < 3) {
      alert('Please select at least 3 interests.');
      return;
    }

    if (!user) {
      alert('You are not logged in!');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        interests: selected,
        onboardingComplete: true,
      }, { merge: true });

      navigate('/location');
    } catch (error) {
      console.error("Error saving interests: ", error);
      alert('Failed to save your interests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ justifyContent: 'center', padding: '0 24px' }}>
      <motion.div
        key="interests"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{ width: '100%' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 className="hero" style={{ fontSize: 32, marginBottom: 8 }}>What are you into?</h1>
          <p className="caption">Choose 3 or more interests to personalize your experience.</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
          {ALL_INTERESTS.map((interest, i) => (
            <motion.div
              key={interest.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + (i * 0.03) }}
              onClick={() => toggleInterest(interest.id)}
              className={`chip-selectable ${selected.includes(interest.id) ? 'active' : ''}`}
            >
              <interest.icon size={16} style={{ marginRight: 8 }} />
              {interest.label}
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <button
            className="btn-primary"
            style={{ height: 56, width: '100%', marginTop: 24 }}
            onClick={handleContinue}
            disabled={loading || selected.length < 3}
          >
            {loading ? 'Saving...' : 'Continue'}
            {!loading && <ArrowRight size={20} style={{ marginLeft: 8 }} />} 
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
