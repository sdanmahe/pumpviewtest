export interface SensorData {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  lastFlowDetected: Date | null;
  flowDetected: boolean;
  status: 'online' | 'offline' | 'warning';
  batteryLevel?: number;
}

export interface FirestoreSensorReading {
  sensorId: string;
  timestamp: { seconds: number; nanoseconds: number };
  flowDetected: boolean;
  value?: number;
}
