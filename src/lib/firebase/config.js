import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

let app;

// This try-catch block is a clever way to handle both local development
// and deployment to Firebase Hosting.
try {
  // On Firebase Hosting, the config is automatically provided.
  app = initializeApp({});
} catch (e) {
  // Locally, we use environment variables. The Firebase Emulator will intercept this.
  console.warn("Could not initialize Firebase from hosting config, using environment variables.");
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
  app = initializeApp(firebaseConfig);
}

const analytics = getAnalytics(app);

export { app, analytics };
