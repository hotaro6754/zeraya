import { supabase } from '../lib/supabaseClient'

/**
 * Enhanced Event Service for Zeraya
 * Integrates: Jaipur-local Scraper + Devpost Hackathons
 * Optimized for Speed: Local Caching + Parallel Fetching
 */

const LOCAL_CACHE_KEY = 'zeraya_events_cache'
const CACHE_EXPIRY = 30 * 60 * 1000 // 30 minutes

export const fetchLiveJaipurEvents = async () => {
  // 1. Check Local Memory Cache first (Instant)
  const cached = localStorage.getItem(LOCAL_CACHE_KEY)
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return data
    }
  }

  try {
    // Simulated Parallel Fetch from BMS (Scraper) and Devpost
    const [bmsEvents, devpostEvents] = await Promise.all([
      fetchSimulatedBMS(),
      fetchSimulatedDevpost()
    ])

    const allEvents = [...bmsEvents, ...devpostEvents].sort((a, b) => b.attendees - a.attendees)

    // Update Local Cache
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify({
      data: allEvents,
      timestamp: Date.now()
    }))

    return allEvents
  } catch (error) {
    console.error('Error fetching live events:', error)
    return []
  }
}

const fetchSimulatedBMS = async () => {
  return [
    {
      id: 'jaipur-1',
      title: 'Zakir Khan Live: Jaipur Edition',
      club: 'BMS Live',
      date: 'May 15 • 7:00 PM',
      location: 'Deep Smriti Auditorium, Jaipur',
      attendees: 1540,
      image: 'https://images.unsplash.com/photo-1514525253344-99a30d529d10?w=800&q=80',
      category: 'Cultural',
      description: 'The king of storytelling returns to Jaipur. Sakht Launda brings his newest special for an evening of pure laughter.'
    },
    {
      id: 'jaipur-2',
      title: 'Jaipur Heritage Photo Walk',
      club: 'Photography Club',
      date: 'May 10 • 6:30 AM',
      location: 'Hawa Mahal, Old City',
      attendees: 45,
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
      category: 'Cultural',
      description: 'Capture the sunrise at Hawa Mahal and explore the hidden alleys of the Pink City with expert photographers.'
    }
  ]
}

const fetchSimulatedDevpost = async () => {
  return [
    {
      id: 'dp-1',
      title: 'Smart City Hackathon: Jaipur',
      club: 'Devpost • JECRC',
      date: 'May 5 • 9:00 AM',
      location: 'JECRC Campus, Jaipur',
      attendees: 450,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
      category: 'Hackathons',
      description: 'Build solutions for Jaipur\'s urban challenges. Sponsored by top tech firms. $5000 in prizes.'
    },
    {
      id: 'dp-2',
      title: 'Web3 Bharat: Jaipur Chapter',
      club: 'Devpost • Polygon',
      date: 'May 12 • 10:00 AM',
      location: 'MNIT Jaipur',
      attendees: 210,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
      category: 'Hackathons',
      description: 'A deep dive into decentralization. Learn to build DApps and secure the future of the web.'
    }
  ]
}
