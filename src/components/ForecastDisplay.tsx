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
      return "from-blue-700 to-blue-900";
    } else if (condition.includes("snow")) {
      return "from-slate-400 to-slate-600";
    } else if (condition.includes("clear") && isDaytime) {
      return "from-sky-400 to-sky-500";
    } else if (condition.includes("clear") && !isDaytime) {
      return "from-indigo-800 to-indigo-950";
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      return "from-gray-500 to-gray-600";
    } else if (condition.includes("thunder")) {
      return "from-purple-800 to-purple-950";
    } else if (condition.includes("mist") || condition.includes("fog")) {
      return "from-slate-500 to-slate-700";
    } else if (condition.includes("haze") || condition.includes("smoke")) {
      return "from-yellow-700 to-yellow-900";
    } else {
      return "from-teal-600 to-teal-800";
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-200 mb-3">5-Day Forecast</h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
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
              className="bg-gray-600/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-500/50 shadow-sm"
            >
              <div
                className={`bg-gradient-to-r ${getWeatherBackgroundClass(
                  forecast.weather.main,
                  forecast.weather.icon
                )} p-2 text-white`}
              >
                <div className="text-center">
                  <div className="font-medium text-sm">
                    {formatDate(forecast.date)}
                  </div>
                  <div className="flex justify-center">
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
