// src/App.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Add this import
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/sections/Dashboard';
import AddSensorPage from '@/pages/AddSensorPage';
import LoginPage from '@/pages/LoginPage';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <AuthProvider> {/* Wrap everything with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/add-sensor" element={
            <ProtectedRoute>
              <AddSensorPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;