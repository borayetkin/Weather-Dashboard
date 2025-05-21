import { DailyForecast } from "../types/weather";
import {
  formatTemperature,
  getWeatherIconUrl,
  celsiusToFahrenheit,
} from "../utils/weatherUtils";

interface ForecastDisplayProps {
  forecasts: DailyForecast[];
  isMetric: boolean;
}

export default function ForecastDisplay({
  forecasts,
  isMetric,
}: ForecastDisplayProps) {
  if (!forecasts || forecasts.length === 0) return null;

  // Format date to display day name
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
    });
  };

  // Get weather condition background color class
  const getWeatherBackgroundClass = (
    weatherCondition: string,
    icon: string
  ) => {
    const isDaytime = icon.includes("d");
    const condition = weatherCondition.toLowerCase();

    if (condition.includes("rain") || condition.includes("drizzle")) {
      return "from-blue-600 to-blue-800";
    } else if (condition.includes("snow")) {
      return "from-indigo-200 to-indigo-400";
    } else if (condition.includes("clear") && isDaytime) {
      return "from-blue-400 to-blue-600";
    } else if (condition.includes("clear") && !isDaytime) {
      return "from-indigo-800 to-indigo-950";
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      return "from-slate-500 to-slate-700";
    } else if (condition.includes("thunder")) {
      return "from-purple-700 to-purple-900";
    } else if (condition.includes("mist") || condition.includes("fog")) {
      return "from-slate-400 to-slate-600";
    } else if (condition.includes("haze") || condition.includes("smoke")) {
      return "from-amber-700 to-amber-900";
    } else {
      return "from-blue-500 to-indigo-600";
    }
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-xl p-5 border border-gray-700/50">
      <h3 className="text-sm font-medium text-gray-200 mb-4 flex items-center">
        <svg
          className="w-4 h-4 mr-2 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {forecasts.map((forecast, index) => {
          const temp = isMetric
            ? formatTemperature(forecast.temp)
            : formatTemperature(celsiusToFahrenheit(forecast.temp));
          const minTemp = isMetric
            ? formatTemperature(forecast.min_temp)
            : formatTemperature(celsiusToFahrenheit(forecast.min_temp));
          const maxTemp = isMetric
            ? formatTemperature(forecast.max_temp)
            : formatTemperature(celsiusToFahrenheit(forecast.max_temp));

          return (
            <div
              key={index}
              className="backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 shadow-lg transform hover:scale-105 transition-all duration-300 bg-gray-800/20"
            >
              <div
                className={`bg-gradient-to-r ${getWeatherBackgroundClass(
                  forecast.weather.main,
                  forecast.weather.icon
                )} p-3 text-white relative`}
              >
                {/* Glass effect overlay */}
                <div className="absolute inset-0 backdrop-blur-sm bg-black/10 mix-blend-overlay"></div>

                <div className="text-center relative z-10">
                  <div className="font-medium text-sm">
                    {formatDate(forecast.date)}
                  </div>
                  <div className="flex justify-center mt-1">
                    <img
                      src={getWeatherIconUrl(forecast.weather.icon)}
                      alt={forecast.weather.description}
                      className="w-10 h-10"
                    />
                  </div>
                  <div className="capitalize text-xs truncate">
                    {forecast.weather.description}
                  </div>
                </div>
              </div>
              <div className="p-2">
                <div className="text-center mb-1">
                  <div className="text-lg font-semibold text-gray-200">
                    {temp}°{isMetric ? "C" : "F"}
                  </div>
                  <div className="text-xs text-gray-300 flex justify-between px-1">
                    <span>Min: {minTemp}°</span>
                    <span>Max: {maxTemp}°</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="bg-gray-600/30 p-1.5 rounded text-center">
                    <div className="text-gray-300">Humidity</div>
                    <div className="font-medium text-gray-200">
                      {forecast.humidity}%
                    </div>
                  </div>
                  <div className="bg-gray-600/30 p-1.5 rounded text-center">
                    <div className="text-gray-300">Wind</div>
                    <div className="font-medium text-gray-200">
                      {forecast.wind.speed} {isMetric ? "m/s" : "mph"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
