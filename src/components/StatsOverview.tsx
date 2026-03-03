import React, { useMemo } from 'react';
import type { SensorData } from '@/types/sensor';
import { Droplets, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsOverviewProps {
  sensors: SensorData[];
  isLoading?: boolean;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  textColor: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, textColor, bgColor }) => (
  <Card className="overflow-hidden">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const StatsOverview: React.FC<StatsOverviewProps> = ({ sensors, isLoading = false }) => {
  const stats = useMemo(() => {
    const totalSensors = sensors.length;
    
    // Calculate current flow (last 24 hours) - for the Flow Detected stat
    const currentFlowSensors = sensors.filter(s => s.flowDetected).length;
    
    // Calculate active sensors (flow detected in last 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const activeSensors = sensors.filter(sensor => {
      // If sensor has flow detected now, it's definitely active
      if (sensor.flowDetected) return true;
      
      
      // Check if there's a lastFlowDate and it's within 3 days
      if (sensor.lastFlowDetected && !sensor.status.toLowerCase().includes("warning")) {
        const lastFlow = new Date(sensor.lastFlowDetected);
        return lastFlow >= threeDaysAgo;
      }
      
      // If no lastFlowDate, fall back to checking if status is 'Active'
      // This maintains backward compatibility with existing data
      return sensor.status === 'Active';
    }).length;
    
    // Calculate warnings (based on status field)
    const warningSensors = sensors.filter(s => s.status?.includes('Warning')).length;
    
    return [
      {
        label: 'Total Sensors',
        value: totalSensors,
        icon: Activity,
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        label: 'Flow Detected (24h)',
        value: currentFlowSensors,
        icon: Droplets,
        color: 'bg-cyan-500',
        textColor: 'text-cyan-600',
        bgColor: 'bg-cyan-50',
      },
      {
        label: 'Active (Flow ≤3 days)',
        value: activeSensors,
        icon: CheckCircle,
        color: 'bg-green-500',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50',
      },
      {
        label: 'Warnings',
        value: warningSensors,
        icon: AlertTriangle,
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
      },
    ];
  }, [sensors]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-12"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsOverview;