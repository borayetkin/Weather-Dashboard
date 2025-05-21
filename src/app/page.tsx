"use client";

import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import WeatherDisplay from "../components/WeatherDisplay";
import SearchHistory from "../components/SearchHistory";
import ErrorDisplay from "../components/ErrorDisplay";
import ForecastDisplay from "../components/ForecastDisplay";
import {
  fetchWeatherData,
  getSearchHistory,
  saveSearchToHistory,
  fetchForecastData,
  processForecastData,
} from "../utils/weatherUtils";
import {
  WeatherData,
  SearchHistoryItem,
  DailyForecast,
} from "../types/weather";

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<DailyForecast[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMetric, setIsMetric] = useState(true);

  // Load search history from localStorage on component mount
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  const handleSearch = async (city: string) => {
    setError("");
    setIsLoading(true);

    try {
      // Fetch both current weather and forecast data
      const weatherDataPromise = fetchWeatherData(city);
      const forecastDataPromise = fetchForecastData(city);

      // Wait for both requests to complete
      const [weatherResult, forecastResult] = await Promise.all([
        weatherDataPromise,
        forecastDataPromise,
      ]);

      setWeatherData(weatherResult);

      // Process the forecast data into daily format
      const processedForecast = processForecastData(forecastResult);
      setForecastData(processedForecast);

      // Save to search history
      saveSearchToHistory(city);
      setSearchHistory(getSearchHistory());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between Celsius and Fahrenheit
  const toggleTemperatureUnit = () => {
    setIsMetric(!isMetric);
  };

  return (
    <main className="min-h-screen bg-gray-700 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-24 left-12 w-64 h-64 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-36 right-12 w-72 h-72 bg-gray-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-56 h-56 bg-teal-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:px-8 relative">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-500">
            Weather Dashboard
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Search and History */}
          <div className="lg:w-2/5 space-y-4">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-6 shadow-lg h-[250px] flex flex-col">
              <div className="flex items-center mb-4">
                <svg
                  className="w-10 h-10 text-white mr-3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
                <h2 className="text-xl font-medium text-white">
                  Search for a city
                </h2>
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                  <p className="text-sm text-white/90 mt-3 pl-1 font-medium">
                    Search for a city to see weather information
                  </p>
                </div>
                <ErrorDisplay message={error} onDismiss={() => setError("")} />
              </div>
            </div>

            <div className="bg-gray-600/80 backdrop-blur-sm rounded-xl p-5 shadow-md border border-gray-500/50 text-white">
              <SearchHistory
                history={searchHistory}
                onSelectCity={handleSearch}
                setSearchHistory={setSearchHistory}
              />
            </div>
          </div>

          {/* Right Column - Weather Display and Forecast */}
          <div className="lg:w-3/5 space-y-4">
            {weatherData && !isLoading ? (
              <div className="animate-fadeIn">
                <WeatherDisplay
                  weatherData={weatherData}
                  isMetric={isMetric}
                  onToggleUnit={toggleTemperatureUnit}
                />
              </div>
            ) : (
              <div className="h-[250px] flex flex-col items-center justify-center p-6 bg-gray-600/80 backdrop-blur-sm rounded-xl border border-gray-500/50 shadow-md text-white">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-200 text-lg font-medium">
                      Loading weather data...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="mb-6 relative">
                      <svg
                        className="w-20 h-20 text-blue-400 animate-pulse"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-teal-200"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-200 text-lg font-medium">
                      Search for a city to see weather information
                    </p>
                    <p className="text-gray-300 text-sm mt-2 animate-pulse">
                      Get current conditions and 5-day forecast
                    </p>
                  </div>
                )}
              </div>
            )}

            {forecastData.length > 0 && !isLoading && (
              <div className="animate-fadeIn">
                <ForecastDisplay forecasts={forecastData} isMetric={isMetric} />
              </div>
            )}
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-400">
          <p>
            Data provided by{" "}
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              OpenWeatherMap
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
