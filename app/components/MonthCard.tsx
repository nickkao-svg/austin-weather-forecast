'use client';

import { ForecastItem } from '@/lib/transform-helpers';

interface MonthCardProps {
  forecast: ForecastItem;
  onClick: () => void;
}

export default function MonthCard({ forecast, onClick }: MonthCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {forecast.label}
        </h3>
        <div className="text-3xl font-bold text-blue-600">
          {forecast.forecastMean !== null 
            ? `${Math.round(forecast.forecastMean)}°F`
            : 'N/A'
          }
        </div>
      </div>
    </div>
  );
}
