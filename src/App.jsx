import React, { createContext, useContext, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import BottomNav from './components/BottomNav'
import ProtectedRoute from './components/ProtectedRoute';
import OnboardingRoute from './components/OnboardingRoute';
import { FirebaseProvider } from './hooks/useFirebase';

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
import Login from './screens/Login'

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

const ONBOARDING_ROUTES = ['/', '/welcome', '/interests', '/location', '/login'];

export default function App() {
  const location = useLocation();
  const isOnboarding = ONBOARDING_ROUTES.includes(location.pathname);

  return (
    <ThemeProvider>
      <FirebaseProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Splash />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/interests" element={<Interests />} />
            <Route path="/location" element={<LocationPerm />} />
            <Route path="/home" element={<ProtectedRoute><OnboardingRoute><Home /></OnboardingRoute></ProtectedRoute>} />
            <Route path="/ride-search" element={<ProtectedRoute><OnboardingRoute><RideSearch /></OnboardingRoute></ProtectedRoute>} />
            <Route path="/ride-results" element={<ProtectedRoute><OnboardingRoute><RideResults /></OnboardingRoute></ProtectedRoute>} />
            <Route path="/discover" element={<ProtectedRoute><OnboardingRoute><Discover /></OnboardingRoute></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><OnboardingRoute><Events /></OnboardingRoute></ProtectedRoute>} />
            <Route path="/event/:id" element={<ProtectedRoute><OnboardingRoute><EventDetail /></OnboardingRoute></ProtectedRoute>} />
            <Route path="/post-event" element={<ProtectedRoute><OnboardingRoute><PostEvent /></OnboardingRoute></ProtectedRoute>} />
            <Route path="/social" element={<ProtectedRoute><OnboardingRoute><SocialFeed /></OnboardingRoute></ProtectedRoute>} />
            <Route path="/social-explore" element={<ProtectedRoute><OnboardingRoute><SocialExplore /></OnboardingRoute></ProtectedRoute>} />
            <Route path="/social-groups" element={<ProtectedRoute><OnboardingRoute><SocialGroups /></OnboardingRoute></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><OnboardingRoute><Profile /></OnboardingRoute></ProtectedRoute>} />
            <Route path="/ai-planner" element={<ProtectedRoute><OnboardingRoute><AiPlanner /></OnboardingRoute></ProtectedRoute>} />
            <Route path="/ai-planner-result" element={<ProtectedRoute><OnboardingRoute><AiPlannerResult /></OnboardingRoute></ProtectedRoute>} />
            <Route path="/smart-book" element={<ProtectedRoute><OnboardingRoute><SmartBook /></OnboardingRoute></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
        {!isOnboarding && <BottomNav />}
      </FirebaseProvider>
    </ThemeProvider>
  )
}
