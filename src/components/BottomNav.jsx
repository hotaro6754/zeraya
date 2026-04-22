import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, Compass, Calendar, User } from 'lucide-react'

const tabs = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/ride-search', icon: Search, label: 'Rides' },
  { path: '/discover', icon: Compass, label: 'Explore' },
  { path: '/events', icon: Calendar, label: 'Events' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav">
      {tabs.map(t => {
        const active = location.pathname.startsWith(t.path)
        return (
          <div
            key={t.path}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(t.path)}
          >
            <t.icon size={22} strokeWidth={active ? 2.2 : 1.6} />
            <span>{t.label}</span>
          </div>
        )
      })}
    </nav>
  )
}
