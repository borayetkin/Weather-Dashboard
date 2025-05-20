import { WeatherData } from "../types/weather";
import {
  formatTemperature,
  getWeatherIconUrl,
  celsiusToFahrenheit,
} from "../utils/weatherUtils";
import { useState } from "react";

interface WeatherDisplayProps {
  weatherData: WeatherData;
}

export default function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
  const [isMetric, setIsMetric] = useState(true);

  if (!weatherData) return null;

  const { name, sys, main, weather, wind } = weatherData;

  const weatherIcon = weather[0]?.icon || "";
  const weatherDescription = weather[0]?.description || "";
  const temperatureC = formatTemperature(main.temp);
  const temperatureF = formatTemperature(celsiusToFahrenheit(main.temp));
  const feelsLikeC = formatTemperature(main.feels_like);
  const feelsLikeF = formatTemperature(celsiusToFahrenheit(main.feels_like));

  // Get time of day for background styling (day/night)
  const isDaytime = weatherIcon.includes("d");

  // Get weather condition for background styling
  const weatherCondition = weather[0]?.main?.toLowerCase() || "";

  const getBackgroundClass = () => {
    if (
      weatherCondition.includes("rain") ||
      weatherCondition.includes("drizzle")
    ) {
      return "from-blue-700 to-blue-900";
    } else if (weatherCondition.includes("snow")) {
      return "from-blue-100 to-blue-300";
    } else if (weatherCondition.includes("clear") && isDaytime) {
      return "from-blue-400 to-blue-600";
    } else if (weatherCondition.includes("clear") && !isDaytime) {
      return "from-indigo-800 to-indigo-950";
    } else if (
      weatherCondition.includes("cloud") ||
      weatherCondition.includes("overcast")
    ) {
      return "from-gray-400 to-gray-600";
    } else if (weatherCondition.includes("thunder")) {
      return "from-gray-700 to-gray-900";
    } else {
      return "from-blue-500 to-blue-600";
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.01]">
      <div
        className={`bg-gradient-to-r ${getBackgroundClass()} text-white p-6`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">{name}</h2>
            <p className="text-xl">{sys.country}</p>
            <div className="mt-2 flex items-center">
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                {new Date().toLocaleDateString()} •{" "}
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end">
              <img
                src={getWeatherIconUrl(weatherIcon)}
                alt={weatherDescription}
                className="w-20 h-20 drop-shadow-lg"
              />
            </div>
            <p className="capitalize text-lg font-medium">
              {weatherDescription}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-col">
            <div className="flex justify-between items-end">
              <p className="text-6xl font-bold tracking-tighter">
                {isMetric ? temperatureC : temperatureF}°
              </p>
              <button
                onClick={() => setIsMetric(!isMetric)}
                className="text-xs bg-white/20 px-2 py-1 rounded-full transition-all hover:bg-white/30"
              >
                {isMetric ? "C" : "F"} • Switch to {isMetric ? "F" : "C"}
              </button>
            </div>
            <p className="text-lg mt-1">
              Feels like: {isMetric ? feelsLikeC : feelsLikeF}°
              {isMetric ? "C" : "F"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 gap-6">
        <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg">
          <span className="text-gray-500 mb-1">Humidity</span>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-gray-800">
              {main.humidity}
            </span>
            <span className="text-gray-600 ml-1">%</span>
          </div>
        </div>
        <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg">
          <span className="text-gray-500 mb-1">Wind Speed</span>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-gray-800">
              {wind.speed}
            </span>
            <span className="text-gray-600 ml-1">
              {isMetric ? "m/s" : "mph"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
