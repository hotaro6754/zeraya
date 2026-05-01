import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
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
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUser({ ...user, ...userDoc.data() });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchPosts = async () => {
        const postsCollection = collection(db, 'posts');
        const postSnapshot = await getDocs(postsCollection);
        const postList = postSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(postList);
      };

      const fetchStories = async () => {
        const storiesCollection = collection(db, 'stories');
        const storySnapshot = await getDocs(storiesCollection);
        const storyList = storySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStories(storyList);
      };

      fetchPosts();
      fetchStories();
    }
  }, [user]);

  const value = {
    user,
    loading,
    posts,
    stories,
    auth,
    db,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
