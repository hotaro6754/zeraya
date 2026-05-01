import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Plus, AlertTriangle, Inbox } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';

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
  const { user, posts, stories, loading, error, toggleLike } = useFirebase();
  const [toast, setToast] = useState(null);

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

  const renderStories = () => {
    if (loading.stories) return <div className="stories-loading-container">{[...Array(4)].map((_,i) => <div key={i} className="skeleton-story"/>)}</div>;
    if (error.stories) return null;
    
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
    if (loading.posts) return <div className="posts-container">{[...Array(3)].map((_, i) => <Skeleton key={i} />)}</div>;
    if (error.posts) return <div className="error-container"><AlertTriangle size={40} /><p>{error.posts}</p></div>;
    if (posts.length === 0) return <div className="empty-feed-container"><Inbox size={40} /><p>No posts yet. Be the first to share!</p></div>;

    return (
      <div className="posts-container">
        {posts.map((p, i) => {
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
      {toast && <div className="toast">{toast}</div>}
      <div className="social-feed-header">
        <h1 className="h1">Campus</h1>
        <div className="social-feed-nav">
          <span className="caption font-semibold accent-secondary" onClick={() => navigate('/social-groups')}>Groups</span>
          <span className="caption font-semibold text-secondary" onClick={() => navigate('/social-explore')}>Explore</span>
        </div>
      </div>
      {renderStories()}
      {renderPosts()}
    </motion.div>
  );
}
