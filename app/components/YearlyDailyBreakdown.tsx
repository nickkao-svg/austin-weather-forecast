'use client';

import { useState } from 'react';

interface DailyTemperature {
  date: string;
  temperature: number;
}

interface YearlyData {
  year: number;
  average: number;
  count: number;
  dailyTemperatures: DailyTemperature[];
}

interface YearlyDailyBreakdownProps {
  yearlyData: YearlyData[];
  month: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function YearlyDailyBreakdown({ 
  yearlyData, 
  month, 
  isOpen, 
  onClose 
}: YearlyDailyBreakdownProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'chart'>('grid');

  if (!isOpen) return null;

  const monthLabels = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getTemperatureColor = (temp: number) => {
    if (temp >= 90) return 'text-red-600 bg-red-50 border-red-200';
    if (temp >= 80) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (temp >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (temp >= 60) return 'text-green-600 bg-green-50 border-green-200';
    if (temp >= 50) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-purple-600 bg-purple-50 border-purple-200';
  };

  const getTemperatureGradient = (temp: number) => {
    if (temp >= 90) return 'from-red-500 to-red-600';
    if (temp >= 80) return 'from-orange-500 to-orange-600';
    if (temp >= 70) return 'from-yellow-500 to-yellow-600';
    if (temp >= 60) return 'from-green-500 to-green-600';
    if (temp >= 50) return 'from-blue-500 to-blue-600';
    return 'from-purple-500 to-purple-600';
  };

  const selectedYearData = selectedYear ? yearlyData.find(y => y.year === selectedYear) : null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-70">
      <div className="bg-white rounded-3xl p-8 max-w-7xl w-full shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {monthLabels[month - 1]} - Daily Breakdown by Year
            </h3>
            <p className="text-gray-600">Explore daily temperatures for each year over the past decade</p>
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

        {/* Year Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Select a Year</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {yearlyData.map((yearly) => (
              <button
                key={yearly.year}
                onClick={() => setSelectedYear(yearly.year)}
                className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedYear === yearly.year
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className="text-center">
                  <div className={`text-lg font-bold mb-1 ${
                    selectedYear === yearly.year ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {yearly.year}
                  </div>
                  <div className={`text-2xl font-black mb-1 ${
                    selectedYear === yearly.year ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {Math.round(yearly.average)}°
                  </div>
                  <div className="text-xs text-gray-500">{yearly.count} days</div>
                  {selectedYear === yearly.year && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Breakdown for Selected Year */}
        {selectedYearData && (
          <div className="space-y-6">
            {/* Year Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold mb-2">
                    {monthLabels[month - 1]} {selectedYear}
                  </h4>
                  <div className="text-purple-100">
                    {selectedYearData.count} days of observations • Average: {Math.round(selectedYearData.average)}°F
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black">{Math.round(selectedYearData.average)}°</div>
                  <div className="text-purple-100 text-sm">Average Temperature</div>
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-center">
              <div className="bg-gray-100 rounded-full p-1 flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-purple-600 shadow-md' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  📊 Grid View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white text-purple-600 shadow-md' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  📋 List View
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    viewMode === 'chart' 
                      ? 'bg-white text-purple-600 shadow-md' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  📈 Chart View
                </button>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div>
                <h5 className="text-lg font-semibold text-gray-700 mb-4">Daily Temperature Grid</h5>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid grid-cols-7 md:grid-cols-10 lg:grid-cols-15 gap-2">
                    {selectedYearData.dailyTemperatures.map((day, index) => {
                      const date = new Date(day.date);
                      const dayOfMonth = date.getDate();
                      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                      
                      return (
                        <div 
                          key={index}
                          className={`${getTemperatureColor(day.temperature)} rounded-lg p-3 text-center border transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer`}
                        >
                          <div className="text-xs text-gray-600 font-medium mb-1">
                            {dayOfWeek}
                          </div>
                          <div className="text-lg font-bold mb-1">
                            {dayOfMonth}
                          </div>
                          <div className="text-sm font-bold">
                            {Math.round(day.temperature)}°
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div>
                <h5 className="text-lg font-semibold text-gray-700 mb-4">Daily Temperature List</h5>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                    {selectedYearData.dailyTemperatures.map((day, index) => {
                      const date = new Date(day.date);
                      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                      const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      
                      return (
                        <div 
                          key={index}
                          className={`p-4 border-b border-r border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                            index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-gray-600 font-medium">
                                {dayOfWeek}
                              </div>
                              <div className="text-lg font-bold text-gray-900">
                                {monthDay}
                              </div>
                            </div>
                            <div className={`text-2xl font-bold ${getTemperatureColor(day.temperature).split(' ')[0]}`}>
                              {Math.round(day.temperature)}°
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Chart View */}
            {viewMode === 'chart' && (
              <div>
                <h5 className="text-lg font-semibold text-gray-700 mb-4">Temperature Trend Chart</h5>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-end justify-between h-64 gap-1">
                    {selectedYearData.dailyTemperatures.map((day, index) => {
                      const maxTemp = Math.max(...selectedYearData.dailyTemperatures.map(d => d.temperature));
                      const minTemp = Math.min(...selectedYearData.dailyTemperatures.map(d => d.temperature));
                      const height = ((day.temperature - minTemp) / (maxTemp - minTemp)) * 100;
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className={`w-full rounded-t-sm transition-all duration-300 hover:scale-110 cursor-pointer ${getTemperatureGradient(day.temperature)}`}
                            style={{ height: `${Math.max(height, 5)}%` }}
                            title={`${new Date(day.date).toLocaleDateString()}: ${Math.round(day.temperature)}°F`}
                          ></div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(day.date).getDate()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-4">
                    <span>Min: {Math.round(Math.min(...selectedYearData.dailyTemperatures.map(d => d.temperature)))}°F</span>
                    <span>Max: {Math.round(Math.max(...selectedYearData.dailyTemperatures.map(d => d.temperature)))}°F</span>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-sm text-gray-600 font-medium">Minimum</div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(Math.min(...selectedYearData.dailyTemperatures.map(d => d.temperature)))}°F
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-sm text-gray-600 font-medium">Average</div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(selectedYearData.average)}°F
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="text-sm text-gray-600 font-medium">Maximum</div>
                <div className="text-2xl font-bold text-red-600">
                  {Math.round(Math.max(...selectedYearData.dailyTemperatures.map(d => d.temperature)))}°F
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!selectedYearData && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">Select a Year Above</h4>
            <p className="text-gray-500">Choose any year from the past decade to view detailed daily temperature data</p>
          </div>
        )}

        {/* Data Source Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 text-sm text-blue-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Data source: National Weather Service API
          </div>
        </div>
      </div>
    </div>
  );
}

