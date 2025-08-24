# Austin Weather Forecast

A Next.js application that computes Austin, TX monthly climatology from the past 10 years and forecasts monthly average temperatures for the next 12 months.

## Features

- Fetches historical weather data from Open-Meteo ERA5 API
- Computes 10-year climatology for each month
- Generates 12-month temperature forecasts
- Interactive UI with monthly forecast cards
- Detailed historical distribution modal with statistics and histogram
- Mobile-responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts for data visualization

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

- `GET /api/weather/historical` - Fetches 10 years of daily temperature data
- `GET /api/weather/forecast-monthly` - Computes climatology and generates forecasts

## Data Source

Uses Open-Meteo Historical Weather (ERA5) API for Austin, TX coordinates (30.2672, -97.7431) with America/Chicago timezone.
