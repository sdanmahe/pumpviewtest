// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Droplets, Mail, Lock, ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react';
import { db } from '@/config/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import pumpviewLogo from '@/assets/pumpview_logo.png';
import pumpviwBG from '@/assets/pumpview_bg.png';

interface CredentialData {
  email: string;
  password: string;
  name?: string;
  role?: string;
  isActive: boolean;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth(); // Get login function and auth state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  // If already authenticated, redirect to add-sensor
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/add-sensor', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const from = (location.state as any)?.from?.pathname || '/add-sensor';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const credentialsRef = collection(db, 'credentials');
      const q = query(
        credentialsRef, 
        where('email', '==', formData.email.toLowerCase().trim()),
        where('isActive', '==', true),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      const credentialDoc = querySnapshot.docs[0];
      const credentialData = credentialDoc.data() as CredentialData;
      
      if (credentialData.password === formData.password) {
        // Create user object
        const userInfo = {
          id: credentialDoc.id,
          email: credentialData.email,
          name: credentialData.name || credentialData.email.split('@')[0],
          role: credentialData.role || 'admin'
        };
        
        // Use the login function from AuthContext
        login(userInfo, rememberMe);
        
        // Navigation will happen automatically via the useEffect above
        // when isAuthenticated becomes true
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'sagir@ghi.com',
      password: 'sagir123'
    });
  };

  // Rest of your JSX remains the same...
  return (
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat overflow-y-auto"
      style={{ 
        backgroundImage: `url(${pumpviwBG})`,
      }} >
     
      {/* Header with back button */}
      <div className="p-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-100">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
        {/* Logo and Title */}
<div className="text-center mb-8">
  <div className="flex justify-center mb-4">
    <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
      <img 
        src={pumpviewLogo} 
        alt="Pumpview Logo" 
        className="w-16 h-20" // Removed filter classes
      />
    </div>
  </div>
  <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access Only</h1>
  <p className="text-gray-500">Sign in to add or manage sensors</p>
</div>

          {/* Login Card */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access sensor management
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6 bg-red-50 border-red-200">
                  <AlertDescription className="text-red-700 text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@example.com"
                      className="pl-9 h-11"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-9 pr-10 h-11"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </div>
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-800 mb-2">
                    Use these credentials for demo access:
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-blue-600" />
                      <code className="text-blue-800">sagir@ghi.com</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3 text-blue-600" />
                      <code className="text-blue-800">sagir123</code>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={handleDemoLogin}
                    className="mt-2 text-blue-600 hover:text-blue-800 p-0 h-auto"
                  >
                    Auto-fill demo credentials
                  </Button>
                </div>
              </div>

              {/* Note about dashboard access */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  <span className="text-green-600 font-medium">Note:</span> The dashboard is publicly accessible. 
                  Login is only required to add or manage sensors.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
                  View Public Dashboard
                </Link>
                <span>•</span>
                <Link to="/" className="hover:text-gray-600">Home</Link>
              </div>
            </CardFooter>
          </Card>

          {/* Water Drop Decoration */}
          <div className="flex justify-center mt-8 gap-2">
            <Droplets className="w-5 h-5 text-blue-300" />
            <Droplets className="w-5 h-5 text-blue-400" />
            <Droplets className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;