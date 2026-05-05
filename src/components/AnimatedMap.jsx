import React, { useState, useEffect, useMemo, useRef } from 'react'
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import * as turf from '@turf/turf'
import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'

// Maplibre vector style (Dark Matter)
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

// Global Route Cache for instant load
const routeCache = new Map()

export default function AnimatedMap({ from, to }) {
  const [viewState, setViewState] = useState({
    longitude: (from.lng + to.lng) / 2,
    latitude: (from.lat + to.lat) / 2,
    zoom: 12.5,
    pitch: 60, // Start in 3D Mode
    bearing: -15
  })

  const [is3D, setIs3D] = useState(true)
  const [carPosition, setCarPosition] = useState([from.lng, from.lat])
  const animationRef = useRef(null)

  const [routeData, setRouteData] = useState(null)

  // Fetch real route from OSRM (Optimized with Cache)
  useEffect(() => {
    const fetchRoute = async () => {
      const cacheKey = `${from.lng},${from.lat};${to.lng},${to.lat}`
      if (routeCache.has(cacheKey)) {
        setRouteData(routeCache.get(cacheKey))
        return
      }

      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${cacheKey}?overview=full&geometries=geojson`
        )
        const data = await response.json()
        if (data.routes && data.routes.length > 0) {
          const geom = data.routes[0].geometry
          setRouteData(geom)
          routeCache.set(cacheKey, geom)
        }
      } catch (error) {
        console.warn('OSRM error, using straight line fallback', error)
        // Fallback to straight line for zero-latency
        const fallback = {
          type: 'LineString',
          coordinates: [[from.lng, from.lat], [to.lng, to.lat]]
        }
        setRouteData(fallback)
      }
    }
    fetchRoute()
  }, [from, to])

  // Animate Car along route
  useEffect(() => {
    if (!routeData) return

    const totalPoints = routeData.coordinates.length
    let currentPoint = 0

    const animate = () => {
      currentPoint = (currentPoint + 2) % totalPoints // Double speed for "Faster" feel
      setCarPosition(routeData.coordinates[currentPoint])
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [routeData])

  const toggle3D = () => {
    setIs3D(!is3D)
  }

  // Smooth camera transition when toggling modes
  useEffect(() => {
    setViewState(prev => ({
      ...prev,
      pitch: is3D ? 60 : 0,
      bearing: is3D ? -15 : 0,
      transitionDuration: 1000,
    }))
  }, [is3D])

  return (
    <div style={{ position: 'relative', width: '100%', height: 260, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={MAP_STYLE}
        interactive={true}
        dragPan={true}
        scrollZoom={false}
      >
        {/* Glow Line Route (Real OSRM Route) */}
        {routeData && (
          <Source id="route" type="geojson" data={{ type: 'Feature', geometry: routeData }}>
            <Layer
              id="route-glow-1"
              type="line"
              paint={{
                'line-color': '#A78BFA',
                'line-width': 12,
                'line-opacity': 0.15,
                'line-blur': 8
              }}
            />
            <Layer
              id="route-glow-2"
              type="line"
              paint={{
                'line-color': '#8B5CF6',
                'line-width': 6,
                'line-opacity': 0.4,
                'line-blur': 4
              }}
            />
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': '#FFFFFF',
                'line-width': 2,
              }}
            />
          </Source>
        )}

        {/* Start Point (Uber-clone Origin Pulse) */}
        <Marker longitude={from.lng} latitude={from.lat} anchor="center">
          <div style={{ position: 'relative', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: 'absolute', width: '100%', height: '100%',
                borderRadius: '50%', backgroundColor: '#FFFFFF'
              }}
            />
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              backgroundColor: '#000000', border: '2px solid #FFFFFF', zIndex: 1
            }} />
          </div>
        </Marker>

        {/* End Point (Destination Pin) */}
        <Marker longitude={to.lng} latitude={to.lat} anchor="bottom">
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            backgroundColor: 'var(--accent-secondary)', border: '4px solid #130F35',
            boxShadow: '0 0 20px var(--accent-secondary)'
          }} />
        </Marker>

        {/* Animated Vehicle Node */}
        <Marker longitude={carPosition[0]} latitude={carPosition[1]} anchor="center">
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%',
              backgroundColor: 'var(--accent-primary)',
              boxShadow: '0 0 15px var(--accent-primary), 0 0 30px var(--accent-primary)'
            }} />
          </div>
        </Marker>
      </Map>

      {/* 2D/3D Toggle UI */}
      <motion.div 
        whileTap={{ scale: 0.95 }}
        onClick={toggle3D}
        style={{
          position: 'absolute', top: 12, right: 12, zIndex: 10,
          backgroundColor: 'var(--bg-surface)', padding: '6px 12px',
          borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <Layers size={14} color="var(--text-secondary)" />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
          {is3D ? '3D Mode' : '2D Mode'}
        </span>
      </motion.div>
    </div>
  )
}
