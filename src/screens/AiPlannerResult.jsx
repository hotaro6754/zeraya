import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Share, Train, Utensils, Camera, Building } from 'lucide-react';
import generateTravelPlan from '../utils/generateTravelPlan';
import MathCurveLoader from '../components/MathCurveLoader';

const ICONS = {
  travel: Train,
  food: Utensils,
  activity: Camera,
  stay: Building,
};

const getFallbackPlan = (preferences) => ({
    destination: preferences.destination || 'Udaipur',
    days: preferences.days || 2,
    budget: `₹${preferences.budget || '4,000'}`,
    vibe: preferences.vibe || 'Chill',
    timeline: [
      {
        day: 1,
        title: 'Arrival & Exploration',
        cost: '₹1,500',
        events: [
          { time: '10:00 AM', title: `Travel to ${preferences.destination || 'Udaipur'}`, type: 'travel', cost: '₹800' },
          { time: '02:00 PM', title: 'Hotel Check-in', type: 'stay', cost: '₹0' },
          { time: '04:00 PM', title: 'Local Market Visit', type: 'activity', cost: '₹200' },
          { time: '08:00 PM', title: 'Dinner', type: 'food', cost: '₹500' },
        ]
      }
    ]
});

export default function AiPlannerResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { preferences } = location.state || {};

  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!preferences) {
        setIsLoading(false);
        return;
      }
      try {
        const result = await generateTravelPlan(preferences);
        setPlan(result.data);
      } catch (error) {
        console.warn('AI generation failed, using fallback:', error);
        setPlan(getFallbackPlan(preferences));
        setUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [preferences]);

  if (isLoading) return <MathCurveLoader message="Building your hyper-personalized AI itinerary..." />;
  if (!plan) return <div className="page centered"><p>No plan found.</p><button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" style={{ paddingTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', padding: 4, backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}><ArrowLeft size={20} color="var(--text-primary)" /></div>
          <h1 className="h2">{plan.destination}</h1>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}><Share size={18} color="var(--text-primary)" /></div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: 32, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
          <div>
            <div className="caption" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: 4 }}>
              <Sparkles size={12} /> AI GENERATED {usingFallback && "(SIMULATED)"}
            </div>
            <h2 className="h3">{plan.days} Days • {plan.vibe}</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="caption" style={{ marginBottom: 4 }}>Total Est.</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{plan.budget}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary btn-full btn-sm">Save Itinerary</button>
          <button className="btn btn-secondary btn-full btn-sm">Invite Friends</button>
        </div>
      </div>

      <div style={{ paddingLeft: 8 }}>
        {plan.timeline.map((day, dIdx) => (
          <div key={dIdx} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--text-primary)', color: 'var(--bg-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{day.day}</div>
                <h3 className="h3">{day.title}</h3>
              </div>
              <span className="caption" style={{ fontWeight: 600 }}>{day.cost}</span>
            </div>

            <div style={{ position: 'relative', paddingLeft: 15 }}>
              <div style={{ position: 'absolute', left: 15, top: 20, bottom: -20, width: 2, backgroundColor: 'var(--border-subtle)' }} />
              {day.events.map((e, i) => {
                const Icon = ICONS[e.type] || Sparkles;
                return (
                  <motion.div
                    key={i}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: (dIdx * 0.2) + (i * 0.1) }}
                    style={{ position: 'relative', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px', marginLeft: 24, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-sm)' }}
                  >
                    <div style={{ position: 'absolute', left: -29, top: 24, width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--accent-secondary)', border: '2px solid var(--bg-background)' }} />
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}><Icon size={18} color="var(--text-secondary)" /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{e.title}</div>
                      <div className="caption">{e.time}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{e.cost}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
