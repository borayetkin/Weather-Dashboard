# Weather Dashboard

A real-time weather dashboard application built with Next.js, TypeScript, and Tailwind CSS. This application allows users to search for weather data by city name, displays current weather conditions, and maintains a search history.

## Features

- Search for weather data by city name
- Display current weather conditions including:
  - Temperature (Celsius)
  - Weather description with icon
  - Humidity
  - Wind speed
- Recent searches history (last 5 searches)
- Responsive design for mobile, tablet, and desktop
- Error handling for invalid searches or API failures

## Tech Stack

- Next.js 14+
- TypeScript
- Tailwind CSS
- Axios for API requests
- OpenWeatherMap API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenWeatherMap API key (free tier available)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd weather-dashboard
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the root directory with your OpenWeatherMap API key:

   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Future Enhancements

- Toggle between Celsius and Fahrenheit units
- 5-day weather forecast
- State management with Redux Toolkit or Zustand
- Data fetching with React Query or SWR
- Additional weather details and visualizations

## License

This project is licensed under the MIT License.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather data API
- [Next.js](https://nextjs.org/) documentation and community
