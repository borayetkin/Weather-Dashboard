import { WeatherData } from "../types/weather";
import {
  formatTemperature,
  getWeatherIconUrl,
  celsiusToFahrenheit,
} from "../utils/weatherUtils";

interface WeatherDisplayProps {
  weatherData: WeatherData;
  isMetric?: boolean;
  onToggleUnit?: () => void;
}

export default function WeatherDisplay({
  weatherData,
  isMetric = true,
  onToggleUnit,
}: WeatherDisplayProps) {
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
      return "from-slate-400 to-slate-600";
    } else if (weatherCondition.includes("clear") && isDaytime) {
      return "from-sky-400 to-sky-500";
    } else if (weatherCondition.includes("clear") && !isDaytime) {
      return "from-indigo-800 to-indigo-950";
    } else if (
      weatherCondition.includes("cloud") ||
      weatherCondition.includes("overcast")
    ) {
      return "from-gray-500 to-gray-600";
    } else if (weatherCondition.includes("thunder")) {
      return "from-purple-800 to-purple-950";
    } else if (
      weatherCondition.includes("mist") ||
      weatherCondition.includes("fog")
    ) {
      return "from-slate-500 to-slate-700";
    } else if (
      weatherCondition.includes("haze") ||
      weatherCondition.includes("smoke")
    ) {
      return "from-yellow-700 to-yellow-900";
    } else {
      return "from-teal-600 to-teal-800";
    }
  };

  const getWeatherEmoji = () => {
    if (
      weatherCondition.includes("rain") ||
      weatherCondition.includes("drizzle")
    ) {
      return "🌧️";
    } else if (weatherCondition.includes("snow")) {
      return "❄️";
    } else if (weatherCondition.includes("clear") && isDaytime) {
      return "☀️";
    } else if (weatherCondition.includes("clear") && !isDaytime) {
      return "🌙";
    } else if (weatherCondition.includes("cloud")) {
      return "☁️";
    } else if (weatherCondition.includes("thunder")) {
      return "⚡";
    } else if (
      weatherCondition.includes("mist") ||
      weatherCondition.includes("fog")
    ) {
      return "🌫️";
    } else {
      return "🌡️";
    }
  };

  // Format current date
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDate = currentDate.toLocaleDateString(undefined, options);

  // Handle unit toggle
  const handleToggleUnit = () => {
    if (onToggleUnit) {
      onToggleUnit();
    }
  };

  return (
    <div className="w-full bg-gray-600/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-gray-500/50">
      <div
        className={`bg-gradient-to-r ${getBackgroundClass()} text-white p-5`}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">{name}</h2>
              <span className="ml-2 bg-black/20 backdrop-blur-sm text-xs px-2 py-0.5 rounded-full">
                {sys.country}
              </span>
            </div>
            <div className="mt-1 flex items-center">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                {formattedDate}
              </span>
            </div>
          </div>
          <div className="text-right flex items-center">
            <span className="text-3xl mr-1 filter drop-shadow-md">
              {getWeatherEmoji()}
            </span>
            <img
              src={getWeatherIconUrl(weatherIcon)}
              alt={weatherDescription}
              className="w-16 h-16 drop-shadow-lg"
            />
          </div>
        </div>

        <div className="mt-3 flex justify-between items-end">
          <div>
            <p className="text-5xl font-bold tracking-tighter">
              {isMetric ? temperatureC : temperatureF}°
            </p>
            <p className="text-sm mt-1">
              Feels like: {isMetric ? feelsLikeC : feelsLikeF}°
              {isMetric ? "C" : "F"}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <button
              onClick={handleToggleUnit}
              className="text-xs bg-white/20 px-2 py-1 rounded-full transition-all hover:bg-white/30 border border-white/20 shadow-sm"
            >
              {isMetric ? "C" : "F"} • Switch to {isMetric ? "F" : "C"}
            </button>
            <p className="capitalize text-sm font-medium mt-2">
              {weatherDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-gray-200 font-medium mb-3 text-sm">
          Weather Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center bg-gray-600/30 p-3 rounded-lg border border-gray-600/50">
            <span className="text-gray-300 mb-1 text-sm">Humidity</span>
            <div className="flex items-baseline">
              <span className="text-xl font-semibold text-gray-100">
                {main.humidity}
              </span>
              <span className="text-gray-300 ml-1 text-sm">%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
              <div
                className="bg-blue-500 h-1 rounded-full"
                style={{ width: `${main.humidity}%` }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col items-center bg-gray-600/30 p-3 rounded-lg border border-gray-600/50">
            <span className="text-gray-300 mb-1 text-sm">Wind Speed</span>
            <div className="flex items-baseline">
              <span className="text-xl font-semibold text-gray-100">
                {wind.speed}
              </span>
              <span className="text-gray-300 ml-1 text-sm">
                {isMetric ? "m/s" : "mph"}
              </span>
            </div>
            <div className="mt-2">
              <svg
                className="h-4 w-4 text-blue-400 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{
                  transform: `rotate(${wind.deg}deg)`,
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
