import axios from "axios";
import { WeatherData, SearchHistoryItem, ForecastData } from "../types/weather";

// Using the API key from environment variable
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const API_URL = "https://api.openweathermap.org/data/2.5";

// Extended city database - this is an expanded dataset to simulate a more comprehensive API
// In a production app, you would connect to a geocoding service like Google Places API or
// OpenWeatherMap's geocoding API for real dynamic suggestions
import { cityDatabase } from "./cityDatabase";

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

// Function to fetch 5-day weather forecast data
export async function fetchForecastData(city: string): Promise<ForecastData> {
  try {
    const response = await axios.get(`${API_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric", // Default to metric
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      "Failed to fetch forecast data. Please check the city name and try again."
    );
  }
}

// Convert forecast data to daily forecast (take one forecast per day)
export function processForecastData(data: ForecastData) {
  const forecasts = data.list;
  const dailyForecasts = [];
  const processedDates = new Set();

  // Get one forecast per day (at noon when available)
  for (const forecast of forecasts) {
    const date = forecast.dt_txt.split(" ")[0]; // Get date part

    // Skip if we already have a forecast for this date
    if (processedDates.has(date)) {
      continue;
    }

    // Check if this is a forecast around noon (12:00:00)
    const time = forecast.dt_txt.split(" ")[1];
    const isNoon = time === "12:00:00" || time.startsWith("12:");

    // Add to processed dates to avoid duplicates
    processedDates.add(date);

    // Add to our daily forecasts array
    dailyForecasts.push({
      date,
      temp: forecast.main.temp,
      min_temp: forecast.main.temp_min,
      max_temp: forecast.main.temp_max,
      humidity: forecast.main.humidity,
      weather: forecast.weather[0],
      wind: forecast.wind,
    });

    // Stop after we have 5 days
    if (dailyForecasts.length >= 5) {
      break;
    }
  }

  return dailyForecasts;
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

export function removeFromSearchHistory(
  timestamp: number
): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];

  const history = getSearchHistory();
  const updatedHistory = history.filter((item) => item.timestamp !== timestamp);

  localStorage.setItem("weatherSearchHistory", JSON.stringify(updatedHistory));
  return updatedHistory;
}

// Dynamic suggestion system that simulates API suggestions
export function getSuggestions(input: string): string[] {
  if (!input || input.length < 1) return [];

  const inputLower = input.toLowerCase();
  const inputChars = inputLower.split("");

  // Function to score a city based on match quality
  const scoreCity = (city: {
    name: string;
    country: string;
    rank: number;
  }): { city: typeof city; score: number } => {
    const cityLower = city.name.toLowerCase();
    const fullName = `${city.name}, ${city.country}`.toLowerCase();

    // Check for exact matches first (highest priority)
    if (cityLower === inputLower) {
      return { city, score: 2000 + city.rank };
    }

    // Exact start match gets high score
    if (cityLower.startsWith(inputLower)) {
      return { city, score: 1000 + city.rank };
    }

    // Check if the country is specifically mentioned
    if (fullName.includes(inputLower)) {
      return { city, score: 800 + city.rank };
    }

    // Sequential character match (letters appear in order)
    let remainingCity = cityLower;
    let sequentialMatches = 0;
    let fullSequenceMatch = true;

    // Check if all input characters appear in sequence in the city name
    for (const char of inputChars) {
      const charIndex = remainingCity.indexOf(char);
      if (charIndex >= 0) {
        sequentialMatches++;
        remainingCity = remainingCity.substring(charIndex + 1);
      } else {
        fullSequenceMatch = false;
        break;
      }
    }

    // All characters matched in sequence
    if (fullSequenceMatch && sequentialMatches === inputChars.length) {
      return { city, score: 500 + city.rank + (100 - cityLower.length) }; // Shorter names rank higher
    }

    // Contains match (all letters exist but not in sequence)
    const containsAllLetters = inputChars.every((char) =>
      cityLower.includes(char)
    );
    if (containsAllLetters) {
      return { city, score: 200 + city.rank };
    }

    // Partial match (some letters exist)
    const matchCount = inputChars.filter((char) =>
      cityLower.includes(char)
    ).length;
    const matchRatio = matchCount / inputChars.length;

    if (matchRatio > 0.6) {
      // At least 60% of letters match
      return { city, score: 100 + city.rank * matchRatio };
    }

    return { city, score: 0 }; // No significant match
  };

  // Score and sort the cities from our expanded database
  const scoredCities = cityDatabase
    .map(scoreCity)
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // Return the top 5 results with country code
  return scoredCities
    .slice(0, 5)
    .map((item) => `${item.city.name}, ${item.city.country}`);
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
