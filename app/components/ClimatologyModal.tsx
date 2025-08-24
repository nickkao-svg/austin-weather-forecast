'use client';

import { useState } from 'react';
import { MonthSummary, ForecastItem } from '@/lib/transform-helpers';
import { getMonthLabel } from '@/lib/date-helpers';
import DailyBreakdownModal from './DailyBreakdownModal';

interface ClimatologyModalProps {
  monthData: MonthSummary | null;
  forecastData: ForecastItem[] | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ClimatologyModal({ monthData, forecastData, isOpen, onClose }: ClimatologyModalProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [dailyModalOpen, setDailyModalOpen] = useState(false);

  if (!isOpen || !monthData) return null;

  // Find the current forecast for this month
  const currentForecast = forecastData?.find(forecast => forecast.month === monthData.month);

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    setDailyModalOpen(true);
  };

  const closeDailyModal = () => {
    setDailyModalOpen(false);
    setSelectedYear(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              {getMonthLabel(monthData.month)} Climate Analysis
            </h2>
            <p className="text-gray-600 font-medium">10-year historical patterns & predictions</p>
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

        {/* Main Content */}
        <div className="space-y-8">
          {/* Climatology Summary */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Historical Average</div>
              <div className="text-5xl font-black">{Math.round(monthData.mean || 0)}°</div>
              <div className="text-blue-100 text-sm mt-2">Based on {monthData.count} days of data</div>
            </div>
          </div>

          {/* Historical and Forecast Data Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Temperature Patterns</h3>
            
            {/* Historical Data */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Historical Yearly Averages
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {monthData.yearlyAverages.map((yearly) => (
                  <div 
                    key={yearly.year} 
                    className="group bg-white rounded-xl p-4 text-center cursor-pointer hover:bg-blue-50 transition-all duration-300 border border-gray-100 hover:border-blue-300 hover:shadow-lg"
                    onClick={() => handleYearClick(yearly.year)}
                  >
                    <div className="text-sm text-gray-600 font-medium">{yearly.year}</div>
                    <div className="text-2xl font-black text-blue-600 mt-1">{Math.round(yearly.average)}°</div>
                    <div className="text-xs text-gray-500 mt-1">{yearly.count} days</div>
                    <div className="text-xs text-blue-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View details →
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Forecast Data */}
            {currentForecast && (
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  Current Forecast
                </h4>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
                  <div className="text-sm font-medium text-green-100 mb-2">{currentForecast.label}</div>
                  <div className="text-4xl font-black">{Math.round(currentForecast.forecastMean || 0)}°</div>
                  <div className="text-green-100 text-sm mt-2 font-medium">PREDICTED TEMPERATURE</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Statistics Grid */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Statistical Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="text-sm text-gray-600 font-medium">Min</div>
                <div className="text-xl font-black text-blue-600">{Math.round(monthData.min || 0)}°</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="text-sm text-gray-600 font-medium">25th %</div>
                <div className="text-xl font-black text-purple-600">{Math.round(monthData.p25 || 0)}°</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="text-sm text-gray-600 font-medium">Median</div>
                <div className="text-xl font-black text-indigo-600">{Math.round(monthData.p50 || 0)}°</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="text-sm text-gray-600 font-medium">75th %</div>
                <div className="text-xl font-black text-purple-600">{Math.round(monthData.p75 || 0)}°</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="text-sm text-gray-600 font-medium">Max</div>
                <div className="text-xl font-black text-red-600">{Math.round(monthData.max || 0)}°</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-4 bg-gray-50 rounded-full px-6 py-3 text-sm text-gray-600">
                <span>Sample size: <span className="font-bold">{monthData.count}</span> days</span>
                <span>•</span>
                <span>Std dev: <span className="font-bold">{Math.round(monthData.std || 0)}°</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Breakdown Modal */}
        {selectedYear && (
          <DailyBreakdownModal
            year={selectedYear}
            month={monthData.month}
            dailyTemperatures={monthData.yearlyAverages.find(y => y.year === selectedYear)?.dailyTemperatures || []}
            isOpen={dailyModalOpen}
            onClose={closeDailyModal}
          />
        )}
      </div>
    </div>
  );
}
