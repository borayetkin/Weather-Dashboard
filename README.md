# Weather Dashboard

A responsive weather application built with Next.js, React Query, and Zustand that lets users search for weather information by city name. The app displays current weather conditions and a 5-day forecast.

## Features

- Search for any city to get current weather data
- View 5-day weather forecast
- Toggle between Celsius and Fahrenheit
- Search history that persists between sessions
- Responsive design for mobile, tablet, and desktop
- Beautiful UI with dynamic backgrounds based on weather conditions

## Setup & Running the Project

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn

### Installation

1. Clone this repository

```
git clone https://github.com/yourusername/Weather-Dashboard.git
cd Weather-Dashboard
```

2. Install dependencies

```
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your OpenWeatherMap API key:

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

### Getting an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/) and create a free account
2. Navigate to the "API Keys" section in your account dashboard
3. Generate a new API key (the free tier is sufficient for this project)
4. Copy the key to your `.env.local` file

### Running the Application

Development mode:

```
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

Build for production:

```
npm run build
npm start
# or
yarn build
yarn start
```

## Technology Stack

- **Frontend**: Next.js 14 with React 18
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Styling**: Tailwind CSS
- **TypeScript**: For type safety
- **API**: OpenWeatherMap

## Project Structure

- `src/app`: Next.js page components
- `src/components`: Reusable UI components
- `src/hooks`: Custom React hooks
- `src/store`: Zustand store configuration
- `src/types`: TypeScript type definitions
- `src/utils`: Utility functions

## Assumptions and Design Decisions

### Weather Data

- I focused on the most commonly searched weather metrics (temperature, humidity, wind)
- For the 5-day forecast, I display one data point per day rather than every 3-hour interval

### User Experience

- I used city suggestions to help users find cities faster
- The app remembers the last 5 searches to make it easier to check weather for common locations
- Weather backgrounds change based on conditions to give visual cues about the weather

### Technical Choices

- Zustand was chosen over Redux for its simplicity and smaller bundle size
- React Query handles all data fetching to make caching and refetching easier
- I stored minimal data in localStorage to keep the app responsive

### Design Approach

- Mobile-first design with breakpoints for tablet and desktop
- Used a dark theme with weather-appropriate accents for better readability
- Focused on accessible design with proper contrast and keyboard navigation
