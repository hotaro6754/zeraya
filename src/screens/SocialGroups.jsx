import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, ShieldCheck } from 'lucide-react'

const GROUPS = [
  { id: 1, name: 'Maharani Connect', members: '2.4k', desc: 'Main college group for announcements', type: 'Official' },
  { id: 2, name: 'UI/UX Enthusiasts', members: '156', desc: 'Design resources and feedback', type: 'Club' },
  { id: 3, name: 'Jaipur Hackers', members: '840', desc: 'Coding, hackathons, web3', type: 'Community' },
  { id: 4, name: 'Thrift Finds', members: '430', desc: 'Buy/sell books, clothes, tech', type: 'Market' },
]

export default function SocialGroups() {
  const navigate = useNavigate()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ paddingTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', padding: 4, backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
            <ArrowLeft size={20} color="var(--text-primary)" />
          </div>
          <h1 className="h2">Campus Groups</h1>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {GROUPS.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="card-interactive"
            style={{
              padding: 16,
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-background)', border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {g.type === 'Official' ? <ShieldCheck size={20} color="var(--accent-secondary)" /> : <Users size={20} color="var(--text-secondary)" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{g.name}</div>
                <span className="badge badge-neutral" style={{ fontSize: 10, padding: '2px 6px' }}>{g.type}</span>
              </div>
              <div className="caption" style={{ marginBottom: 4 }}>{g.desc}</div>
              <div className="caption" style={{ color: 'var(--text-secondary)' }}>{g.members} members</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
