import React from 'react';
import type { SensorData } from '@/types/sensor';
import { Droplets, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsOverviewProps {
  sensors: SensorData[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ sensors }) => {
  const totalSensors = sensors.length;
  const activeFlowSensors = sensors.filter(s => s.flowDetected).length;
  const onlineSensors = sensors.filter(s => s.status === 'Active').length;
  const warningSensors = sensors.filter(s => s.status?.includes('Warning')).length;

  const stats = [
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
      value: activeFlowSensors,
      icon: Droplets,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      label: 'Active',
      value: onlineSensors,
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

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
