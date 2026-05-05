import React, { createContext, useContext, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import BottomNav from './components/BottomNav'

// Screens
import Splash from './screens/Splash'
import Welcome from './screens/Welcome'
import Interests from './screens/Interests'
import LocationPerm from './screens/LocationPerm'
import Home from './screens/Home'
import RideSearch from './screens/RideSearch'
import RideResults from './screens/RideResults'
import Discover from './screens/Discover'
import Events from './screens/Events'
import EventDetail from './screens/EventDetail'
import PostEvent from './screens/PostEvent'
import SocialFeed from './screens/SocialFeed'
import SocialExplore from './screens/SocialExplore'
import SocialGroups from './screens/SocialGroups'
import Profile from './screens/Profile'
import AiPlanner from './screens/AiPlanner'
import AiPlannerResult from './screens/AiPlannerResult'
import SmartBook from './screens/SmartBook'

// Theme Context
const ThemeContext = createContext()
export const useTheme = () => useContext(ThemeContext)

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('zeraya-theme')
    if (saved) return saved
    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('zeraya-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

const ONBOARDING = ['/', '/welcome', '/interests', '/location']

export default function App() {
  const location = useLocation()
  const isOnboarding = ONBOARDING.includes(location.pathname)

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Splash />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/location" element={<LocationPerm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/ride-search" element={<RideSearch />} />
          <Route path="/ride-results" element={<RideResults />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/post-event" element={<PostEvent />} />
          <Route path="/social" element={<SocialFeed />} />
          <Route path="/social-explore" element={<SocialExplore />} />
          <Route path="/social-groups" element={<SocialGroups />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ai-planner" element={<AiPlanner />} />
          <Route path="/ai-planner-result" element={<AiPlannerResult />} />
          <Route path="/smart-book" element={<SmartBook />} />
        </Routes>
      </AnimatePresence>
      {!isOnboarding && <BottomNav />}
    </ThemeProvider>
  )
}
