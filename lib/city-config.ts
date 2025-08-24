export interface CityConfig {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  emoji: string;
  description: string;
}

export const CITIES: CityConfig[] = [
  {
    id: 'austin',
    name: 'Austin',
    latitude: 30.2672,
    longitude: -97.7431,
    timezone: 'America/Chicago',
    emoji: '🤠',
    description: 'Live Music Capital'
  },
  {
    id: 'san-diego',
    name: 'San Diego',
    latitude: 32.7157,
    longitude: -117.1611,
    timezone: 'America/Los_Angeles',
    emoji: '🌊',
    description: 'America\'s Finest City'
  },
  {
    id: 'dallas',
    name: 'Dallas',
    latitude: 32.7767,
    longitude: -96.7970,
    timezone: 'America/Chicago',
    emoji: '🏢',
    description: 'Big D'
  }
];

export function getCityById(id: string): CityConfig | undefined {
  return CITIES.find(city => city.id === id);
}

export function getDefaultCity(): CityConfig {
  return CITIES[0]; // Austin as default
}
