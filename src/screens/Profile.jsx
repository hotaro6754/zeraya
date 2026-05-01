import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Settings, LogOut, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../App'; 
import ImageUpload from '../components/ImageUpload';

export default function Profile() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        navigate('/auth');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth');
  };

  const handleProfileImageUpload = async (url) => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { photoURL: url }, { merge: true });
      setUserData(prev => ({ ...prev, photoURL: url }));
    }
  };

  if (loading) {
    return <div className="page-loading">Loading profile...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ paddingTop: 32 }}>
      {/* Profile Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <ImageUpload onUploadComplete={handleProfileImageUpload} />
        <h1 className="h2" style={{ marginTop: 16 }}>{userData?.displayName || user?.email}</h1>
        <p className="body-lg" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
        <div className="chip-action"><Settings size={18} /> Settings</div>
        <div className="chip-action" onClick={handleLogout}><LogOut size={18} /> Logout</div>
        <div className="chip-action" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          {theme === 'light' ? 'Dark' : 'Light'} Mode
        </div>
      </div>

      {/* Profile Details (Example) */}
      <div className="card-list">
        <div className="list-item">
          <User size={20} style={{ color: 'var(--text-secondary)' }} />
          <div style={{ flex: 1 }}>
            <p className="body-md" style={{ fontWeight: 600 }}>Display Name</p>
            <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>{userData?.displayName || 'Not set'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}