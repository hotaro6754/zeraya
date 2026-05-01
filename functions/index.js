const functions = require("firebase-functions");

// Helper function to calculate distance between two coordinates
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; 
}

exports.getRidePrices = functions.https.onCall((data, context) => {
  const { from, to } = data;
  
  const straightLine = getDistance(from.lat, from.lng, to.lat, to.lng);
  const distance = Math.max(1.2, straightLine * 1.3); // Driving distance estimate
  
  const now = new Date();
  const hours = now.getHours();
  
  // Time-based pricing logic
  const isNight = hours >= 23 || hours < 5;
  const isTraffic = hours >= 17 && hours <= 21;
  const isHeat = hours >= 12 && hours <= 16;

  const rapidoMult = isNight ? 1.25 : (isHeat ? 1.1 : 1.0);
  const olaMult = isNight ? 1.3 : (isHeat ? 1.15 : 1.0);
  const uberMult = isTraffic ? 1.4 : (isNight ? 1.2 : 1.0);

  const calcTime = (baseTime) => Math.round(distance * baseTime);

  const rides = [
    // BIKES
    { id: 'r_bike', platform: 'Rapido', name: 'Bike', type: 'Bikes', icon: '🏍️', color: '#F59E0B', price: Math.round((15 + (distance * 6)) * rapidoMult), time: calcTime(2.5), eta: '3 min', link: 'rapido://' },
    { id: 'o_bike', platform: 'Ola', name: 'Bike', type: 'Bikes', icon: '🏍️', color: '#34D399', price: Math.round((20 + (distance * 7)) * olaMult), time: calcTime(2.5), eta: '5 min', link: 'olacabs://' },
    { id: 'u_moto', platform: 'Uber', name: 'Moto', type: 'Bikes', icon: '🏍️', color: '#3B82F6', price: Math.round((22 + (distance * 7.5)) * uberMult), time: calcTime(2.5), eta: '4 min', link: 'uber://' },
    
    // AUTOS
    { id: 'r_auto', platform: 'Rapido', name: 'Auto', type: 'Autos', icon: '🛺', color: '#F59E0B', price: Math.round((25 + (distance * 10)) * rapidoMult), time: calcTime(3.5), eta: '6 min', link: 'rapido://' },
    { id: 'o_auto', platform: 'Ola', name: 'Auto', type: 'Autos', icon: '🛺', color: '#34D399', price: Math.round((30 + (distance * 11)) * olaMult), time: calcTime(3.5), eta: '4 min', link: 'olacabs://', highlight: true, badge: 'Fastest', badgeClass: 'badge-warning' },
    { id: 'u_auto', platform: 'Uber', name: 'Auto', type: 'Autos', icon: '🛺', color: '#3B82F6', price: Math.round((35 + (distance * 12)) * uberMult), time: calcTime(3.5), eta: '5 min', link: 'uber://' },

    // CABS (MINI/GO)
    { id: 'r_cab', platform: 'Rapido', name: 'Cab', type: 'Cabs', icon: '🚗', color: '#F59E0B', price: Math.round((45 + (distance * 13)) * rapidoMult), time: calcTime(3.5), eta: '8 min', link: 'rapido://' },
    { id: 'o_mini', platform: 'Ola', name: 'Mini', type: 'Cabs', icon: '🚗', color: '#34D399', price: Math.round((50 + (distance * 14)) * olaMult), time: calcTime(3.5), eta: '7 min', link: 'olacabs://' },
    { id: 'u_go', platform: 'Uber', name: 'Go', type: 'Cabs', icon: '🚗', color: '#3B82F6', price: Math.round((45 + (distance * 14)) * uberMult), time: calcTime(3.5), eta: '6 min', link: 'uber://' },

    // PREMIUM CABS
    { id: 'o_prime', platform: 'Ola', name: 'Prime', type: 'Cabs', icon: '🚙', color: '#34D399', price: Math.round((70 + (distance * 16)) * olaMult), time: calcTime(3.5), eta: '10 min', link: 'olacabs://' },
    { id: 'u_prem', platform: 'Uber', name: 'Premier', type: 'Cabs', icon: '🚙', color: '#3B82F6', price: Math.round((80 + (distance * 17)) * uberMult), time: calcTime(3.5), eta: '9 min', link: 'uber://' },
  ].sort((a, b) => a.price - b.price);

  return {
    distanceStr: distance.toFixed(1),
    context: isNight ? "Night Surge" : (isTraffic ? "Peak Traffic" : "Standard Fares"),
    rides: rides,
  };
});

exports.generateTravelPlan = functions.https.onCall((data, context) => {
  // In a real app, you'd use a generative AI API here.
  // For this example, we'll return a hardcoded plan based on the preferences.

  const { destination, days, budget } = data;

  return {
    destination: destination,
    days: days,
    budget: `₹${budget}`,
    vibe: 'Relaxed',
    timeline: [
      {
        day: 1,
        title: 'Arrival & Exploration',
        cost: '₹1,500',
        events: [
          { time: '10:00 AM', title: `Train to ${destination}`, type: 'travel', cost: '₹800' },
          { time: '02:00 PM', title: 'Hotel Check-in', type: 'stay', cost: '₹0 (Prepaid)' },
          { time: '04:00 PM', title: 'Local Market Visit', type: 'activity', cost: '₹200' },
          { time: '08:00 PM', title: 'Dinner at a Local Restaurant', type: 'food', cost: '₹500' },
        ]
      },
      {
        day: 2,
        title: 'Sightseeing & Activities',
        cost: '₹2,000',
        events: [
          { time: '09:00 AM', title: 'Visit a Famous Landmark', type: 'activity', cost: '₹500' },
          { time: '01:00 PM', title: 'Lunch at a Cafe', type: 'food', cost: '₹700' },
          { time: '03:00 PM', title: 'Museum Tour', type: 'activity', cost: '₹300' },
          { time: '07:00 PM', title: 'Evening Show', type: 'activity', cost: '₹500' },
        ]
      }
    ]
  };
});

const auth = require("./auth");
exports.onUserCreate = auth.onUserCreate;
exports.setAdminRole = auth.setAdminRole;
