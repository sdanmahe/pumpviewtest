// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/sections/Dashboard';
import AddSensorPage from '@/pages/AddSensorPage';
import LoginPage from '@/pages/LoginPage';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes - Only add-sensor requires authentication */}
        <Route path="/add-sensor" element={
          <ProtectedRoute>
            <AddSensorPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;