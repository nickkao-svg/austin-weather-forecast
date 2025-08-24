'use client';

import { useState, useEffect } from 'react';
import MonthCard from './components/MonthCard';
import ClimatologyModal from './components/ClimatologyModal';
import { ForecastItem, MonthSummary } from '@/lib/transform-helpers';
import { getChicagoToday, getMonthLabel } from '@/lib/date-helpers';

interface ForecastData {
  climatology: MonthSummary[];
  forecastNext12: ForecastItem[];
}

export default function Home() {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<MonthSummary | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataSourceModalOpen, setDataSourceModalOpen] = useState(false);

  useEffect(() => {
    fetchForecastData();
  }, []);

  const fetchForecastData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/weather/forecast-monthly');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const forecastData: ForecastData = await response.json();
      setData(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forecast data');
    } finally {
      setLoading(false);
    }
  };

  const handleMonthClick = (monthNumber: number) => {
    const monthData = data?.climatology.find(c => c.month === monthNumber);
    if (monthData) {
      setSelectedMonth(monthData);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMonth(null);
  };

  const getCurrentMonth = () => {
    return getChicagoToday().getMonth() + 1; // 1-12
  };

  const getWeatherEmoji = (temp: number) => {
    if (temp >= 90) return '🔥';
    if (temp >= 80) return '☀️';
    if (temp >= 70) return '🌤️';
    if (temp >= 60) return '🌥️';
    if (temp >= 50) return '⛅';
    if (temp >= 40) return '🌦️';
    if (temp >= 30) return '❄️';
    return '🥶';
  };

  const getSeasonEmoji = (month: number) => {
    if (month >= 3 && month <= 5) return '🌸'; // Spring
    if (month >= 6 && month <= 8) return '🌻'; // Summer
    if (month >= 9 && month <= 11) return '🍂'; // Fall
    return '❄️'; // Winter
  };

  const getFunMessage = (temp: number) => {
    if (temp >= 90) return 'Hot hot hot! 🔥';
    if (temp >= 80) return 'Perfect pool weather! 🏊‍♂️';
    if (temp >= 70) return 'Ideal for outdoor fun! 🎯';
    if (temp >= 60) return 'Great for a walk! 🚶‍♂️';
    if (temp >= 50) return 'Light jacket weather! 🧥';
    if (temp >= 40) return 'Bundle up! 🧣';
    if (temp >= 30) return 'Brrr, stay warm! 🧤';
    return 'Polar bear weather! ��‍❄️';
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 90) return 'from-red-500 to-orange-500';
    if (temp >= 80) return 'from-orange-400 to-yellow-400';
    if (temp >= 70) return 'from-yellow-400 to-green-400';
    if (temp >= 60) return 'from-green-400 to-blue-400';
    if (temp >= 50) return 'from-blue-400 to-indigo-400';
    if (temp >= 40) return 'from-indigo-400 to-purple-400';
    if (temp >= 30) return 'from-purple-400 to-pink-400';
    return 'from-pink-400 to-red-400';
  };

  const createMonthCard = (monthNumber: number) => {
    const currentMonth = getCurrentMonth();
    const isCurrentMonth = monthNumber === currentMonth;
    
    // Find the climatology data for this month
    const monthData = data?.climatology.find(c => c.month === monthNumber);
    const forecastData = data?.forecastNext12.find(f => f.month === monthNumber);
    
    if (!monthData) return null;

    const temp = monthData.mean || 0;
    const weatherEmoji = getWeatherEmoji(temp);
    const seasonEmoji = getSeasonEmoji(monthNumber);
    const funMessage = getFunMessage(temp);
    const tempColor = getTemperatureColor(temp);

    return (
      <div
        key={monthNumber}
        className={`group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
          isCurrentMonth 
            ? 'bg-white border border-gray-300 shadow-sm' 
            : 'bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 border border-gray-200 hover:border-blue-300'
        }`}
        onClick={() => handleMonthClick(monthNumber)}
      >
        {/* Temperature gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${tempColor} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
        
        {/* Current month indicator */}
        {isCurrentMonth && (
          <div className="absolute top-3 right-3 bg-gray-600 text-white text-xs font-medium px-2 py-1 rounded-md">
            Current month
          </div>
        )}
        
        <div className="relative z-10 p-6">
          {/* Header with season and month */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{seasonEmoji}</span>
                             <div className={`text-lg font-bold ${
                 isCurrentMonth ? 'text-gray-900' : 'text-gray-700'
               }`}>
                 {getMonthLabel(monthNumber)}
               </div>
             </div>
             <div className={`text-3xl font-black opacity-20 ${
               isCurrentMonth ? 'text-gray-500' : 'text-gray-400'
             }`}>
              {monthNumber.toString().padStart(2, '0')}
            </div>
          </div>
          
          {/* Main temperature display */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-5xl">{weatherEmoji}</span>
              <div className={`text-5xl font-black bg-gradient-to-r ${tempColor} bg-clip-text text-transparent`}>
                {Math.round(temp)}°
              </div>
            </div>
            
                         {/* Fun message */}
             <div className={`text-sm font-medium ${
               isCurrentMonth ? 'text-gray-700' : 'text-gray-600'
             }`}>
               {funMessage}
             </div>
           </div>
           
           {/* Historical context */}
           <div className={`text-xs text-center ${
             isCurrentMonth ? 'text-gray-600' : 'text-gray-500'
           }`}>
            Historical average (10 years)
          </div>
          
                     {/* Hover indicator */}
           <div className={`mt-4 text-xs font-medium text-center transition-opacity duration-300 ${
             isCurrentMonth ? 'text-gray-600' : 'text-blue-500'
           } opacity-0 group-hover:opacity-100`}>
            Click for details →
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative mb-8">
            <div className="text-8xl mb-4 animate-pulse">🌤️</div>
            <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-xl font-bold mb-2">Loading Austin's Weather</p>
          <div className="text-blue-100">Gathering climate data...</div>
          <div className="mt-4 text-blue-200 text-sm">☀️ 🌧️ ❄️ 🌪️</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-red-600 flex items-center justify-center">
        <div className="text-center text-white bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <div className="text-8xl mb-4">🌩️</div>
          <div className="text-2xl font-bold mb-4">Oops! Connection Error</div>
          <p className="text-red-100 mb-6">{error}</p>
          <button
            onClick={fetchForecastData}
            className="bg-white text-red-600 px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
          >
            Try Again 🔄
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-6xl animate-bounce" style={{animationDelay: '0s'}}>🌡️</div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Austin Weather
            </h1>
            <div className="text-6xl animate-bounce" style={{animationDelay: '0.5s'}}>🌡️</div>
          </div>
          <p className="text-2xl text-gray-700 font-medium mb-2">
            Monthly Climate Patterns
          </p>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore <span className="font-semibold text-blue-600">10 years of Austin weather data</span> to see typical temperatures for each month. 
            Click any month for detailed stats and predictions.
          </p>
          
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">🌎</span>
            <button
              onClick={() => setDataSourceModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl group"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Data Source</span>
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </button>
            <span className="text-2xl">🌎</span>
          </div>
        </div>
        
        {/* Month Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 12 }, (_, i) => createMonthCard(i + 1))}
        </div>
        
        {/* Footer */}
        <div className="mt-20 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-3xl">📊</span>
            <p className="text-gray-600 font-medium">
              Powered by Open-Meteo ERA5 • Updated daily
            </p>
            <span className="text-3xl">📊</span>
          </div>
          <div className="text-gray-500 text-sm">
            🌤️ Austin's weather, made simple and fun! 🌤️
          </div>
        </div>
      </div>

      <ClimatologyModal
        monthData={selectedMonth}
        forecastData={data?.forecastNext12 || null}
        isOpen={modalOpen}
        onClose={closeModal}
      />

      {/* Data Source Modal */}
      {dataSourceModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-white/50">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🔬</span>
                <h2 className="text-3xl font-black text-gray-900">Data Source</h2>
              </div>
              <button
                onClick={() => setDataSourceModalOpen(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">Open-Meteo ERA5</h3>
                </div>
                <p className="text-blue-100 text-lg">High-resolution climate reanalysis data from the European Centre for Medium-Range Weather Forecasts</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📍</span>
                    <h4 className="font-bold text-gray-900">Location</h4>
                  </div>
                  <p className="text-gray-600">Austin, TX (30.2672°N, 97.7431°W)</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📅</span>
                    <h4 className="font-bold text-gray-900">Time Period</h4>
                  </div>
                  <p className="text-gray-600">Last 10 years of daily data</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🌡️</span>
                    <h4 className="font-bold text-gray-900">Data Points</h4>
                  </div>
                  <p className="text-gray-600">Temperature (mean, max, min)</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🔄</span>
                    <h4 className="font-bold text-gray-900">Update Frequency</h4>
                  </div>
                  <p className="text-gray-600">Daily updates</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🧮</span>
                  <h4 className="font-bold text-gray-900">Methodology</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Monthly climatology is computed from daily temperature averages across all years. 
                  Forecasts are based on historical patterns for each month. Missing daily means are 
                  calculated as (max + min) / 2. All temperatures are converted to Fahrenheit.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
