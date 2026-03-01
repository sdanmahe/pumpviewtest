// src/pages/SensorManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
  Phone,
  Microchip,
  Edit,
  Trash2,
  Plus,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { db } from '@/config/firebase';
import { collection, getDocs, setDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
import pumpviwBG from '@/assets/pumpview_bg.png';
import { useAuth } from '@/contexts/AuthContext';

// Interface matching the updated AddSensorPage data structure
interface SensorData {
  id: string;
  sensorID: string;
  serial_number: string;
  location: {
    lat: number;
    lng: number;
  };
  lastFlowDetected?: Date | null;
  flowDetected?: boolean;
  status: string;
  tank_level?: number;
  state: string;
  lga: string;
  ward: string;
  community: string;
  ownership: string;
  storage_capacity: number;
  flowRate: number;
  pumping_rate: number;
  borehole_depth: number;
  borehole_type: string;
  beneficiaries: number;
  commission_date: string;
  aquifer_type: string;
  assigned_agent: string;
  phone_no: string;
  createdBy?: string;
  createdAt?: string;
  lastUpdate?: string;
  hasFlow?: boolean;
  batteryLevel?: number;
  signalStrength?: number;
}

interface SensorFormData {
  id: string;
  sensorID: string;
  serial_number: string;
  location: {
    lat: number;
    lng: number;
  };
  lastFlowDetected?: Date | null;
  flowDetected?: boolean;
  status: string;
  tank_level: string;
  state: string;
  lga: string;
  ward: string;
  community: string;
  ownership: string;
  storage_capacity: string;
  flowRate: string;
  pumping_rate: string;
  borehole_depth: string;
  borehole_type: string;
  beneficiaries: string;
  commission_date: string;
  aquifer_type: string;
  assigned_agent: string;
  phone_num: string;
}

type ViewMode = 'list' | 'add' | 'edit' | 'view';

const SensorManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [filteredSensors, setFilteredSensors] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Initialize form data
  const [formData, setFormData] = useState<SensorFormData>({
    id: '',
    sensorID: '',
    serial_number: '',
    location: { lat: 0, lng: 0 },
    lastFlowDetected: new Date(Date.now() - 1000 * 60 * 30),
    flowDetected: false,
    status: 'Inactive',
    tank_level: '',
    state: '',
    lga: '',
    ward: '',
    community: '',
    ownership: '',
    storage_capacity: '',
    flowRate: '',
    pumping_rate: '',
    borehole_depth: '',
    borehole_type: '',
    beneficiaries: '',
    commission_date: '',
    aquifer_type: '',
    assigned_agent: '',
    phone_num: ''
  });

  // Fetch sensors on component mount
  useEffect(() => {
    fetchSensors();
  }, []);

  // Apply filters when sensors, searchTerm, or statusFilter changes
  useEffect(() => {
    applyFilters();
  }, [sensors, searchTerm, statusFilter]);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  // Helper function to safely get string value
  const getStringValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Helper function to safely get number value
  const getNumberValue = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Helper function to safely get status
  const getValidStatus = (status: any): 'Active' | 'Inactive' | 'Warning' => {
    if (status === 'Active') return 'Active';
    if (status?.includes('Warning')) return status;
    
    return 'Inactive'; // Default
  };

  const fetchSensors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const collectionName = import.meta.env.VITE_FIREBASE_COLLECTION_NAME || 'sensors';
      console.log('Fetching from collection:', collectionName);
      
      const sensorsRef = collection(db, collectionName);
      const q = query(sensorsRef, orderBy('community'));
      const querySnapshot = await getDocs(q);
      
      console.log('Number of documents found:', querySnapshot.size);
      
      const sensorsData: SensorData[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Document ID:', doc.id);
        console.log('Document data:', data);
        
        // Map the data with safe fallbacks
        const sensor: SensorData = {
          id: doc.id,
          serial_number: doc.id,
          sensorID: getStringValue(data.sensorID || data.sensor_id || ''),
          
          // Name - try different possible field names
          community: getStringValue(data.community || data.communityName || data.community || data.siteName || 'Unnamed Sensor'),
          
          // Location
          location: {
            lat: getNumberValue(data.location?.lat || data.lat || 0),
            lng: getNumberValue(data.location?.lng || data.lng || 0)
          },
          
          // Status - ensure valid value
          status: getValidStatus(data.status),
          
          // Flow related
          lastFlowDetected: data.lastFlowDetected ? new Date(data.lastFlowDetected) : null,
          flowDetected: Boolean(data.flowDetected || data.hasFlow || false),
          flowRate: getNumberValue(data.flowRate || data.flow_rate || 0),
          pumping_rate: getNumberValue(data.pumping_rate || data.pumping_rate || 0),
          hasFlow: Boolean(data.hasFlow || data.flowDetected || false),
          
          // Technical specs
          tank_level: getNumberValue(data.tank_level || data.tank_level || 0),
          borehole_depth: getNumberValue(data.borehole_depth || data.borehole_depth || 0),
          borehole_type: getStringValue(data.borehole_type || data.boreholeType || ''),
          aquifer_type: getStringValue(data.aquifer_type || data.aquifer_type || ''),
          storage_capacity: getNumberValue(data.storage_capacity || data.storageCapacity || 0),
          
          // Location fields
          state: getStringValue(data.state || ''),
          lga: getStringValue(data.lga || data.LGA || ''),
          ward: getStringValue(data.ward || ''),
          
          // Administrative
          ownership: getStringValue(data.ownership || ''),
          beneficiaries: getNumberValue(data.beneficiaries || 0),
          commission_date: getStringValue(data.commission_date || data.commission_date || ''),
          
          // Agent info
          assigned_agent: getStringValue(data.assigned_agent || data.assigned_agent || data.agent || ''),
          phone_no: getStringValue(data.phone_no || data.phone_num || data.phone || data.phoneNumber || ''),
          
          // System fields
          createdBy: getStringValue(data.createdBy || ''),
          createdAt: getStringValue(data.createdAt || ''),
          lastUpdate: getStringValue(data.lastUpdate || ''),
          
          // Device metrics
          batteryLevel: getNumberValue(data.batteryLevel || 100),
          signalStrength: getNumberValue(data.signalStrength || 100),
        };
        
        sensorsData.push(sensor);
      });
      
      console.log('Final mapped sensors data:', sensorsData);
      setSensors(sensorsData);
      setFilteredSensors(sensorsData);
      
      if (sensorsData.length === 0) {
        setError('No sensors found in the database');
      }
      
    } catch (err) {
      console.error('Error fetching sensors:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sensors');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sensors];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(sensor => 
        sensor.community?.toLowerCase().includes(term) ||
        sensor.id?.toLowerCase().includes(term) ||
        sensor.sensorID?.toLowerCase().includes(term) ||
        sensor.state?.toLowerCase().includes(term) ||
        sensor.lga?.toLowerCase().includes(term) ||
        sensor.ward?.toLowerCase().includes(term) ||
        sensor.assigned_agent?.toLowerCase().includes(term) ||
        sensor.phone_no?.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sensor => sensor.status === statusFilter);
    }
    
    setFilteredSensors(filtered);
    setCurrentPage(1);
  };

  // ============ MISSING FORM HANDLING FUNCTIONS ============

  const validateForm = () => {
    if (!formData.serial_number.trim()) return "Serial Number is required";
    if (!formData.sensorID.trim()) return "Sensor ID is required";
    if (!formData.phone_num.trim()) return "Phone number is required";
    if (formData.location.lat === 0 || formData.location.lng === 0) 
      return "Valid coordinates are required";
    if (!formData.state.trim()) return "State is required";
    if (!formData.lga.trim()) return "LGA is required";
    if (!formData.ward.trim()) return "Ward is required";
    if (!formData.community.trim()) return "Community name is required";
    if (!formData.borehole_depth) return "Borehole depth is required";
    if (!formData.borehole_type.trim()) return "Borehole type is required";
    if (!formData.storage_capacity) return "Storage capacity is required";
    if (!formData.flowRate) return "Flow rate is required";
    if (!formData.pumping_rate) return "Pumping rate is required";
    if (!formData.ownership.trim()) return "Ownership is required";
    if (!formData.beneficiaries) return "Number of beneficiaries is required";
    if (!formData.assigned_agent.trim()) return "Assigned agent is required";
    if (!formData.commission_date) return "Commission date is required";
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
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
        [name]: type === 'number' ? (value === '' ? '' : value) : value
      }));
    }
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const documentId = formData.serial_number.trim();
      
      // Check if serial number already exists (for new sensors)
      if (viewMode === 'add') {
        const existingQuery = query(
          collection(db, import.meta.env.VITE_FIREBASE_COLLECTION_NAME || 'sensors'),
          where('serial_number', '==', documentId)
        );
        const existingDocs = await getDocs(existingQuery);
        
        if (!existingDocs.empty) {
          setError('A sensor with this serial number already exists');
          setLoading(false);
          return;
        }
      }

      // Determine status based on flow rate if not explicitly set
      let status = formData.status;
      if (!status || status === 'Inactive') {
        const flowRate = parseFloat(formData.flowRate) || 0;
        status = flowRate > 0 ? 'Active' : 'Inactive';
      }

      const sensorData = {
        sensorID: formData.sensorID.trim(),
        serial_number: documentId,
        storage_capacity: parseFloat(formData.storage_capacity) || 0,
        flowRate: parseFloat(formData.flowRate) || 0,
        pumping_rate: parseFloat(formData.pumping_rate) || 0,
        borehole_depth: parseFloat(formData.borehole_depth) || 0,
        borehole_type: formData.borehole_type.trim(),
        beneficiaries: parseInt(formData.beneficiaries) || 0,
        commission_date: formData.commission_date,
        aquifer_type: formData.aquifer_type.trim(),
        assigned_agent: formData.assigned_agent.trim(),
        location: {
          lat: formData.location.lat,
          lng: formData.location.lng
        },
        status: status,
        lastFlowDetected: new Date(Date.now() - 1000 * 60 * 30),
        hasFlow: parseFloat(formData.flowRate) > 0,
        tank_level: parseFloat(formData.tank_level) || 0,
        signalStrength: 100,
        state: formData.state.trim(),
        lga: formData.lga.trim(),
        ward: formData.ward.trim(),
        community: formData.community.trim(),
        ownership: formData.ownership.trim(),
        phone_no: formData.phone_num.trim(),
        ...(viewMode === 'add' && {
          createdBy: user?.email,
          createdAt: new Date().toISOString()
        }),
        lastUpdate: new Date().toISOString()
      };

      const collectionRef = collection(db, import.meta.env.VITE_FIREBASE_COLLECTION_NAME || 'sensors');
      const docRef = doc(collectionRef, documentId);
      
      if (viewMode === 'edit') {
        await setDoc(docRef, sensorData, { merge: true });
        setSuccess('Sensor updated successfully!');
      } else {
        await setDoc(docRef, sensorData);
        setSuccess('Sensor added successfully!');
      }
      
      await fetchSensors();
      resetForm();
      setViewMode('list');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save sensor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sensorId: string) => {
    if (!confirm('Are you sure you want to delete this sensor?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await deleteDoc(doc(db, import.meta.env.VITE_FIREBASE_COLLECTION_NAME || 'sensors', sensorId));
      setSuccess('Sensor deleted successfully!');
      await fetchSensors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete sensor');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sensor: SensorData) => {
    setSelectedSensor(sensor);
    setFormData({
      id: sensor.id,
      sensorID: sensor.sensorID || '',
      serial_number: sensor.id,
      location: sensor.location || { lat: 0, lng: 0 },
      lastFlowDetected: sensor.lastFlowDetected || new Date(Date.now() - 1000 * 60 * 30),
      flowDetected: sensor.flowDetected || false,
      status: sensor.status || 'Inactive',
      tank_level: sensor.tank_level?.toString() || '',
      state: sensor.state || '',
      lga: sensor.lga || '',
      ward: sensor.ward || '',
      community: sensor.community || '',
      ownership: sensor.ownership || '',
      storage_capacity: sensor.storage_capacity?.toString() || '',
      flowRate: sensor.flowRate?.toString() || '',
      pumping_rate: sensor.pumping_rate?.toString() || '',
      borehole_depth: sensor.borehole_depth?.toString() || '',
      borehole_type: sensor.borehole_type || '',
      beneficiaries: sensor.beneficiaries?.toString() || '',
      commission_date: sensor.commission_date || '',
      aquifer_type: sensor.aquifer_type || '',
      assigned_agent: sensor.assigned_agent || '',
      phone_num: sensor.phone_no || ''
    });
    setViewMode('edit');
  };

  const handleView = (sensor: SensorData) => {
    setSelectedSensor(sensor);
    setViewMode('view');
  };

  const resetForm = () => {
    setFormData({
      id: '',
      sensorID: '',
      serial_number: '',
      location: { lat: 0, lng: 0 },
      lastFlowDetected: new Date(Date.now() - 1000 * 60 * 30),
      flowDetected: false,
      status: 'Inactive',
      tank_level: '',
      state: '',
      lga: '',
      ward: '',
      community: '',
      ownership: '',
      storage_capacity: '',
      flowRate: '',
      pumping_rate: '',
      borehole_depth: '',
      borehole_type: '',
      beneficiaries: '',
      commission_date: '',
      aquifer_type: '',
      assigned_agent: '',
      phone_num: ''
    });
    setSelectedSensor(null);
  };

  const handleAddNew = () => {
    resetForm();
    setViewMode('add');
  };

  const handleCancel = () => {
    resetForm();
    setViewMode('list');
  };

  // ============ END OF MISSING FUNCTIONS ============

  // Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  // Check if status includes 'warning' (case insensitive)
  const isWarning = status?.toLowerCase().includes('warning');
  
  // Define color schemes
  const colors = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-red-100 text-red-800',
    Warning: 'bg-yellow-50 border-red-200 text-yellow-600'
  };
  
  // Determine which style to use
  const colorClass = isWarning 
    ? colors.Warning 
    : colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
};

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSensors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSensors.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat overflow-y-auto"
      style={{ backgroundImage: `url(${pumpviwBG})` }}
    >
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
                <h1 className="text-xl font-bold text-gray-900">Facilities Management</h1>
                <p className="text-sm text-gray-500">Manage and monitor all facilities and there sensors</p>
              </div>
            </div>

            {/* User info and logout button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserIcon className="w-4 h-4" />
                <span className="hidden md:inline">{user?.name || user?.email}</span>
                <span className="hidden sm:inline md:hidden">
                  {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="sm:hidden text-gray-600 hover:text-red-600"
                title="Logout"
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="hidden sm:flex text-gray-600 hover:text-red-600 hover:bg-red-50"
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 mx-4">
            <CardHeader>
              <CardTitle>Confirm Logout</CardTitle>
              <CardDescription>Are you sure you want to logout?</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowLogoutDialog(false)}
                disabled={loggingOut}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmLogout}
                disabled={loggingOut}
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Save className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle>All Sensors</CardTitle>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 md:min-w-[300px]">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by community, serial #, location, agent..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Status Filter */}
                  <select
                    className="px-3 py-2 border rounded-md bg-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="warning">Warning</option>
                  </select>
                  
                  {/* Refresh Button */}
                  <Button variant="outline" onClick={fetchSensors} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>

                  {/* Add Button - Now handleAddNew is defined */}
                  <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-500">Loading sensors...</p>
                </div>
              ) : filteredSensors.length === 0 ? (
                <div className="text-center py-12">
                  <Droplets className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sensors found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search filters' 
                      : 'Get started by adding your first sensor'}
                  </p>
                  {!searchTerm && statusFilter === 'all' && (
                    <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Sensor
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {/* Table */}
                  <div className="w-full">
                    <div className="mb-2 text-sm text-gray-500 flex justify-between items-center">
                      <span>Showing {filteredSensors.length} sensors</span>
                    </div>

                    <div className="w-full overflow-x-auto border rounded-lg">  
                      <table className="w-full min-w-[1800px] lg:min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                              Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                              Serial #
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                              Flow Rate
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                              LGA
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                              Agent
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                              Phone
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentItems.map((sensor) => (
                            <tr key={sensor.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {sensor.community || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                {sensor.id || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={sensor.status} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {sensor.flowRate || 0} m³/h
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {sensor.lga || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {sensor.assigned_agent || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {sensor.phone_no || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleView(sensor)}
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(sensor)}
                                    className="text-green-600 hover:text-green-800 hover:bg-green-50"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(sensor.id)}
                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">
                          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSensors.length)} of {filteredSensors.length} sensors
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <span className="text-sm">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Form View */}
        {(viewMode === 'add' || viewMode === 'edit') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {viewMode === 'add' ? (
                  <>
                    <Plus className="w-5 h-5 text-blue-600" />
                    Add New Sensor
                  </>
                ) : (
                  <>
                    <Edit className="w-5 h-5 text-blue-600" />
                    Edit Sensor: {selectedSensor?.community}
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 border-b pb-2">Basic Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serial_number">
                        Serial Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="serial_number"
                          name="serial_number"
                          placeholder="e.g., S01T01D001"
                          className="pl-9"
                          value={formData.serial_number}
                          onChange={handleChange}
                          required
                          disabled={viewMode === 'edit'}
                        />
                      </div>
                      {viewMode === 'edit' ? (
                        <p className="text-xs text-gray-500 mt-1">Serial number cannot be changed</p>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1">This will be used as the document ID</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="sensorID">Sensor ID <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Microchip className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
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
                      <Label htmlFor="phone_num">Phone No <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="phone_num"
                          name="phone_num"
                          placeholder="e.g., +2348123456789"
                          className="pl-9"
                          value={formData.phone_num}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 border-b pb-2">Location Details <span className="text-red-500">*</span></h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="community">Community</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g., GRA"
                        value={formData.community}
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
                  <h3 className="font-medium text-gray-900 border-b pb-2">Technical Specifications <span className="text-red-500">*</span></h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="borehole_depth">Borehole Depth (m)</Label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="borehole_depth"
                          name="borehole_depth"
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          className="pl-9"
                          value={formData.borehole_depth}
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
                        placeholder="e.g., Solar Powered, Tubewell, Dugwell"
                        value={formData.borehole_type}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="aquifer_type">Aquifer Type</Label>
                      <Input
                        id="aquifer_type"
                        name="aquifer_type"
                        placeholder="e.g., Confined, Unconfined"
                        value={formData.aquifer_type}
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
                  <h3 className="font-medium text-gray-900 border-b pb-2">Flow Measurements <span className="text-red-500">*</span></h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="pumping_rate">Pumping Rate (m³/h)</Label>
                      <div className="relative">
                        <Gauge className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="pumping_rate"
                          name="pumping_rate"
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          className="pl-9"
                          value={formData.pumping_rate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Administrative Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 border-b pb-2">Administrative Details <span className="text-red-500">*</span></h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="assigned_agent">Assigned Agent</Label>
                      <div className="relative">
                        <UserCircle className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="assigned_agent"
                          name="assigned_agent"
                          placeholder="e.g., John Doe"
                          className="pl-9"
                          value={user?.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="commission_date">Commission Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="commission_date"
                          name="commission_date"
                          type="date"
                          className="pl-9"
                          value={formData.commission_date}
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {viewMode === 'edit' ? 'Updating...' : 'Adding...'}
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {viewMode === 'edit' ? 'Update Sensor' : 'Add Sensor'}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>

                {/* Required fields note */}
                <p className="text-xs text-gray-500 text-right">
                  <span className="text-red-500">*</span> Required fields
                </p>
              </form>
            </CardContent>
          </Card>
        )}

        {/* View Mode - Details View */}
        {viewMode === 'view' && selectedSensor && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Sensor Details: {selectedSensor.community}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setViewMode('list')}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Basic Information</h3>
                  <dl className="space-y-2">
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Name:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.community}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Serial Number:</dt>
                      <dd className="text-sm text-gray-900 font-mono">{selectedSensor.id}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Sensor ID:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.sensorID}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Phone No:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.phone_no}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Status:</dt>
                      <dd><StatusBadge status={selectedSensor.status} /></dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Location</h3>
                  <dl className="space-y-2">
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">State:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.state}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">LGA:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.lga}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Ward:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.ward}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Community:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.community}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Coordinates:</dt>
                      <dd className="text-sm text-gray-900">
                        {selectedSensor.location?.lat?.toFixed(4)}, {selectedSensor.location?.lng?.toFixed(4)}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Technical Specifications</h3>
                  <dl className="space-y-2">
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Borehole Depth:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.borehole_depth} m</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Borehole Type:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.borehole_type}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Aquifer Type:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.aquifer_type}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Storage Capacity:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.storage_capacity} m³</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Tank Level:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.tank_level || 0}%</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Flow Measurements</h3>
                  <dl className="space-y-2">
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Flow Rate:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.flowRate} m³/h</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Pumping Rate:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.pumping_rate} m³/h</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Has Flow:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.hasFlow ? 'Yes' : 'No'}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Last Flow:</dt>
                      <dd className="text-sm text-gray-900">
                        {selectedSensor.lastFlowDetected 
                          ? new Date(selectedSensor.lastFlowDetected).toLocaleString() 
                          : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Administrative Details</h3>
                  <dl className="space-y-2">
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Ownership:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.ownership}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Beneficiaries:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.beneficiaries}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Assigned Agent:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.assigned_agent}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Commission Date:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.commission_date}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">System Info</h3>
                  <dl className="space-y-2">
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Created By:</dt>
                      <dd className="text-sm text-gray-900">{selectedSensor.createdBy || 'N/A'}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Created At:</dt>
                      <dd className="text-sm text-gray-900">
                        {selectedSensor.createdAt ? new Date(selectedSensor.createdAt).toLocaleString() : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-sm text-gray-500">Last Update:</dt>
                      <dd className="text-sm text-gray-900">
                        {selectedSensor.lastUpdate ? new Date(selectedSensor.lastUpdate).toLocaleString() : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t">
                <Button onClick={() => handleEdit(selectedSensor)} className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Sensor
                </Button>
                <Button variant="outline" onClick={() => setViewMode('list')}>
                  Back to List
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default SensorManagementPage;