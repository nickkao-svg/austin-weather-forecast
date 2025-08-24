'use client';

import { DailyTemperature } from '@/lib/transform-helpers';
import { getMonthLabel } from '@/lib/date-helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyBreakdownModalProps {
  year: number;
  month: number;
  dailyTemperatures: DailyTemperature[];
  isOpen: boolean;
  onClose: () => void;
}

export default function DailyBreakdownModal({ 
  year, 
  month, 
  dailyTemperatures, 
  isOpen, 
  onClose 
}: DailyBreakdownModalProps) {
  if (!isOpen) return null;

  const chartData = dailyTemperatures.map(day => ({
    date: new Date(day.date).getDate(),
    temperature: day.temperature
  }));

  const averageTemp = Math.round(dailyTemperatures.reduce((sum, day) => sum + day.temperature, 0) / dailyTemperatures.length);
  const minTemp = Math.round(Math.min(...dailyTemperatures.map(day => day.temperature)));
  const maxTemp = Math.round(Math.max(...dailyTemperatures.map(day => day.temperature)));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              {getMonthLabel(month)} {year} - Daily Breakdown
            </h2>
            <p className="text-gray-600 font-medium">Temperature variations throughout the month</p>
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center">
            <div className="text-sm font-medium text-blue-100 mb-2">Average</div>
            <div className="text-3xl font-black">{averageTemp}°</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
            <div className="text-sm font-medium text-green-100 mb-2">Minimum</div>
            <div className="text-3xl font-black">{minTemp}°</div>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 text-white text-center">
            <div className="text-sm font-medium text-red-100 mb-2">Maximum</div>
            <div className="text-3xl font-black">{maxTemp}°</div>
          </div>
        </div>

        {/* Temperature Chart */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Temperature Trend</h3>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number) => [`${Math.round(value)}°`, 'Temperature']}
                    labelFormatter={(label) => `Day ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Daily Table */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Daily Temperatures</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Temperature (°F)</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyTemperatures.map((day, index) => (
                    <tr key={index} className={`border-t border-gray-100 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-black text-gray-900">
                          {Math.round(day.temperature)}°
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
