'use client';

import { CityConfig, CITIES } from '@/lib/city-config';

interface CitySelectorProps {
  selectedCity: CityConfig;
  onCityChange: (city: CityConfig) => void;
}

export default function CitySelector({ selectedCity, onCityChange }: CitySelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {CITIES.map((city) => (
        <button
          key={city.id}
          onClick={() => onCityChange(city)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-medium ${
            selectedCity.id === city.id
              ? 'bg-white text-blue-600 shadow-lg scale-105'
              : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
          }`}
        >
          <span className="text-lg">{city.emoji}</span>
          <span>{city.name}</span>
        </button>
      ))}
    </div>
  );
}
