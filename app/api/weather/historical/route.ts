import { NextRequest, NextResponse } from 'next/server';
import { getTenYearStartDate, getYesterdayISO } from '@/lib/date-helpers';
import { WeatherRow } from '@/lib/transform-helpers';
import { getCityById, getDefaultCity } from '@/lib/city-config';

// NWS API base URL
const NWS_API_BASE = 'https://api.weather.gov';

// Helper function to get grid points for a location
async function getGridPoints(latitude: number, longitude: number) {
  const response = await fetch(`${NWS_API_BASE}/points/${latitude},${longitude}`, {
    headers: {
      'User-Agent': 'AustinWeatherApp/1.0 (https://github.com/yourusername/austin-weather)',
      'Accept': 'application/geo+json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`NWS points API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Helper function to get nearby stations
async function getNearbyStations(stationsUrl: string) {
  const response = await fetch(stationsUrl, {
    headers: {
      'User-Agent': 'AustinWeatherApp/1.0 (https://github.com/yourusername/austin-weather)',
      'Accept': 'application/geo+json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`NWS stations API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Helper function to get historical observations
async function getHistoricalObservations(stationId: string, startDate: string, endDate: string) {
  const response = await fetch(`${NWS_API_BASE}/stations/${stationId}/observations?start=${startDate}&end=${endDate}`, {
    headers: {
      'User-Agent': 'AustinWeatherApp/1.0 (https://github.com/yourusername/austin-weather)',
      'Accept': 'application/geo+json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`NWS observations API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('city') || 'austin';
    
    const city = getCityById(cityId) || getDefaultCity();
    
    // Step 1: Get grid points for the location
    const pointsData = await getGridPoints(city.latitude, city.longitude);
    
    if (!pointsData.properties?.observationStations) {
      throw new Error('No observation stations available for this location');
    }
    
    // Step 2: Get nearby stations
    const stationsData = await getNearbyStations(pointsData.properties.observationStations);
    
    if (!stationsData.features || stationsData.features.length === 0) {
      throw new Error('No weather stations found for this location');
    }
    
    // Step 3: Get the closest station (first in the list)
    const closestStation = stationsData.features[0];
    const stationId = closestStation.properties.stationIdentifier;
    
    // Step 4: Get historical observations (last 30 days as NWS has limited historical data)
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const observationsData = await getHistoricalObservations(stationId, startDate, endDate);
    
    if (!observationsData.features) {
      throw new Error('No historical observations available');
    }
    
    // Step 5: Process observations into WeatherRow format
    const historicalData: WeatherRow[] = observationsData.features
      .map((observation: any) => {
        const properties = observation.properties;
        const timestamp = properties.timestamp;
        const temperature = properties.temperature?.value;
        
        if (timestamp && temperature !== null && temperature !== undefined) {
          // Convert from Celsius to Fahrenheit if needed
          // NWS typically provides temperatures in Celsius
          const tempF = (temperature * 9/5) + 32;
          
          return {
            date: timestamp.split('T')[0],
            tmean: Math.round(tempF * 10) / 10
          };
        }
        return null;
      })
      .filter((item: WeatherRow | null) => item !== null);
    
    return NextResponse.json({
      historicalData,
      source: 'NWS API',
      station: {
        id: stationId,
        name: closestStation.properties.name,
        distance: closestStation.properties.distance
      },
      location: {
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude
      },
      dateRange: {
        start: startDate,
        end: endDate
      }
    });
    
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 502 }
    );
  }
}
