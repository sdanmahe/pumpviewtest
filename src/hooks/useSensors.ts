import { useState, useEffect, useCallback } from 'react';
import { db, collection, query, onSnapshot, getDocs } from '@/config/firebase';
import type { SensorData } from '@/types/sensor';
import { isAfter, subHours } from 'date-fns';

// Demo sensor data for when Firebase is not configured
const DEMO_SENSORS: SensorData[] = [
  {
    id: 'S01T01D001',
    community: 'Demo Sensor 1',
    location: { lat: 12.6921, lng: 5.0043 },
    lastFlowDetected: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    flowDetected: true,
    status: 'Active',
    tank_level: 85,
    state: 'Sokoto',
    lga: 'Yabo',
    ownership: 'GHI/USAID',
    type: 'Solar Powered',
    capacity: '15m3'
  },
  {
    id: 'S01T02D001',
    community: 'Demo Sensor 2',
    location: { lat: 13.4694, lng: 5.1435 },
    lastFlowDetected: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
    flowDetected: false,
    status: 'Active',
    tank_level: 62,
    state: 'Sokoto',
    lga: 'Yabo',
    ownership: 'GHI/USAID',
    type: 'Solar Powered',
    capacity: '15m3'
  },
  {
    id: 'sensor-003',
    community: 'Basement Leak Detector',
    location: { lat: 12.1810, lng: 4.0926 },
    lastFlowDetected: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    flowDetected: true,
    status: 'warning',
    tank_level: 45,
    state: 'Sokoto',
    lga: 'Yabo',
    ownership: 'GHI/USAID',
    type: 'Solar Powered',
    capacity: '15m3',
  },
];

export function useSensors() {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDemoData, setUsingDemoData] = useState(false);

  const checkFlowInLast24Hours = useCallback((lastFlowDate: Date | null): boolean => {
    if (!lastFlowDate) return false;
    const twentyFourHoursAgo = subHours(new Date(), 24);
    return isAfter(lastFlowDate, twentyFourHoursAgo);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Check if Firebase is properly configured
    const isFirebaseConfigured = 
      import.meta.env.VITE_FIREBASE_API_KEY && 
      import.meta.env.VITE_FIREBASE_API_KEY !== '';

    if (!isFirebaseConfigured) {
      console.log('Firebase not configured, using demo data');
      setSensors(DEMO_SENSORS);
      setUsingDemoData(true);
      setLoading(false);
      return;
    }

    try {
      // Query for sensors collection
         const sensorsRef = collection(db,  `${import.meta.env.VITE_FIREBASE_COLLECTION_NAME || 'sensors'}`);
      const sensorsQuery = query(sensorsRef);

      const unsubscribe = onSnapshot(
        sensorsQuery,
        (snapshot) => {
          const sensorsData: SensorData[] = [];

          snapshot.forEach((doc) => {
            const data = doc.data();
            const lastFlowDate = data.lastFlowDetected?.toDate?.() || 
                                (data.lastFlowDetected ? new Date(data.lastFlowDetected) : null);
            
            sensorsData.push({
              id: doc.id,
              community: data.community || `Sensor ${doc.id}`,
              location: {
                lat: data.location?.lat || 0,
                lng: data.location?.lng || 0,
              },
              lastFlowDetected: lastFlowDate,
              flowDetected: checkFlowInLast24Hours(lastFlowDate),
              status: data.status,
              tank_level: data.tank_level,
              state: data.state,
              lga: data.lga,
              ownership: data.ownership,
              type: data.borehole_type,
              capacity: data.storage_capacity
            });
          });

          setSensors(sensorsData);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching sensors:', err);
          setError('Failed to fetch sensor data. Using demo data.');
          setSensors(DEMO_SENSORS);
          setUsingDemoData(true);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up Firestore listener:', err);
      setError('Failed to connect to Firestore. Using demo data.');
      setSensors(DEMO_SENSORS);
      setUsingDemoData(true);
      setLoading(false);
    }
  }, [checkFlowInLast24Hours]);

  // Function to manually refresh sensor data
  const refreshSensors = useCallback(async () => {
    setLoading(true);
    try {
      const sensorsRef = collection(db, `${import.meta.env.VITE_FIREBASE_COLLECTION_NAME || 'sensors'}`);
      const snapshot = await getDocs(sensorsRef);
      
      const sensorsData: SensorData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const lastFlowDate = data.lastFlowDetected?.toDate?.() || 
                            (data.lastFlowDetected ? new Date(data.lastFlowDetected) : null);
        
        sensorsData.push({
          id: doc.id,
          community: data.community || `Sensor ${doc.id}`,
          location: {
            lat: data.location?.lat || 0,
            lng: data.location?.lng || 0,
          },
          lastFlowDetected: lastFlowDate,
          flowDetected: checkFlowInLast24Hours(lastFlowDate),
          status: data.status,
          tank_level: data.tank_level,
          state: data.state,
          lga: data.lga,
          ownership: data.ownership,
          type: data.borehole_type,
          capacity: data.storage_capacity
        });
      });

      setSensors(sensorsData);
    } catch (err) {
      console.error('Error refreshing sensors:', err);
    } finally {
      setLoading(false);
    }
  }, [checkFlowInLast24Hours]);

  return { sensors, loading, error, usingDemoData, refreshSensors };
}
