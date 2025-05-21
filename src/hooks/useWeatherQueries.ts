import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WeatherData, ForecastData } from "../types/weather";
import { processForecastData } from "../utils/weatherUtils";

// Get API key from environment variable
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const API_URL = "https://api.openweathermap.org/data/2.5";

// Fetch current weather data
const fetchWeather = async (city: string): Promise<WeatherData> => {
  const response = await axios.get(`${API_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
    },
  });
  return response.data;
};

// Fetch forecast data
const fetchForecast = async (city: string): Promise<ForecastData> => {
  const response = await axios.get(`${API_URL}/forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
    },
  });
  return response.data;
};

// Hook for fetching current weather
export const useWeatherData = (city: string | null, enabled = false) => {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: () => fetchWeather(city!),
    enabled: !!city && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook for fetching forecast data
export const useForecastData = (city: string | null, enabled = false) => {
  return useQuery({
    queryKey: ["forecast", city],
    queryFn: () => fetchForecast(city!),
    enabled: !!city && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    select: (data) => processForecastData(data),
  });
};

// Combined hook to fetch both current weather and forecast
export const useWeatherAndForecast = (city: string | null) => {
  const enabled = !!city;

  const weatherQuery = useWeatherData(city, enabled);
  const forecastQuery = useForecastData(city, enabled);

  const isLoading = weatherQuery.isLoading || forecastQuery.isLoading;
  const isError = weatherQuery.isError || forecastQuery.isError;
  const error = weatherQuery.error || forecastQuery.error;

  return {
    weatherData: weatherQuery.data,
    forecastData: forecastQuery.data || [],
    isLoading,
    isError,
    error,
    refetch: () => {
      weatherQuery.refetch();
      forecastQuery.refetch();
    },
  };
};
