import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import type { SensorData } from '@/types/sensor';
import { Droplets, Clock, Battery, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SensorMapProps {
  sensors: SensorData[];
  apiKey?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 12.44944,
  lng: 4.19333,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
};

// Water droplet SVG icon as data URI
const getWaterDropIcon = (color: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
      <defs>
        <linearGradient id="dropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" 
            fill="url(#dropGrad)" 
            stroke="white" 
            stroke-width="1.5"
            filter="url(#shadow)"/>
      <ellipse cx="12" cy="8" rx="3" ry="4" fill="rgba(255,255,255,0.4)"/>
    </svg>
  `;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(36, 36),
    anchor: new google.maps.Point(18, 36),
    labelOrigin: new google.maps.Point(18, 12),
  };
};

// Custom marker icons based on flow status - water droplet icons
const getMarkerIcon = (flowDetected: boolean, status: string) => {
  // Different colors for different statuses
  if(status.includes('warning')) return getWaterDropIcon('#F59E0B '); // yellow
  if (status === 'Inactive') return getWaterDropIcon('#9CA3AF'); // Gray
  if (flowDetected) return getWaterDropIcon('#3B82F6'); // Blue
  return getWaterDropIcon('#22C55E'); // Green
};

export const SensorMap: React.FC<SensorMapProps> = ({ sensors, apiKey }) => {
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || '',
    libraries: ['places'],
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    // Fit bounds to include all sensors if there are any
    if (sensors.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      sensors.forEach((sensor) => {
        bounds.extend({ lat: sensor.location.lat, lng: sensor.location.lng });
      });
      map.fitBounds(bounds);
      
      // Don't zoom in too far
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom()! > 15) {
          map.setZoom(15);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }, [sensors]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Failed to load Google Maps</p>
          <p className="text-sm text-gray-500 mt-1">Please check your API key configuration</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  // Calculate map center based on sensors
  const center = sensors.length > 0 
    ? { 
        lat: sensors.reduce((sum, s) => sum + s.location.lat, 0) / sensors.length,
        lng: sensors.reduce((sum, s) => sum + s.location.lng, 0) / sensors.length,
      }
    : defaultCenter;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
      options={mapOptions}
      onLoad={onMapLoad}
    >
      {sensors.map((sensor) => (
        <Marker
          key={sensor.id}
          position={{ lat: sensor.location.lat, lng: sensor.location.lng }}
          icon={getMarkerIcon(sensor.flowDetected, sensor.status)}
          onClick={() => setSelectedSensor(sensor)}
          title={sensor.name}
        />
      ))}

      {selectedSensor && (
        <InfoWindow
          position={{ lat: selectedSensor.location.lat, lng: selectedSensor.location.lng }}
          onCloseClick={() => setSelectedSensor(null)}
        >
          <div className="p-2 min-w-[200px]">
            <h3 className="font-semibold text-gray-900 mb-2">{selectedSensor.name}</h3>
            
            <div className="space-y-2">
              {/* Flow Status */}
              <div className="flex items-center gap-2">
                <Droplets className={`w-4 h-4 ${selectedSensor.flowDetected ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className="text-sm">
                  {selectedSensor.flowDetected ? (
                    <span className="text-blue-600 font-medium">Flow detected (24h)</span>
                  ) : (
                    <span className="text-gray-500">No flow (24h)</span>
                  )}
                </span>
              </div>

              {/* Last Detection */}
              {selectedSensor.lastFlowDetected && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Last: {formatDistanceToNow(selectedSensor.lastFlowDetected, { addSuffix: true })}
                  </span>
                </div>
              )}

              {/* Battery Level */}
              {selectedSensor.batteryLevel !== undefined && (
                <div className="flex items-center gap-2">
                  <Battery className={`w-4 h-4 ${
                    selectedSensor.batteryLevel > 50 ? 'text-green-500' : 
                    selectedSensor.batteryLevel > 20 ? 'text-yellow-500' : 'text-red-500'
                  }`} />
                  <span className="text-sm text-gray-600">
                    Battery: {selectedSensor.batteryLevel}%
                  </span>
                </div>
              )}

              {/* Status Badge */}
              <div className="mt-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedSensor.status === 'Active' ? 'bg-green-100 text-green-800' :
                  selectedSensor.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedSensor.status}
                </span>
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default SensorMap;
