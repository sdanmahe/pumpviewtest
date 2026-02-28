// src/pages/LandingPage.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Droplets, Map, AlertCircle, Target, Users} from 'lucide-react';
import { Link } from 'react-router-dom';
import pumpviewHeaderLogo from '@/assets/pumpview_logo.png';
import pumpviewFooterLogo from '@/assets/footer_logo.png';
import pumpviwBG from '@/assets/pumpview_bg.png';


const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <img src={pumpviewHeaderLogo} alt="Pumpview Logo" className="w-16 h-20" />
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
  <section className="relative h-[600px] overflow-hidden">
    {/* Background Image */}
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 hover:scale-100 transition-transform duration-7000 "
      style={{ 
        backgroundImage: `url(${pumpviwBG})`,
      }}
      
    />
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/70 to-transparent" />
    {/* Hero Content */}
    <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="text-white max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Pumpview Water Monitoring
        </h1>
        <p className="text-xl mb-8 text-blue-100">
          Real-time water flow monitoring and management system for municipal water tanks and pumps
        </p>
        <div className="flex gap-4">
         <Link to="/dashboard">
          <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
            View Dashboard
          </Button></Link>
          <Button size="lg" variant="outline" className="border-white text-blue-900 hover:bg-white/20">
            Learn More
          </Button>
        </div>
      </div>
    </div>
    
    {/* Wave Decoration */}
    <div className="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
          className="fill-white"/>
      </svg>
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
              <span className="text-gray-600">Monitoring 100+ sensors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img src={pumpviewFooterLogo} alt="Pumpview Logo" className="w-16 h-16 mx-auto mb-4" />
            <p className="text-gray-400">© 2026 Pumpview. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// THIS IS THE CRITICAL PART - MAKE SURE THIS LINE EXISTS AT THE BOTTOM
export default LandingPage;