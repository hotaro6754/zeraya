import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, MoreHorizontal, Plus } from 'lucide-react'

const STORIES = [
  { id: 1, user: 'Your Story', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', isAdd: true },
  { id: 2, user: 'Neha', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', hasUnseen: true },
  { id: 3, user: 'E-Cell', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=100&q=80', hasUnseen: true },
  { id: 4, user: 'Rahul', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', hasUnseen: false },
]

const POSTS = [
  {
    id: 1,
    user: 'Design Club',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80',
    time: '2h ago',
    content: 'Just wrapped up our UI/UX workshop! Thanks to everyone who attended. Next week we dive into Framer. 🎨✨',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80',
    likes: 124,
    comments: 18
  },
  {
    id: 2,
    user: 'Karan Singh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    time: '5h ago',
    content: 'Anyone heading to WTP from campus right now? Looking to split an auto.',
    likes: 5,
    comments: 2
  }
]

export default function SocialFeed() {
  const navigate = useNavigate()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ padding: '16px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: '0 16px' }}>
        <h1 className="h1">Campus</h1>
        <div style={{ display: 'flex', gap: 16 }}>
          <span className="caption" onClick={() => navigate('/social-groups')} style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>Groups</span>
          <span className="caption" onClick={() => navigate('/social-explore')} style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Explore</span>
        </div>
      </div>

      {/* Stories */}
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '0 16px 20px', scrollbarWidth: 'none' }}>
        {STORIES.map((s, i) => (
          <motion.div key={s.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{
              position: 'relative', width: 64, height: 64, borderRadius: '50%',
              padding: 2, background: s.hasUnseen ? 'var(--text-primary)' : 'var(--border-subtle)'
            }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2px solid var(--bg-background)', overflow: 'hidden', backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              {s.isAdd && (
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--accent-secondary)', color: 'var(--text-inverse)', border: '2px solid var(--bg-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={14} />
                </div>
              )}
            </div>
            <span className="caption" style={{ color: s.isAdd ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.user}</span>
          </motion.div>
        ))}
      </div>

      {/* Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
        {POSTS.map((p, i) => (
          <motion.div key={p.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            
            <div style={{ padding: '16px 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundImage: `url(${p.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--border-subtle)' }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{p.user}</div>
                  <div className="caption">{p.time}</div>
                </div>
              </div>
              <MoreHorizontal size={20} color="var(--text-tertiary)" />
            </div>

            <div style={{ padding: '0 16px 16px', fontSize: 15, lineHeight: 1.5, color: 'var(--text-primary)' }}>
              {p.content}
            </div>

            {p.image && (
              <div style={{ width: '100%', height: 250, backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            )}

            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: p.image ? 'none' : '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                  <Heart size={20} /> <span className="caption" style={{ fontWeight: 600 }}>{p.likes}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                  <MessageCircle size={20} /> <span className="caption" style={{ fontWeight: 600 }}>{p.comments}</span>
                </div>
              </div>
              <Share2 size={20} color="var(--text-secondary)" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
