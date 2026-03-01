import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import type { SensorData } from '@/types/sensor';
import { Droplets, Clock, Cylinder, MapPin } from 'lucide-react';
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

// Helper function to create marker icon
const createMarkerIcon = (color: string) => {
  if (typeof window === 'undefined' || !window.google) return undefined;
  
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
            strokeWidth="1.5"
            filter="url(#shadow)"/>
      <ellipse cx="12" cy="8" rx="3" ry="4" fill="rgba(255,255,255,0.4)"/>
    </svg>
  `;
  
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(36, 36),
    anchor: new window.google.maps.Point(18, 36),
    labelOrigin: new window.google.maps.Point(18, 12),
  };
};

// Custom marker icons based on flow status - water droplet icons
const getMarkerIcon = (sensor: SensorData) => {
  // Different colors for different statuses
  if (sensor.status?.includes('Warning')) {
    return createMarkerIcon('#F59E0B'); // Yellow/Orange for warning
  }
  if (sensor.flowDetected) {
    return createMarkerIcon('#3B82F6'); // Blue for flow detected
  }
  if (sensor.lastknownStat === 'Active') {
    return createMarkerIcon('#22C55E'); // Green for active
  }
  return createMarkerIcon('#9CA3AF'); // Gray for inactive
};

export const SensorMap: React.FC<SensorMapProps> = ({ sensors, apiKey }) => {
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null);
 

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

 const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
  // Fit bounds to include all sensors if there are any
  if (sensors.length > 0) {
    const bounds = new google.maps.LatLngBounds();
    sensors.forEach((sensor) => {
      if (sensor.location?.lat && sensor.location?.lng) {
        bounds.extend({ lat: sensor.location.lat, lng: sensor.location.lng });
      }
    });
    
    if (!bounds.isEmpty()) {
      mapInstance.fitBounds(bounds);
      
      // Don't zoom in too far
      const listener = google.maps.event.addListener(mapInstance, 'idle', () => {
        if (mapInstance.getZoom()! > 15) {
          mapInstance.setZoom(15);
        }
        google.maps.event.removeListener(listener);
      });
    }
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

  // Filter sensors with valid locations
  const validSensors = sensors.filter(s => 
    s.location?.lat && s.location?.lng && 
    !isNaN(s.location.lat) && !isNaN(s.location.lng)
  );

  // Calculate map center based on sensors
  const center = validSensors.length > 0 
    ? { 
        lat: validSensors.reduce((sum, s) => sum + s.location.lat, 0) / validSensors.length,
        lng: validSensors.reduce((sum, s) => sum + s.location.lng, 0) / validSensors.length,
      }
    : defaultCenter;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={6}
      options={mapOptions}
      onLoad={onMapLoad}
    >
      {validSensors.map((sensor) => (
        <Marker
          key={sensor.id}
          position={{ lat: sensor.location.lat, lng: sensor.location.lng }}
          icon={getMarkerIcon(sensor)}
          onClick={() => setSelectedSensor(sensor)}
          title={sensor.community}
        />
      ))}

      {selectedSensor && selectedSensor.location && (
        <InfoWindow
          position={{ lat: selectedSensor.location.lat, lng: selectedSensor.location.lng }}
          onCloseClick={() => setSelectedSensor(null)}
        >
          <div className="p-2 min-w-[200px] max-w-[300px]">
            <h3 className="font-semibold text-gray-900 mb-2">
              {selectedSensor.community || 'Unknown Sensor'}
            </h3>
            
            <div className="space-y-2 text-sm">
              {/* Flow Status */}
              <div className="flex items-center gap-2">
                <Droplets className={`w-4 h-4 ${selectedSensor.flowDetected ? 'text-blue-500' : 'text-gray-400'}`} />
                <span>
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
                  <span className="text-gray-600">
                    Last Flow: {formatDistanceToNow(new Date(selectedSensor.lastFlowDetected), { addSuffix: true })}
                  </span>
                </div>
              )}

              {/* Cylinder Level */}
              {selectedSensor.tank_level !== undefined && selectedSensor.tank_level > 0 && (
                <div className="flex items-center gap-2">
                  <Cylinder className={`w-4 h-4 ${
                    selectedSensor.tank_level > 50 ? 'text-green-500' : 
                    selectedSensor.tank_level > 20 ? 'text-yellow-500' : 'text-red-500'
                  }`} />
                  <span className="text-gray-600">
                    Tank Level: {selectedSensor.tank_level}%
                  </span>
                </div>
              )}
              
                 {/* Location */}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {[selectedSensor.location.lat, selectedSensor.location.lng].filter(Boolean).join(', ') || 'Location not specified'}
                </span>
              </div>

              {/* Capacity */}
              {selectedSensor.capacity && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">
                    Storage Capacity: {selectedSensor.capacity} m<sup>3</sup>
                  </span>
                </div>
              )}

              {/* Type/Borehole Type */}
              {selectedSensor.type && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">
                    Borehole Type: {selectedSensor.type}
                  </span>
                </div>
              )}
              
              {/* Ownership */}
              {selectedSensor.ownership && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">
                    Owner: {selectedSensor.ownership}
                  </span>
                </div>
              )}

              {/* Status Badge */}
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                 selectedSensor.status.includes('Warning') ? 'bg-yellow-100 text-yellow-800' :
                  selectedSensor.lastknownStat === 'Active' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedSensor.status.includes('Warning') ? selectedSensor.status : selectedSensor.lastknownStat || 'Unknown'}
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