'use client';

import { useState } from 'react';
import { MonthSummary, ForecastItem } from '@/lib/transform-helpers';
import { getMonthLabel } from '@/lib/date-helpers';
import YearlyDailyBreakdown from './YearlyDailyBreakdown';

interface ClimatologyModalProps {
  monthData: MonthSummary | null;
  forecastData: ForecastItem[] | null;
  historicalData: Record<string, any[]>;
  isOpen: boolean;
  onClose: () => void;
}

export default function ClimatologyModal({ monthData, forecastData, historicalData, isOpen, onClose }: ClimatologyModalProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showDailyBreakdown, setShowDailyBreakdown] = useState(false);

  if (!isOpen || !monthData) return null;

  // Generate yearly data from historical data
  const yearlyData = (historicalData[monthData.month.toString()] || [])
    .map((yearData: any) => {
      const temperatures = yearData.observations?.map((obs: any) => {
        const temp = obs.properties.temperature?.value;
        return temp !== null && temp !== undefined ? (temp * 9/5) + 32 : null; // Convert to Fahrenheit
      }) || [];
      const validTemperatures = temperatures.filter((t: number) => t !== null && !isNaN(t));
      
      return {
        year: yearData.year,
        average: validTemperatures.length > 0 ? validTemperatures.reduce((a: number, b: number) => a + b, 0) / validTemperatures.length : 0,
        count: validTemperatures.length,
        dailyTemperatures: yearData.observations?.map((obs: any) => ({
          date: obs.properties.timestamp.split('T')[0],
          temperature: obs.properties.temperature?.value !== null && obs.properties.temperature?.value !== undefined 
            ? (obs.properties.temperature.value * 9/5) + 32 
            : null
        })).filter((day: any) => day.temperature !== null) || []
      };
    })
    .filter(yearly => yearly.count > 0)
    .sort((a, b) => b.year - a.year); // Sort by year descending

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    setShowDailyBreakdown(true);
  };

  const closeDailyBreakdown = () => {
    setShowDailyBreakdown(false);
    setSelectedYear(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-6xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {getMonthLabel(monthData.month)} Climate Analysis
            </h3>
            <p className="text-gray-600">Comprehensive weather data and historical patterns</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-8">
          {/* Section 1: Historical Average */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900">Historical Average</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="text-sm text-gray-600 font-medium mb-1">Average Temperature</div>
                                 <div className="text-3xl font-black text-blue-600">{Math.round(monthData.meanTemp || 0)}°F</div>
                <div className="text-xs text-gray-500 mt-1">
                  {monthData.count ? `Based on ${monthData.count} forecast periods` : 'Based on historical averages'}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="text-sm text-gray-600 font-medium mb-1">Temperature Range</div>
                                 <div className="text-2xl font-bold text-gray-900">
                   {Math.round(monthData.minTemp || 0)}° - {Math.round(monthData.maxTemp || 0)}°
                 </div>
                <div className="text-xs text-gray-500 mt-1">Min to Max</div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="text-sm text-gray-600 font-medium mb-1">Data Source</div>
                <div className="text-lg font-semibold text-gray-900">National Weather Service</div>
                <div className="text-xs text-gray-500 mt-1">Official government data</div>
              </div>
            </div>
          </div>

          {/* Section 2: Year Breakdown */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900">Year-by-Year Breakdown</h4>
              </div>
              <div className="text-sm text-gray-600">
                {yearlyData.length} years of data available
              </div>
            </div>

            {/* Debug info */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-sm text-yellow-800">
                Debug: Found {yearlyData.length} years of data for month {monthData.month}
              </div>
            </div>

            {yearlyData.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {yearlyData.map((yearly) => (
                  <button
                    key={yearly.year}
                    onClick={() => handleYearClick(yearly.year)}
                    className="group bg-white rounded-xl p-4 text-center cursor-pointer hover:bg-purple-50 transition-all duration-300 border border-gray-200 hover:border-purple-300 hover:shadow-lg hover:scale-105"
                  >
                    <div className="text-sm text-gray-600 font-medium mb-1">{yearly.year}</div>
                    <div className="text-2xl font-black text-purple-600 mb-1">{Math.round(yearly.average)}°</div>
                    <div className="text-xs text-gray-500 mb-2">{yearly.count} days</div>
                    <div className="text-xs text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click for daily details →
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📊</div>
                <div className="text-lg font-medium text-gray-700 mb-2">No Historical Data Available</div>
                <div className="text-gray-500">Historical observations may not be available for this location or time period.</div>
              </div>
            )}
          </div>

          {/* Section 3: Forecast Data */}
          {forecastData && forecastData.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900">12-Month Forecast</h4>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {forecastData.slice(0, 12).map((forecast, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="text-sm text-gray-600 font-medium mb-1">
                      {getMonthLabel(forecast.month)}
                    </div>
                                         <div className="text-xl font-bold text-green-600">
                       {Math.round(forecast.forecastMean || 0)}°
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 text-sm text-blue-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Data source: National Weather Service API
          </div>
        </div>

        {/* Daily Breakdown Modal */}
        {showDailyBreakdown && selectedYear && (
          <YearlyDailyBreakdown
            yearlyData={yearlyData}
            month={monthData.month}
            isOpen={showDailyBreakdown}
            onClose={closeDailyBreakdown}
          />
        )}
      </div>
    </div>
  );
}
