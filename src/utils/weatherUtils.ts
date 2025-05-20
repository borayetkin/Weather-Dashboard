import axios from "axios";
import { WeatherData, SearchHistoryItem } from "../types/weather";

// Using the provided API key
const API_KEY = "bd6803e869b0f8765b9a1b9b2ea147aa";
const API_URL = "https://api.openweathermap.org/data/2.5";

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  try {
    const response = await axios.get(`${API_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric", // Default to metric
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      "Failed to fetch weather data. Please check the city name and try again."
    );
  }
}

export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];

  const history = localStorage.getItem("weatherSearchHistory");
  return history ? JSON.parse(history) : [];
}

export function saveSearchToHistory(city: string): void {
  if (typeof window === "undefined") return;

  const history = getSearchHistory();

  // Check if city already exists in history
  const existingIndex = history.findIndex(
    (item) => item.city.toLowerCase() === city.toLowerCase()
  );

  if (existingIndex !== -1) {
    // Remove the existing entry
    history.splice(existingIndex, 1);
  }

  // Add the new search to the beginning of the array
  history.unshift({ city, timestamp: Date.now() });

  // Keep only the last 5 searches
  const limitedHistory = history.slice(0, 5);

  localStorage.setItem("weatherSearchHistory", JSON.stringify(limitedHistory));
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemperature(temp: number): string {
  return Math.round(temp).toString();
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
