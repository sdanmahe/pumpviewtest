export interface SensorData {
  id: string;
  community: string;
  location: {
    lat: number;
    lng: number;
  };
  lastFlowDetected: Date | null;
  flowDetected: boolean;
  status: 'Active' | 'Inactive' | 'Warning';
  tank_level: number;
  state: string;
  lga: string;
  ownership: String;
  type: String;
  capacity: String;
  lastknownStat: string;
}

export interface FirestoreSensorReading {
  sensorId: string;
  timestamp: { seconds: number; nanoseconds: number };
  flowDetected: boolean;
  value?: number;
}
