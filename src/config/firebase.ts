import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, limit, onSnapshot, Timestamp, getDocs } from 'firebase/firestore';

// Your Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCUPtze-5dLtL3SSYB_K7PkMOdU9CQI6wg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'pumpview-test.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'pumpview-test',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'pumpview-test.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '989791719593',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:989791719593:web:f353636c49bd2f643459b8'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export { collection, query, where, orderBy, limit, onSnapshot, Timestamp, getDocs };
export default app;


