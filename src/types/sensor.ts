export interface SensorData {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  lastFlowDetected: Date | null;
  flowDetected: boolean;
  status: 'Active' | 'Inactive' | 'warning';
  tankLevel: number;
  state: string;
  lga: string;
  owner: String;
  type: String;
  capacity: String;
}

export interface FirestoreSensorReading {
  sensorId: string;
  timestamp: { seconds: number; nanoseconds: number };
  flowDetected: boolean;
  value?: number;
}
