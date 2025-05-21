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
      return "from-blue-600 to-blue-800";
    } else if (weatherCondition.includes("snow")) {
      return "from-indigo-200 to-indigo-400";
    } else if (weatherCondition.includes("clear") && isDaytime) {
      return "from-blue-400 to-blue-600";
    } else if (weatherCondition.includes("clear") && !isDaytime) {
      return "from-indigo-800 to-indigo-950";
    } else if (
      weatherCondition.includes("cloud") ||
      weatherCondition.includes("overcast")
    ) {
      return "from-slate-500 to-slate-700";
    } else if (weatherCondition.includes("thunder")) {
      return "from-purple-700 to-purple-900";
    } else if (
      weatherCondition.includes("mist") ||
      weatherCondition.includes("fog")
    ) {
      return "from-slate-400 to-slate-600";
    } else if (
      weatherCondition.includes("haze") ||
      weatherCondition.includes("smoke")
    ) {
      return "from-amber-700 to-amber-900";
    } else {
      return "from-blue-500 to-indigo-600";
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
    <div className="w-full backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-700/50 bg-gray-800/30">
      <div
        className={`bg-gradient-to-r ${getBackgroundClass()} text-white p-6 relative`}
      >
        {/* Glass Card Effect Overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-black/10 mix-blend-overlay"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h2 className="text-3xl font-bold tracking-tight">{name}</h2>
                <span className="ml-2 bg-black/30 backdrop-blur-sm text-xs px-2 py-1 rounded-full">
                  {sys.country}
                </span>
              </div>
              <div className="mt-1.5 flex items-center">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {formattedDate}
                </span>
              </div>
            </div>
            <div className="text-right flex items-center">
              <span className="text-4xl mr-1 filter drop-shadow-md">
                {getWeatherEmoji()}
              </span>
              <img
                src={getWeatherIconUrl(weatherIcon)}
                alt={weatherDescription}
                className="w-16 h-16 drop-shadow-lg"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-between items-end">
            <div>
              <p className="text-6xl font-bold tracking-tighter">
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
                className="text-xs bg-white/20 px-3 py-1.5 rounded-full transition-all hover:bg-white/30 border border-white/20 shadow-sm"
              >
                {isMetric ? "C" : "F"} • Switch to {isMetric ? "F" : "C"}
              </button>
              <p className="capitalize text-sm font-medium mt-2">
                {weatherDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-gray-200 font-medium mb-4 text-sm">
          Weather Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center bg-gray-700/30 p-4 rounded-xl border border-gray-600/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
            <span className="text-gray-300 mb-1 text-sm">Humidity</span>
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold text-gray-100">
                {main.humidity}
              </span>
              <span className="text-gray-300 ml-1 text-sm">%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${main.humidity}%` }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col items-center bg-gray-700/30 p-4 rounded-xl border border-gray-600/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
            <span className="text-gray-300 mb-1 text-sm">Wind Speed</span>
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold text-gray-100">
                {wind.speed}
              </span>
              <span className="text-gray-300 ml-1 text-sm">
                {isMetric ? "m/s" : "mph"}
              </span>
            </div>
            <div className="mt-2 relative">
              <div className="w-6 h-6 rounded-full bg-gray-600/50 flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-blue-400"
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
    </div>
  );
}
