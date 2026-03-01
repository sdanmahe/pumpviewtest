import React from 'react';
import type { SensorData } from '@/types/sensor';
import { Droplets, Clock, Cylinder, MapPin, Activity } from 'lucide-react';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';





interface SensorCardProps {
  sensor: SensorData;
  onClick?: () => void;
  isSelected?: boolean;
}

export const SensorCard: React.FC<SensorCardProps> = ({ sensor, onClick, isSelected }) => {

// Calculate if 3+ days have passed since last flow detection
const isThreeOrMoreDaysAgo = sensor.lastFlowDetected 
  ? differenceInDays(new Date(), new Date(sensor.lastFlowDetected)) >= 3 ? true:false
  : 'Never'; // If no lastFlowDetected, consider it inactive or handle as needed

// Set sensor status based on flow detection age
const sensorStatus = isThreeOrMoreDaysAgo ? 'Inactive' : 'Active';

// Function to get status color classes
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Warning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Inactive':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-500';
    if (level > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getFlowStatusColor = (flowDetected: boolean) => {
    return flowDetected 
      ? 'bg-blue-50 border-blue-200 text-blue-800' 
      : 'bg-gray-50 border-gray-200 text-gray-600';
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${sensor.flowDetected ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Droplets className={`w-5 h-5 ${sensor.flowDetected ? 'text-blue-600' : 'text-gray-500'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{sensor.community + `  (${sensor.state} State/${sensor.lga} LGA)`}</h3>
              <p className="text-xs text-gray-500">ID: {sensor.id}</p>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(sensor.status?.includes('Warning')? 'Warning': sensorStatus)}>
            {sensor.status?.includes('Warning')? 'Warning': sensorStatus}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Flow Status - Main Indicator */}
        <div className={`p-3 rounded-lg border mb-3 ${sensor.status?.includes('Warning')? 'bg-yellow-50 border-red-200 text-yellow-600' : getFlowStatusColor(sensor.flowDetected)}`}>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="font-medium text-sm">
              {sensor.flowDetected 
                ?sensor.status?.includes('Warning')? sensor.status: 'Water flow detected within 24 hours' 
                : sensor.status?.includes('Warning')? sensor.status: 'No water flow in last 24 hours'}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {/* Last Detection */}
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="truncate">
              {sensor.lastFlowDetected 
                ? formatDistanceToNow(sensor.lastFlowDetected, { addSuffix: true })
                : 'Never'}
            </span>
          </div>

          {/* Cylinder */}
          {sensor.tank_level !== undefined && (
            <div className="flex items-center gap-2 text-gray-600">
              <Cylinder className={`w-4 h-4 ${getBatteryColor(sensor.tank_level)}`} />
              <span>{sensor.tank_level}%</span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 col-span-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="truncate text-xs">
              {sensor.location.lat.toFixed(4)}, {sensor.location.lng.toFixed(4)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorCard;
