"use client";

import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import WeatherDisplay from "../components/WeatherDisplay";
import SearchHistory from "../components/SearchHistory";
import ErrorDisplay from "../components/ErrorDisplay";
import {
  fetchWeatherData,
  getSearchHistory,
  saveSearchToHistory,
} from "../utils/weatherUtils";
import { WeatherData, SearchHistoryItem } from "../types/weather";

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load search history from localStorage on component mount
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  const handleSearch = async (city: string) => {
    setError("");
    setIsLoading(true);

    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 md:px-8">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center">
            Weather Dashboard
          </h1>
          <p className="text-gray-600 mb-8 text-center max-w-xl">
            Search for any city to get real-time weather information, including
            temperature, humidity, wind speed, and more.
          </p>

          <div className="w-full max-w-md">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            <ErrorDisplay message={error} onDismiss={() => setError("")} />
          </div>

          <div className="mt-6 w-full max-w-md">
            {weatherData && !isLoading && (
              <WeatherDisplay weatherData={weatherData} />
            )}
          </div>

          <div className="w-full max-w-md">
            <SearchHistory
              history={searchHistory}
              onSelectCity={handleSearch}
            />
          </div>

          {!weatherData && !isLoading && !error && (
            <div className="mt-12 text-center text-gray-500">
              <svg
                className="w-20 h-20 mx-auto text-gray-300 mb-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
              </svg>
              <p>Search for a city to get weather information</p>
            </div>
          )}
        </div>

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>
            Data provided by{" "}
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              OpenWeatherMap
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
