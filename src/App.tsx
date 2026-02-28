// src/App.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/sections/Dashboard';
// Remove AddSensorPage import
// import AddSensorPage from '@/pages/AddSensorPage';
import LoginPage from '@/pages/LoginPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import SensorManagementPage from '@/pages/SensorManagementPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Update the route to use SensorManagementPage */}
          <Route 
            path="/sensors" 
            element={
              <ProtectedRoute>
                <SensorManagementPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Optional: Keep the old route for backward compatibility, but redirect or use the new component */}
          <Route 
            path="/add-sensor" 
            element={
              <ProtectedRoute>
                <SensorManagementPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Or if you want to redirect from /add-sensor to /sensors, you'd need to add a redirect component */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;