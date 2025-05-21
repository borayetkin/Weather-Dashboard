import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  WeatherData,
  SearchHistoryItem,
  DailyForecast,
} from "../types/weather";

interface WeatherState {
  // Current weather data
  weatherData: WeatherData | null;
  setWeatherData: (data: WeatherData | null) => void;

  // Forecast data
  forecastData: DailyForecast[];
  setForecastData: (data: DailyForecast[]) => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Error state
  error: string;
  setError: (error: string) => void;

  // Temperature unit
  isMetric: boolean;
  toggleTemperatureUnit: () => void;

  // Search history
  searchHistory: SearchHistoryItem[];
  addToSearchHistory: (city: string) => void;
  removeFromSearchHistory: (timestamp: number) => void;
  clearSearchHistory: () => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      // Current weather data
      weatherData: null,
      setWeatherData: (data) => set({ weatherData: data }),

      // Forecast data
      forecastData: [],
      setForecastData: (data) => set({ forecastData: data }),

      // Loading state
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Error state
      error: "",
      setError: (error) => set({ error }),

      // Temperature unit
      isMetric: true,
      toggleTemperatureUnit: () =>
        set((state) => ({ isMetric: !state.isMetric })),

      // Search history
      searchHistory: [],
      addToSearchHistory: (city) =>
        set((state) => {
          // Check if city already exists in history
          const existingIndex = state.searchHistory.findIndex(
            (item) => item.city.toLowerCase() === city.toLowerCase()
          );

          // Create a new history array
          let newHistory = [...state.searchHistory];

          if (existingIndex !== -1) {
            // Remove the existing entry
            newHistory.splice(existingIndex, 1);
          }

          // Add the new search to the beginning of the array
          newHistory.unshift({ city, timestamp: Date.now() });

          // Keep only the last 5 searches
          newHistory = newHistory.slice(0, 5);

          return { searchHistory: newHistory };
        }),
      removeFromSearchHistory: (timestamp) =>
        set((state) => ({
          searchHistory: state.searchHistory.filter(
            (item) => item.timestamp !== timestamp
          ),
        })),
      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: "weather-store",
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        isMetric: state.isMetric,
      }),
    }
  )
);
