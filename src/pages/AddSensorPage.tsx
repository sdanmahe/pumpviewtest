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
  Ruler, 
  Activity,
  ArrowLeft,
  Save,
  XCircle,
  Hash,
  User,
  Gauge,
  Users,
  Calendar,
  Database,
  UserCircle,
  Phone
} from 'lucide-react';
import { db } from '@/config/firebase';
import { collection, setDoc, doc } from 'firebase/firestore';
import pumpviwBG from '@/assets/pumpview_bg.png';

interface SensorFormData {
  id: string;
  sensorID: string;
  serialNumber: string;
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
  ward: string;
  name: string;
  ownership: string;
  storage_capacity: string;
  flowRate: string;
  pumpingRate: string;
  boreholeDepth: string;
  borehole_type: string;
  beneficiaries: string;
  commissionDate: string;
  aquiferType: string;
  assignedAgent: string;
  phoneNo: string;
}

const AddSensorPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<SensorFormData>({
    id: '',
    sensorID: '',
    serialNumber: '',
    location: { lat: 0, lng: 0 },
    storage_capacity: '',
    flowRate: '',
    pumpingRate: '',
    boreholeDepth: '',
    borehole_type: '',
    beneficiaries: '',
    commissionDate: '',
    aquiferType: '',
    assignedAgent: '',
    status: 'Inactive',
    lastFlowDetected: new Date(Date.now() - 1000 * 60 * 30),
    flowDetected: false,
    tankLevel: 0,
    state: '',
    lga: '',
    ward: '',
    name: '',
    ownership: '',
    phoneNo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle nested location fields
    if (name === 'lat' || name === 'lng') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

 // In your handleSubmit function:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  
  try {
    // Use the serial number or custom ID as the document ID
    const customDocId = formData.serialNumber || formData.id || `sensor_${Date.now()}`;
    
    const sensorData = {
      // Include all fields except we don't need to store the ID separately
      sensorID: formData.sensorID,
      serialNumber: formData.serialNumber,
      storage_capacity: parseFloat(formData.storage_capacity) || 0,
      flowRate: parseFloat(formData.flowRate) || 0,
      pumpingRate: parseFloat(formData.pumpingRate) || 0,
      boreholeDepth: parseFloat(formData.boreholeDepth) || 0,
      borehole_type: formData.borehole_type,
      beneficiaries: parseInt(formData.beneficiaries) || 0,
      commissionDate: formData.commissionDate,
      aquiferType: formData.aquiferType,
      assignedAgent: formData.assignedAgent,
      location: {
        lat: formData.location.lat,
        lng: formData.location.lng
      },
      status: formData.status,
      lastFlowDetected: new Date(Date.now() - 1000 * 120 * 3600),
      hasFlow: parseFloat(formData.flowRate) > 0,
      tankLevel: 100,
      signalStrength: 100,
      state: formData.state,
      lga: formData.lga,
      ward: formData.ward,
      name: formData.name,
      ownership: formData.ownership,
      phone_no : formData.phoneNo
    };

    // Use setDoc with a specific document ID instead of addDoc
    const collectionRef = collection(db, import.meta.env.VITE_FIREBASE_COLLECTION_NAME || 'sensors');
    const docRef = doc(collectionRef, customDocId);
    await setDoc(docRef, sensorData);
    
    console.log('Sensor added with ID:', customDocId);

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
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat overflow-y-auto"
      style={{ 
        backgroundImage: `url(${pumpviwBG})`,
      }} >
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              Complete Sensor Information
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

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Basic Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                
                  <div>
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="serialNumber"
                        name="serialNumber"
                        placeholder="e.g., S01T01D001"
                        className="pl-9"
                        value={formData.serialNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sensorID">Sensor ID</Label>
                    <div className="relative">
                      <Droplets className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="sensorID"
                        name="sensorID"
                        placeholder="e.g., DA5E3E"
                        className="pl-9"
                        value={formData.sensorID}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phoneNo">Phone No</Label>
                    <div className="relative">
                      <Droplets className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="phoneNo"
                        name="phoneNo"
                        placeholder="e.g., +2348123456789"
                        className="pl-9"
                        value={formData.phoneNo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Location Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="e.g., Kebbi"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lga">LGA</Label>
                    <Input
                      id="lga"
                      name="lga"
                      placeholder="e.g., Birnin Kebbi"
                      value={formData.lga}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="ward">Ward</Label>
                    <Input
                      id="ward"
                      name="ward"
                      placeholder="e.g., Ward A"
                      value={formData.ward}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="name">Community</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., GRA"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      name="lat"
                      type="number"
                      step="any"
                      placeholder="-6.2088"
                      value={formData.location.lat === 0 ? '' : formData.location.lat}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lng">Longitude</Label>
                    <Input
                      id="lng"
                      name="lng"
                      type="number"
                      step="any"
                      placeholder="106.8456"
                      value={formData.location.lng === 0 ? '' : formData.location.lng}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Technical Specifications</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="boreholeDepth">Borehole Depth (m)</Label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="boreholeDepth"
                        name="boreholeDepth"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        className="pl-9"
                        value={formData.boreholeDepth}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="borehole_type">Borehole Type</Label>
                    <Input
                      id="borehole_type"
                      name="borehole_type"
                      placeholder="e.g., Solar Powerd, Tubewell, Dugwell"
                      value={formData.borehole_type}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="aquiferType">Aquifer Type</Label>
                    <Input
                      id="aquiferType"
                      name="aquiferType"
                      placeholder="e.g., Confined, Unconfined"
                      value={formData.aquiferType}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="storage_capacity">Storage Capacity (m³)</Label>
                    <div className="relative">
                      <Database className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="storage_capacity"
                        name="storage_capacity"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        className="pl-9"
                        value={formData.storage_capacity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Flow Measurements */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Flow Measurements</h3>
                
                <div className="grid grid-cols-2 gap-4">
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

                  <div>
                    <Label htmlFor="pumpingRate">Pumping Rate (m³/h)</Label>
                    <div className="relative">
                      <Gauge className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="pumpingRate"
                        name="pumpingRate"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        className="pl-9"
                        value={formData.pumpingRate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Administrative Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Administrative Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownership">Ownership</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="ownership"
                        name="ownership"
                        placeholder="e.g., Government, Private"
                        className="pl-9"
                        value={formData.ownership}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="beneficiaries">Beneficiaries</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="beneficiaries"
                        name="beneficiaries"
                        type="number"
                        placeholder="e.g., 500"
                        className="pl-9"
                        value={formData.beneficiaries}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="assignedAgent">Assigned Agent</Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="assignedAgent"
                        name="assignedAgent"
                        placeholder="e.g., John Doe"
                        className="pl-9"
                        value={formData.assignedAgent}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="commissionDate">Commission Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="commissionDate"
                        name="commissionDate"
                        type="date"
                        className="pl-9"
                        value={formData.commissionDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-6 border-t">
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