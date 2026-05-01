/**
 * @license
 * Copyright 2022 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file is used to seed the Firestore database with initial data.
 * It can be run from the command line using `node seed.js`
 */

// To use this script, you must first set up your Firebase project and
// install the Firebase Admin SDK. For more information, see
// https://firebase.google.com/docs/admin/setup

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zeraya-11771113.firebaseio.com"
});

const db = admin.firestore();

const events = [
  { 
    id: 1, 
    title: 'TEDx Maharani College', 
    club: 'TEDx Club',
    date: 'Apr 28 • 10:00 AM', 
    location: 'Main Auditorium', 
    attendees: 234,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', 
    category: 'Cultural',
    description: 'Join us for an inspiring afternoon of ideas worth spreading. TEDx Maharani College brings together thought leaders, innovators, and changemakers from across Rajasthan. This year\'s theme: "Breaking Boundaries" — featuring 8 speakers, live performances, and networking.',
    speakers: [
      { img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80', name: 'Dr. Pooja Sharma' },
      { img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', name: 'Rohit Verma' },
      { img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', name: 'Anita Joshi' },
    ]
  },
  { 
    id: 2, 
    title: 'Web3 Startup Pitch', 
    club: 'E-Cell',
    date: 'May 3 • 2:00 PM', 
    location: 'Incubation Center', 
    attendees: 89,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=800&q=80', 
    category: 'Hackathons',
    description: 'Pitch your Web3 startup idea to top VCs and angel investors. Learn about decentralized architecture, tokenomics, and securing funding. The winning team receives $10k in platform credits.',
    speakers: [
      { img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', name: 'Kabir Singh' },
      { img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80', name: 'Sarah Lee' }
    ]
  },
  { 
    id: 3, 
    title: 'Inter-College Football', 
    club: 'Sports Council',
    date: 'May 5 • 4:00 PM', 
    location: 'University Ground', 
    attendees: 412,
    image: 'https://images.unsplash.com/photo-1518605368461-1e1e12799c6c?w=800&q=80', 
    category: 'Sports',
    description: 'The biggest sports rivalry of the season is here! Watch our college take on the defending champions. Food stalls, halftime shows, and high energy guaranteed. Wear your college colors!',
    speakers: [
      { img: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&q=80', name: 'Coach Dev' }
    ]
  },
  { 
    id: 4, 
    title: 'Open Mic Night', 
    club: 'Literature Society',
    date: 'May 10 • 6:00 PM', 
    location: 'Open Air Theatre', 
    attendees: 156,
    image: 'https://images.unsplash.com/photo-1525926477800-7a3adbc8682a?w=800&q=80', 
    category: 'Cultural',
    description: 'Poetry, stand-up comedy, acoustic music, and spoken word. The stage is yours. Come perform or just enjoy an evening under the stars with hot chai and great vibes.',
    speakers: [
      { img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', name: 'Riya Patel' },
      { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', name: 'Amit Jain' }
    ]
  },
]

const posts = [
  {
    id: 1,
    user: 'Design Club',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80',
    time: '2h ago',
    content: 'Just wrapped up our UI/UX workshop! Thanks to everyone who attended. Next week we dive into Framer. 🎨✨',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80',
    likes: 124,
    comments: 18
  },
  {
    id: 2,
    user: 'Karan Singh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    time: '5h ago',
    content: 'Anyone heading to WTP from campus right now? Looking to split an auto.',
    likes: 5,
    comments: 2
  }
]

const stories = [
  {
    id: 1,
    user: 'Riya',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    hasUnseen: true
  },
  {
    id: 2,
    user: 'Karan',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    hasUnseen: true
  },
  {
    id: 3,
    user: 'Amit',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    hasUnseen: false
  },
  {
    id: 4,
    user: 'Priya',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    hasUnseen: false
  }
]


async function seed() {
  // Seed events
  for (const event of events) {
    await db.collection("events").add(event);
  }

  // Seed posts
  for (const post of posts) {
    await db.collection("posts").add(post);
  }

  // Seed stories
  for (const story of stories) {
    await db.collection("stories").add(story);
  }

  console.log("Seeding complete!");
}

seed();
