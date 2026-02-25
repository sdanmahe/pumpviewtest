import React, { useState } from 'react';
import type { SensorData } from '@/types/sensor';
import { useSensors } from '@/hooks/useSensors';
import { SensorMap } from '@/components/SensorMap';
import { SensorCard } from '@/components/SensorCard';
import { StatsOverview } from '@/components/StatsOverview';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Map as MapIcon, 
  List, 
  Settings, 
  Droplets,
  AlertCircle,
  Info
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Dialog,  
  DialogContent, 
  DialogTrigger 
} from '@/components/ui/dialog';


import UserLogin from '@/components/userLoggin';

import pumpviewLogo from '@/assets/pumpview_logo.png';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export const Dashboard: React.FC = () => {
  const { sensors, loading, error, usingDemoData, refreshSensors } = useSensors();
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleSensorClick = (sensor: SensorData) => {
    setSelectedSensorId(sensor.id === selectedSensorId ? null : sensor.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sensors data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-300 bg-[url('/src/assets/pumpview_bg.png')] h-screen bg-cover bg-no-repeat bg-center" >
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className=" p-2 rounded-lg">
               
                <a href="https://pumpview.com" target="_blank" rel="noopener noreferrer">
                <img src={pumpviewLogo} alt="Pumpview Logo" className="w-16 h-20" />
                </a>

              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pumpview Water Monitoring</h1>
                <p className="text-xs text-gray-500">Sensors Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'split' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('split')}
                  className="gap-1"
                >
                  <MapIcon className="w-4 h-4" />
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="gap-1"
                >
                  <MapIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-1"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={refreshSensors}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>

              {/* Settings Dialog */}
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <div id="user-login-section" className="p-4">
                  <DialogContent className="sm:max-w-lg  w-full">
                   
                    <UserLogin />
                  </DialogContent>
                </div>
              
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Alerts */}
        {usingDemoData && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Demo Mode</AlertTitle>
            <AlertDescription className="text-blue-700">
              Using sample sensor data. Configure your Firebase credentials to connect to your ESP8266 sensors.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Connection Issue</AlertTitle>
            <AlertDescription className="text-yellow-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="mb-6">
          <StatsOverview sensors={sensors} />
        </div>

        {/* Content Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'
        }`}>
          {/* Map Section */}
          {(viewMode === 'split' || viewMode === 'map') && (
            <div className={`${viewMode === 'map' ? 'h-[calc(100vh-280px)]' : 'h-[500px]'} bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden`}>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-gray-500" />
                  Sensor Locations
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Flow
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    No Flow
                  </Badge>
                </div>
              </div>
              <div className="h-[calc(100%-60px)]">
                <SensorMap sensors={sensors} apiKey={GOOGLE_MAPS_API_KEY} />
              </div>
            </div>
          )}

          {/* List Section */}
          {(viewMode === 'split' || viewMode === 'list') && (
            <div className={`${viewMode === 'list' ? 'h-[calc(100vh-280px)]' : 'max-h-[500px]'} overflow-auto`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <List className="w-5 h-5 text-gray-500" />
                  Sensor Status
                </h2>
                <Badge variant="secondary">{sensors.length} sensors</Badge>
              </div>
              
              <div className="space-y-3">
                {sensors.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <Droplets className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No sensors found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add sensors to your Firestore database to see them here
                    </p>
                  </div>
                ) : (
                  sensors.map((sensor) => (
                    <SensorCard
                      key={sensor.id}
                      sensor={sensor}
                      onClick={() => handleSensorClick(sensor)}
                      isSelected={selectedSensorId === sensor.id}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Status Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-gray-600">Water flow detected (24h)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-gray-600">No flow (24h)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-gray-600">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-500"></span>
              <span className="text-gray-600">Offline</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
