import { NextRequest, NextResponse } from 'next/server';
import { getTenYearStartDate, getYesterdayISO } from '@/lib/date-helpers';
import { WeatherRow } from '@/lib/transform-helpers';
import { getCityById, getDefaultCity } from '@/lib/city-config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('city') || 'austin';
    
    const city = getCityById(cityId) || getDefaultCity();
    
    const startDate = getTenYearStartDate(city.timezone);
    const endDate = getYesterdayISO(city.timezone);
    
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${city.latitude}&longitude=${city.longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,temperature_2m_max,temperature_2m_min&timezone=${city.timezone}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.daily || !data.daily.time) {
      throw new Error('Invalid response format from Open-Meteo API');
    }
    
    const { time, temperature_2m_mean, temperature_2m_max, temperature_2m_min } = data.daily;
    
    const rows: WeatherRow[] = [];
    
    for (let i = 0; i < time.length; i++) {
      let tmean = temperature_2m_mean?.[i];
      
      // If mean is missing, compute from max and min
      if (tmean === null || tmean === undefined) {
        const tmax = temperature_2m_max?.[i];
        const tmin = temperature_2m_min?.[i];
        if (tmax !== null && tmax !== undefined && tmin !== null && tmin !== undefined) {
          tmean = (tmax + tmin) / 2;
        }
      }
      
      // Convert Celsius to Fahrenheit if temperature exists
      if (tmean !== null && tmean !== undefined) {
        tmean = (tmean * 9/5) + 32;
      }
      
      rows.push({
        date: time[i],
        tmean: tmean
      });
    }
    
    return NextResponse.json(rows);
    
  } catch (error) {
    console.error('Error fetching historical weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical weather data' },
      { status: 502 }
    );
  }
}
