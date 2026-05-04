import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc, getDoc, collection, onSnapshot, query,
  updateDoc, arrayUnion, arrayRemove, increment, addDoc, serverTimestamp, getDocs, orderBy
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const FirebaseContext = createContext(null);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);
  const [dataLoading, setDataLoading] = useState({
    posts: true,
    stories: true,
    events: true,
    groups: true,
    transactions: true,
    discoverPins: true
  });
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [discoverPins, setDiscoverPins] = useState([]);

  useEffect(() => {
    // Fallback: if Firebase isn't configured, stop loading after 3s
    const fallbackTimer = setTimeout(() => {
      console.warn('[v0] Firebase auth timed out — likely missing env vars. Rendering app anyway.');
      setLoading(false);
    }, 3000);

    let unsubscribeAuth;
    try {
      unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
        clearTimeout(fallbackTimer);
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const unsubscribeUser = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
              setUser({ ...firebaseUser, ...snap.data() });
            } else {
              setUser(firebaseUser);
            }
            setLoading(false);
          }, (err) => {
            console.error('[v0] Firestore user snapshot error:', err.message);
            setUser(firebaseUser);
            setLoading(false);
          });
          return () => unsubscribeUser();
        } else {
          setUser(null);
          setLoading(false);
        }
      }, (err) => {
        console.error('[v0] Firebase auth error:', err.message);
        clearTimeout(fallbackTimer);
        setFirebaseError(err.message);
        setLoading(false);
      });
    } catch (err) {
      console.error('[v0] Firebase init error:', err.message);
      clearTimeout(fallbackTimer);
      setFirebaseError(err.message);
      setLoading(false);
    }

    return () => {
      clearTimeout(fallbackTimer);
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribePosts = onSnapshot(query(collection(db, 'posts'), orderBy('createdAt', 'desc')), (snapshot) => {
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDataLoading(prev => ({ ...prev, posts: false }));
      }, (err) => {
          onSnapshot(collection(db, 'posts'), (snapshot) => {
              setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
              setDataLoading(prev => ({ ...prev, posts: false }));
          });
      });

      const unsubscribeStories = onSnapshot(query(collection(db, 'stories')), (snapshot) => {
        setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDataLoading(prev => ({ ...prev, stories: false }));
      });

      const unsubscribeEvents = onSnapshot(query(collection(db, 'events')), (snapshot) => {
        setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDataLoading(prev => ({ ...prev, events: false }));
      });

      const unsubscribeGroups = onSnapshot(query(collection(db, 'groups')), (snapshot) => {
        setGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDataLoading(prev => ({ ...prev, groups: false }));
      });

      const unsubscribeTransactions = onSnapshot(query(collection(db, 'transactions'), orderBy('date', 'desc')), (snapshot) => {
        setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDataLoading(prev => ({ ...prev, transactions: false }));
      }, (err) => {
          onSnapshot(collection(db, 'transactions'), (snapshot) => {
              setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
              setDataLoading(prev => ({ ...prev, transactions: false }));
          });
      });

      const unsubscribeDiscover = onSnapshot(collection(db, 'discover_pins'), (snapshot) => {
        setDiscoverPins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDataLoading(prev => ({ ...prev, discoverPins: false }));
      });

      return () => {
        unsubscribePosts();
        unsubscribeStories();
        unsubscribeEvents();
        unsubscribeGroups();
        unsubscribeTransactions();
        unsubscribeDiscover();
      };
    }
  }, [user?.uid]);

  const toggleLike = async (postId, isLiked) => {
    if (!user) return;
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likedBy: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      likes: increment(isLiked ? -1 : 1)
    });
  };

  const seedData = async () => {
    const eventsCol = collection(db, 'events');
    const postsCol = collection(db, 'posts');
    const storiesCol = collection(db, 'stories');
    const groupsCol = collection(db, 'groups');
    const transactionsCol = collection(db, 'transactions');
    const pinsCol = collection(db, 'discover_pins');

    const eventsSnap = await getDocs(eventsCol);
    if (eventsSnap.empty) {
      const sampleEvents = [
        {
          title: 'TEDx Maharani College',
          club: 'TEDx Club',
          date: 'Apr 28 • 10:00 AM',
          location: 'Main Auditorium',
          attendees: 234,
          joinedBy: [],
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
          category: 'Cultural',
          description: 'Join us for an inspiring afternoon of ideas worth spreading.',
          speakers: [{ img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80', name: 'Dr. Pooja Sharma', role: 'Speaker' }]
        }
      ];
      for (const e of sampleEvents) await addDoc(eventsCol, { ...e, createdAt: serverTimestamp() });
    }

    const postsSnap = await getDocs(postsCol);
    if (postsSnap.empty) {
      const samplePosts = [
        {
          user: 'Design Club',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80',
          time: '2h ago',
          content: 'Just wrapped up our UI/UX workshop! Thanks to everyone who attended. Next week we dive into Framer. 🎨✨',
          image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80',
          likes: 124,
          likedBy: [],
          comments: 18
        }
      ];
      for (const p of samplePosts) await addDoc(postsCol, { ...p, createdAt: serverTimestamp() });
    }

    const storiesSnap = await getDocs(storiesCol);
    if (storiesSnap.empty) {
      const sampleStories = [
        { user: 'Riya', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', hasUnseen: true },
        { user: 'Karan', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', hasUnseen: true }
      ];
      for (const s of sampleStories) await addDoc(storiesCol, { ...s, createdAt: serverTimestamp() });
    }

    const groupsSnap = await getDocs(groupsCol);
    if (groupsSnap.empty) {
        const sampleGroups = [
            { name: 'Maharani Connect', members: '2.4k', desc: 'Main college group for announcements', type: 'Official' },
            { name: 'UI/UX Enthusiasts', members: '156', desc: 'Design resources and feedback', type: 'Club' },
            { name: 'Jaipur Hackers', members: '840', desc: 'Coding, hackathons, web3', type: 'Community' }
        ];
        for (const g of sampleGroups) await addDoc(groupsCol, g);
    }

    const transactionsSnap = await getDocs(transactionsCol);
    if (transactionsSnap.empty) {
        const sampleTransactions = [
            { title: 'Tapri Central', date: serverTimestamp(), amount: '₹340', category: 'Food', icon: 'Coffee' },
            { title: 'Rapido to WTP', date: serverTimestamp(), amount: '₹45', category: 'Travel', icon: 'Train' }
        ];
        for (const t of sampleTransactions) await addDoc(transactionsCol, t);
    }

    const pinsSnap = await getDocs(pinsCol);
    if (pinsSnap.empty) {
        const samplePins = [
            { title: 'Campus Aesthetics', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80', height: 200 },
            { title: 'Late Night Study', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80', height: 160 },
            { title: 'Innovation Hub', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80', height: 240 }
        ];
        for (const p of samplePins) await addDoc(pinsCol, p);
    }
  };

  const value = {
    user,
    loading,
    firebaseError,
    dataLoading,
    posts,
    stories,
    events,
    groups,
    transactions,
    discoverPins,
    auth,
    db,
    toggleLike,
    seedData
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-background)',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '3px solid var(--border-subtle)',
          borderTopColor: 'var(--accent-primary)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 13, fontFamily: 'var(--font-body)' }}>Loading Zeraya…</p>
      </div>
    );
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
