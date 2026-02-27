// src/pages/AddSensorPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Droplets, 
  MapPin, 
  Ruler, 
  Activity,
  ArrowLeft,
  Save,
  XCircle
} from 'lucide-react';
import { db } from '@/config/firebase'; // Assuming you have firebase config
import { collection, addDoc } from 'firebase/firestore';

interface SensorFormData {
  name: string;
  location: string;
  capacity: string;
  flowRate: string;
  latitude: string;
  longitude: string;
  status: 'active' | 'inactive' | 'warning';
  lastUpdate: string;
}

const AddSensorPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<SensorFormData>({
    name: '',
    location: '',
    capacity: '',
    flowRate: '',
    latitude: '',
    longitude: '',
    status: 'active',
    lastUpdate: new Date().toISOString()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Prepare sensor data for Firestore
      const sensorData = {
        name: formData.name,
        location: formData.location,
        capacity: parseFloat(formData.capacity) || 0,
        flowRate: parseFloat(formData.flowRate) || 0,
        coordinates: {
          lat: parseFloat(formData.latitude) || 0,
          lng: parseFloat(formData.longitude) || 0
        },
        status: formData.status,
        lastUpdate: new Date().toISOString(),
        hasFlow: parseFloat(formData.flowRate) > 0,
        batteryLevel: 100, // Default value
        signalStrength: 100 // Default value
      };

      const docRef = await addDoc(collection(db, 'sensors'), sensorData);
      console.log('Sensor added with ID:', docRef.id);

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add sensor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Add New Sensor</h1>
                <p className="text-sm text-gray-500">Register a new water monitoring sensor</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              Sensor Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <Save className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Sensor added successfully! Redirecting to dashboard...
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Basic Details</h3>
                
                <div>
                  <Label htmlFor="name">Sensor Name</Label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., North Tank Sensor"
                      className="pl-9"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location Description</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., Water Tank, Sector 5"
                      className="pl-9"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Measurements</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capacity">Tank Capacity (m³)</Label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="capacity"
                        name="capacity"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        className="pl-9"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="flowRate">Flow Rate (m³/h)</Label>
                    <div className="relative">
                      <Activity className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="flowRate"
                        name="flowRate"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        className="pl-9"
                        value={formData.flowRate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Coordinates */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">GPS Coordinates</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      placeholder="-6.2088"
                      value={formData.latitude}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      placeholder="106.8456"
                      value={formData.longitude}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading || success}
                >
                  {loading ? (
                    <>Adding Sensor...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Sensor
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddSensorPage;