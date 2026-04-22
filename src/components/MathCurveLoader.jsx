import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function MathCurveLoader({ message = "Searching..." }) {
  const [path, setPath] = useState('')

  // Generate Lemniscate of Bernoulli (Infinity Curve)
  useEffect(() => {
    const points = []
    const a = 60 // Scale
    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
      // Parametric equations for Lemniscate
      const x = (a * Math.sqrt(2) * Math.cos(t)) / (Math.sin(t) ** 2 + 1)
      const y = (a * Math.sqrt(2) * Math.cos(t) * Math.sin(t)) / (Math.sin(t) ** 2 + 1)
      // Offset to center (100, 100)
      points.push(`${x + 100},${y + 100}`)
    }
    // Close the path
    points.push(points[0])
    setPath(`M ${points.join(' L ')}`)
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', width: '100%', minHeight: 400
    }}>
      <div style={{ position: 'relative', width: 200, height: 200 }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 0 8px var(--accent-secondary))' }}>
          {/* Base Track */}
          <path 
            d={path} 
            fill="none" 
            stroke="var(--border-subtle)" 
            strokeWidth="2" 
          />
          {/* Animated Glow Line */}
          {path && (
            <motion.path
              d={path}
              fill="none"
              stroke="var(--accent-secondary)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={{ 
                pathLength: [0, 0.25, 0.25, 0],
                pathOffset: [0, 0, 1, 1] 
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          )}
        </svg>
        
        {/* Pulsing Center Node */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 8, height: 8, borderRadius: '50%',
            backgroundColor: 'var(--accent-primary)',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 12px var(--accent-primary)'
          }}
        />
      </div>
      
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ marginTop: 24, fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}
      >
        {message}
      </motion.div>
    </div>
  )
}
