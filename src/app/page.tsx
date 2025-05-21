"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import SearchBar from "../components/SearchBar";
import WeatherDisplay from "../components/WeatherDisplay";
import SearchHistory from "../components/SearchHistory";
import ErrorDisplay from "../components/ErrorDisplay";
import ForecastDisplay from "../components/ForecastDisplay";
import { useWeatherStore } from "../store/weatherStore";
import { useWeatherAndForecast } from "../hooks/useWeatherQueries";

export default function Home() {
  // State to track current search
  const [currentCity, setCurrentCity] = useState<string | null>(null);

  // Get only what we need from Zustand store
  const isMetric = useWeatherStore((state) => state.isMetric);
  const toggleTemperatureUnit = useWeatherStore(
    (state) => state.toggleTemperatureUnit
  );
  const searchHistory = useWeatherStore((state) => state.searchHistory);
  const addToSearchHistory = useWeatherStore(
    (state) => state.addToSearchHistory
  );
  const clearSearchHistory = useWeatherStore(
    (state) => state.clearSearchHistory
  );
  const setError = useWeatherStore((state) => state.setError);
  const error = useWeatherStore((state) => state.error);

  // Query client for manual invalidation
  const queryClient = useQueryClient();

  // Use React Query directly without copying to Zustand store
  const {
    weatherData,
    forecastData,
    isLoading,
    error: fetchError,
    refetch,
  } = useWeatherAndForecast(currentCity);

  // Handle search with useCallback to prevent unnecessary rerenders
  const handleSearch = useCallback(
    (city: string) => {
      // Reset error
      setError("");

      // Update current city
      setCurrentCity(city);

      // Add to search history if not empty
      if (city.trim()) {
        addToSearchHistory(city.trim());
      }

      // Force refetch
      queryClient.invalidateQueries({ queryKey: ["weather"] });
      queryClient.invalidateQueries({ queryKey: ["forecast"] });
    },
    [addToSearchHistory, queryClient, setError]
  );

  // Show fetch error if it exists
  if (fetchError && !error) {
    const errorMessage =
      fetchError instanceof Error
        ? fetchError.message
        : "An unknown error occurred";

    setError(errorMessage);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-24 left-12 w-64 h-64 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-36 right-12 w-72 h-72 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-56 h-56 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 md:px-8 relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
            Weather Dashboard
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Search and History */}
          <div className="lg:w-2/5 space-y-5">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-xl h-[250px] flex flex-col backdrop-blur-lg border border-blue-400/20">
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

            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-5 shadow-xl border border-gray-700/50 text-white">
              <SearchHistory
                history={searchHistory}
                onSelectCity={handleSearch}
                setSearchHistory={clearSearchHistory}
              />
            </div>
          </div>

          {/* Right Column - Weather Display and Forecast */}
          <div className="lg:w-3/5 space-y-5">
            {weatherData && !isLoading ? (
              <div className="animate-fadeIn">
                <WeatherDisplay
                  weatherData={weatherData}
                  isMetric={isMetric}
                  onToggleUnit={toggleTemperatureUnit}
                />
              </div>
            ) : (
              <div className="h-[250px] flex flex-col items-center justify-center p-6 bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-xl text-white">
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
                        className="w-20 h-20 text-indigo-400 animate-pulse"
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
                          className="w-8 h-8 text-blue-200"
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

        <footer className="mt-10 text-center text-sm text-gray-400">
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
