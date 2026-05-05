import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Wallet, Coffee, Train, Ticket, Utensils, Receipt } from 'lucide-react'

const SUMMARY = [
  { category: 'Food', amount: '₹850', color: 'var(--success)' },
  { category: 'Travel', amount: '₹420', color: 'var(--warning)' },
  { category: 'Events', amount: '₹307', color: 'var(--accent-secondary)' },
]

const RECEIPTS = [
  { id: 1, title: 'Tapri Central', date: 'Today, 2:45 PM', amount: '₹340', category: 'Food', icon: Coffee },
  { id: 2, title: 'Rapido to WTP', date: 'Yesterday', amount: '₹45', category: 'Travel', icon: Train },
  { id: 3, title: 'TEDx Ticket', date: 'Apr 20', amount: '₹250', category: 'Events', icon: Ticket },
  { id: 4, title: 'Canteen Samosa', date: 'Apr 19', amount: '₹30', category: 'Food', icon: Utensils },
  { id: 5, title: 'Uber to Station', date: 'Apr 18', amount: '₹142', category: 'Travel', icon: Train },
]

export default function SmartBook() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = RECEIPTS.filter(r => r.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ paddingTop: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', padding: 4, backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
            <ArrowLeft size={20} color="var(--text-primary)" />
          </div>
          <h1 className="h2">Smart Book</h1>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--accent-primary)', color: 'var(--text-inverse)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Plus size={20} />
        </div>
      </div>

      {/* Main Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: 24,
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: 8 }}>
          <Wallet size={16} />
          <span className="caption" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>This Month</span>
        </div>
        <div style={{ fontSize: 48, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 24, letterSpacing: '-0.02em' }}>
          ₹1,577
        </div>
        
        {/* Progress Bar */}
        <div style={{ width: '100%', height: 8, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-background)', display: 'flex', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ width: '55%', backgroundColor: 'var(--success)' }} />
          <div style={{ width: '25%', backgroundColor: 'var(--warning)' }} />
          <div style={{ width: '20%', backgroundColor: 'var(--accent-secondary)' }} />
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          {SUMMARY.map(s => (
            <div key={s.category} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, justifyContent: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: s.color }} />
                <span className="caption">{s.category}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="section-header">
        <h3 className="h3">Recent Receipts</h3>
      </div>

      <input 
        className="input" 
        placeholder="Search merchants, amounts..." 
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="card-interactive"
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '16px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-background)', border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <r.icon size={20} color="var(--text-secondary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{r.title}</div>
              <div className="caption" style={{ marginTop: 2 }}>{r.date}</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {r.amount}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
