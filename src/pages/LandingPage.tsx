// src/pages/LandingPage.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Droplets, Map, AlertCircle, Target, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import pumpviewLogo from '@/assets/footer_logo.png';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <img src='src/assets/pumpview_logo.png' alt="Pumpview Logo" className="w-16 h-20" />
              <span className="text-xl font-bold text-gray-900">Pumpview</span>
            </div>
            <div className="flex gap-3">
              <Link to="/dashboard">
                <Button variant="outline">View Dashboard</Button>
              </Link>
              <Link to="/login">
                <Button className="bg-blue-600 hover:bg-blue-700">Admin Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Smart Water Monitoring
              <span className="text-blue-600 block mt-2">for Sustainable Communities</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Real-time water flow monitoring and management system for municipal water tanks and pumps
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="gap-2">
                  View Live Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">Admin Access</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Problem We Solve</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Municipalities face critical challenges in managing their water infrastructure
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-red-50 rounded-xl border border-red-100">
              <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Undetected Leaks</h3>
              <p className="text-gray-600">
                Thousands of liters of water lost daily due to undetected leaks in municipal water systems
              </p>
            </div>
            
            <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-100">
              <Droplets className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Manual Monitoring</h3>
              <p className="text-gray-600">
                Traditional methods rely on manual readings, leading to delayed responses and inefficiencies
              </p>
            </div>
            
            <div className="p-6 bg-orange-50 rounded-xl border border-orange-100">
              <Map className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data Silos</h3>
              <p className="text-gray-600">
                Lack of centralized data makes it difficult to make informed decisions about water management
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Solution</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real-time monitoring system that transforms water management
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">24/7</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Continuous Monitoring</h3>
              <p className="text-gray-600">
                Real-time flow detection with instant alerts for anomalies
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">GIS</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Mapping</h3>
              <p className="text-gray-600">
                Interactive maps showing all sensor locations and status
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">IoT</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">IoT Integration</h3>
              <p className="text-gray-600">
                ESP8266-based sensors with automatic data collection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              To ensure the sustainability of investments in WASH services and water drinkage. 
              GHI’s core programs focus on 4 sustainable development goals (SDGs),
              Clean Water & Sanitation (SDG 6), Affordable & Clean Energy (SDG 7) 
              Sustainable Cities and Communities (SDG 11), and Climate action (SDG 13).
            </p>
            <div className="flex justify-center gap-4">
              <Users className="w-6 h-6 text-gray-400" />
              <span className="text-gray-600">Serving 50+ communities</span>
              <span className="text-gray-300">|</span>
              <Droplets className="w-6 h-6 text-gray-400" />
              <span className="text-gray-600">Monitoring 1000+ sensors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img src={pumpviewLogo} alt="Pumpview Logo" className="w-16 h-16 mx-auto mb-4" />
            <p className="text-gray-400">© 2026 Pumpview. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// THIS IS THE CRITICAL PART - MAKE SURE THIS LINE EXISTS AT THE BOTTOM
export default LandingPage;