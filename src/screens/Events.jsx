import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Filter, Plus, AlertTriangle, Inbox } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const TABS = ['All', 'Today', 'Hackathons', 'Cultural', 'Sports'];

export default function Events() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const eventsCollection = collection(db, 'events');
      const eventSnapshot = await getDocs(eventsCollection);
      if (eventSnapshot.empty) {
        setEvents([]);
      } else {
        const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventList);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Couldn't load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleJoinToggle = async (e, eventId, isJoined) => {
    e.stopPropagation();
    if (!user) {
      setToast("Please log in to join events");
      setTimeout(() => setToast(null), 2500);
      return;
    }

    const eventRef = doc(db, 'events', eventId);
    try {
      await updateDoc(eventRef, {
        joinedBy: isJoined ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
      // Optimistically update the UI
      setEvents(prevEvents => prevEvents.map(event => 
        event.id === eventId ? {
          ...event,
          joinedBy: isJoined 
            ? event.joinedBy.filter(uid => uid !== user.uid) 
            : [...(event.joinedBy || []), user.uid],
          attendees: isJoined ? event.attendees -1 : event.attendees + 1
        } : event
      ));
      setToast(isJoined ? "You've left the event" : "You're in! 🎉");
      setTimeout(() => setToast(null), 2500);
    } catch (error) {
      console.error("Error updating event:", error);
      setToast("Something went wrong. Please try again.");
      setTimeout(() => setToast(null), 2500);
    }
  };

  const filteredEvents = activeTab === 'All' 
    ? events 
    : events.filter(e => e.category.toLowerCase() === activeTab.toLowerCase());

  const renderContent = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', marginTop: 50, color: 'var(--text-secondary)' }}>Loading events...</div>;
    }

    if (error) {
      return (
        <div style={{ textAlign: 'center', marginTop: 50, color: 'var(--danger)' }}>
          <AlertTriangle size={40} style={{ marginBottom: 10 }} />
          <p>{error}</p>
        </div>
      );
    }

    if (filteredEvents.length === 0) {
      return (
        <div style={{ textAlign: 'center', marginTop: 50, color: 'var(--text-tertiary)' }}>
          <Inbox size={40} style={{ marginBottom: 10 }} />
          <p>No events found for this category.</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredEvents.map((e, i) => {
          const isJoined = user && e.joinedBy && e.joinedBy.includes(user.uid);
          return (
            <motion.div
              key={e.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => navigate(`/event/${e.id}`)}
              className="card-interactive"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ height: 140, backgroundImage: `url(${e.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, right: 12, backgroundColor: 'var(--bg-glass)', backdropFilter: 'blur(10px)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {e.category}
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <div className="caption" style={{ color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: 4 }}>{e.club}</div>
                <h3 className="h3" style={{ marginBottom: 12 }}>{e.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                    <Calendar size={14} />
                    <span className="body-sm">{new Date(e.date.seconds * 1000).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                    <MapPin size={14} />
                    <span className="body-sm">{e.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                    <Users size={14} />
                    <span className="mono">{e.attendees} going</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(ev) => handleJoinToggle(ev, e.id, isJoined)}
                  className="btn btn-full"
                  style={{
                    marginTop: 16,
                    background: isJoined ? 'var(--bg-card-hover)' : 'var(--grad)',
                    color: isJoined ? 'var(--text-tertiary)' : '#EDE9FF',
                    border: isJoined ? '1px solid var(--border-subtle)' : 'none'
                  }}
                >
                  {isJoined ? '✓ Joined' : 'Join Event'}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="page" style={{ paddingTop: 16 }}>
      {toast && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          style={{
            position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--bg-glass)', backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-strong)', padding: '12px 24px',
            borderRadius: '100px', color: 'var(--text-primary)', zIndex: 1000,
            boxShadow: 'var(--shadow-md)', fontWeight: 600
          }}
        >
          {toast}
        </motion.div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="h1">Events</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
            <Filter size={18} color="var(--text-primary)" />
          </div>
          <div onClick={() => navigate('/post-event')} style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--accent-primary)', color: 'var(--text-inverse)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
            <Plus size={20} />
          </div>
        </div>
      </div>
      <div className="tab-bar" style={{ marginBottom: 24 }}>
        {TABS.map(t => (
          <div key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t}
          </div>
        ))}
      </div>
      {renderContent()}
    </motion.div>
  );
}
