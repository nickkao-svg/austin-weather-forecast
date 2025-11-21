import { getMonthFromDate } from './date-helpers';
import { mean, std, quantile, min, max, histogram } from './stats-helpers';

export interface WeatherRow {
  date: string;
  tmean: number | null;
}

export interface DailyTemperature {
  date: string;
  temperature: number;
}

export interface YearlyAverage {
  year: number;
  average: number;
  count: number;
  dailyTemperatures: DailyTemperature[];
}

export interface MonthSummary {
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  meanTemp: number | null;
  count: number;
  minTemp: number | null;
  maxTemp: number | null;
  p25: number | null;
  p50: number | null;
  p75: number | null;
  std: number | null;
  histogram: { binStart: number; binEnd: number; count: number }[];
  yearlyAverages: YearlyAverage[];
}

export interface ForecastItem {
  label: string;
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  year: number;
  forecastMean: number | null;
}

export function toMonthlyClimatology(rows: WeatherRow[]): MonthSummary[] {
  const monthlyData: { [key: number]: number[] } = {};
  const yearlyMonthlyData: { [key: number]: { [key: number]: number[] } } = {};
  
  // Group daily temperatures by month and year
  rows.forEach(row => {
    if (row.tmean !== null) {
      const month = getMonthFromDate(row.date);
      const year = new Date(row.date).getFullYear();
      
      if (!monthlyData[month]) {
        monthlyData[month] = [];
      }
      monthlyData[month].push(row.tmean);
      
      if (!yearlyMonthlyData[month]) {
        yearlyMonthlyData[month] = {};
      }
      if (!yearlyMonthlyData[month][year]) {
        yearlyMonthlyData[month][year] = [];
      }
      yearlyMonthlyData[month][year].push(row.tmean);
    }
  });
  
  // Calculate statistics for each month
  const climatology: MonthSummary[] = [];
  for (let month = 1; month <= 12; month++) {
    const values = monthlyData[month] || [];
    const yearlyData = yearlyMonthlyData[month] || {};
    
    // Calculate yearly averages with daily temperatures
    const yearlyAverages: YearlyAverage[] = Object.entries(yearlyData)
      .map(([year, temps]) => {
        // Get the original rows for this year/month to preserve dates
        const dailyTemps = rows
          .filter(row => {
            const rowMonth = getMonthFromDate(row.date);
            const rowYear = new Date(row.date).getFullYear();
            return rowMonth === month && rowYear === parseInt(year) && row.tmean !== null;
          })
          .map(row => ({
            date: row.date,
            temperature: row.tmean!
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return {
          year: parseInt(year),
          average: mean(temps) || 0,
          count: temps.length,
          dailyTemperatures: dailyTemps
        };
      })
      .sort((a, b) => a.year - b.year);
    
    climatology.push({
      month: month as any,
      mean: mean(values),
      count: values.length,
      min: min(values),
      max: max(values),
      p25: quantile(values, 25),
      p50: quantile(values, 50),
      p75: quantile(values, 75),
      std: std(values),
      histogram: histogram(values, 1),
      yearlyAverages
    });
  }
  
  return climatology;
}

export function buildNext12Forecast(climatology: MonthSummary[], fromDate: Date): ForecastItem[] {
  const forecast: ForecastItem[] = [];
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let currentDate = new Date(fromDate);
  
  // Calculate overall warming trend from historical data
  const allYearlyAverages = climatology.flatMap(c => c.yearlyAverages);
  const years = allYearlyAverages.map(y => y.year).sort((a, b) => a - b);
  const uniqueYears = [...new Set(years)];
  
  let warmingTrend = 0;
  if (uniqueYears.length >= 2) {
    const firstYearAvg = allYearlyAverages
      .filter(y => y.year === uniqueYears[0])
      .reduce((sum, y) => sum + y.average, 0) / 12;
    const lastYearAvg = allYearlyAverages
      .filter(y => y.year === uniqueYears[uniqueYears.length - 1])
      .reduce((sum, y) => sum + y.average, 0) / 12;
    warmingTrend = (lastYearAvg - firstYearAvg) / (uniqueYears[uniqueYears.length - 1] - uniqueYears[0]);
  }
  
  for (let i = 0; i < 12; i++) {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const monthData = climatology.find(c => c.month === month);
    
    if (monthData?.mean) {
      // Apply warming trend and add some seasonal variation
      const yearsSinceData = year - uniqueYears[uniqueYears.length - 1];
      const trendAdjustment = warmingTrend * yearsSinceData;
      
      // Add small random variation (±2°F) to make predictions more realistic
      const randomVariation = (Math.random() - 0.5) * 4;
      
      const forecastTemp = monthData.mean + trendAdjustment + randomVariation;
      
      forecast.push({
        label: `${monthLabels[month - 1]} ${year}`,
        month: month as any,
        year,
        forecastMean: Math.round(forecastTemp * 10) / 10 // Round to 1 decimal place
      });
    } else {
      forecast.push({
        label: `${monthLabels[month - 1]} ${year}`,
        month: month as any,
        year,
        forecastMean: null
      });
    }
    
    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return forecast;
}
