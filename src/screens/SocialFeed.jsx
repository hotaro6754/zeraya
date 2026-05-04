import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Plus, AlertTriangle, Inbox, Send, Image as ImageIcon, X } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Skeleton = () => (
  <div className="skeleton-post">
    <div className="skeleton-post-header">
      <div className="skeleton-avatar" />
      <div className="skeleton-user-info">
        <div className="skeleton-line" style={{ width: 100 }} />
        <div className="skeleton-line" style={{ width: 60, marginTop: 4 }} />
      </div>
    </div>
    <div className="skeleton-image" />
  </div>
);

export default function SocialFeed() {
  const navigate = useNavigate();
  const { user, posts, stories, dataLoading, toggleLike, db } = useFirebase();
  const [toast, setToast] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async (postId, isLiked) => {
    if (!user) {
      setToast("Please log in to like posts");
      setTimeout(() => setToast(null), 2500);
      return;
    }
    try {
      await toggleLike(postId, isLiked);
    } catch (err) {
      setToast("Something went wrong.");
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        user: user.displayName || user.email,
        avatar: user.photoURL || 'https://via.placeholder.com/100',
        content: newPostContent,
        time: 'Just now',
        likes: 0,
        likedBy: [],
        comments: 0,
        createdAt: serverTimestamp(),
        authorId: user.uid
      });
      setNewPostContent('');
      setShowPostModal(false);
      setToast("Post shared!");
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      console.error(err);
      setToast("Failed to share post.");
      setTimeout(() => setToast(null), 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStories = () => {
    if (dataLoading.stories) return <div className="stories-loading-container">{[...Array(4)].map((_,i) => <div key={i} className="skeleton-story"/>)}</div>;
    
    const allStories = [{ id: 'add', user: 'Your Story', img: user?.photoURL, isAdd: true }, ...stories];

    return (
      <div className="stories-container">
        {allStories.map((s, i) => (
          <motion.div 
            key={s.id} 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="story-item"
          >
            <div className={`story-avatar-ring ${s.hasUnseen ? 'unseen' : ''}`}>
              <div className="story-avatar-image" style={{ backgroundImage: `url(${s.img || 'https://via.placeholder.com/64'})` }} />
              {s.isAdd && (
                <div className="story-add-button">
                  <Plus size={14} />
                </div>
              )}
            </div>
            <span className={`caption ${s.isAdd ? 'text-primary' : 'text-secondary'}`}>{s.user}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderPosts = () => {
    if (dataLoading.posts) return <div className="posts-container">{[...Array(3)].map((_, i) => <Skeleton key={i} />)}</div>;
    if (posts.length === 0) return <div className="empty-feed-container"><Inbox size={40} /><p>No posts yet. Be the first to share!</p></div>;

    // Sort posts by createdAt if available, otherwise just as is
    const sortedPosts = [...posts].sort((a, b) => {
        if (a.createdAt && b.createdAt) return b.createdAt.seconds - a.createdAt.seconds;
        return 0;
    });

    return (
      <div className="posts-container">
        {sortedPosts.map((p, i) => {
          const isLiked = user && p.likedBy && p.likedBy.includes(user.uid);
          return (
            <motion.div 
              key={p.id} 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="post-card"
            >
              <div className="post-header">
                <div className="post-user-info">
                  <div className="post-avatar" style={{ backgroundImage: `url(${p.avatar})` }} />
                  <div>
                    <div className="post-user-name">{p.user}</div>
                    <div className="caption">{p.time}</div>
                  </div>
                </div>
                <MoreHorizontal size={20} className="text-tertiary" />
              </div>
              <div className="post-content">{p.content}</div>
              {p.image && <div className="post-image" style={{ backgroundImage: `url(${p.image})` }} />}
              <div className="post-actions">
                <div className="post-action-group">
                  <motion.div whileTap={{ scale: 0.9 }} onClick={() => handleLike(p.id, isLiked)} className={`post-action ${isLiked ? 'liked' : ''}`}>
                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                    <span className="caption font-semibold">{p.likes}</span>
                  </motion.div>
                  <div className="post-action">
                    <MessageCircle size={20} /> <span className="caption font-semibold">{p.comments}</span>
                  </div>
                </div>
                <Share2 size={20} className="text-secondary" />
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page social-feed-page">
      {toast && <div className="toast" style={{ zIndex: 1000 }}>{toast}</div>}
      <div className="social-feed-header">
        <h1 className="h1">Campus</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div onClick={() => setShowPostModal(true)} style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Plus size={20} />
          </div>
          <div className="social-feed-nav">
            <span className="caption font-semibold accent-secondary" onClick={() => navigate('/social-groups')}>Groups</span>
          </div>
        </div>
      </div>
      {renderStories()}
      {renderPosts()}

      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ width: '100%', backgroundColor: 'var(--bg-background)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 className="h2">Create Post</h2>
                <div onClick={() => setShowPostModal(false)} style={{ cursor: 'pointer', padding: 4 }}><X size={24} /></div>
              </div>

              <textarea
                autoFocus
                placeholder="What's happening on campus?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                style={{ width: '100%', height: 120, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 16, color: 'var(--text-primary)', fontSize: 16, resize: 'none', marginBottom: 20, outline: 'none' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <ImageIcon size={22} color="var(--text-secondary)" />
                  <Plus size={22} color="var(--text-secondary)" />
                </div>
                <button
                  onClick={handleCreatePost}
                  disabled={isSubmitting || !newPostContent.trim()}
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', borderRadius: 100, gap: 8 }}
                >
                  {isSubmitting ? 'Posting...' : 'Share Post'} <Send size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
