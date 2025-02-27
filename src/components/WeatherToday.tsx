import { useEffect, useState } from "react";
import weatherData from "../../data/weather.json";

export const WeatherToday = () => {
  const [currentWeatherData, setCurrentWeatherData] = useState<{
    temperature: number;
    apparentTemperature: number;
    precipitation: number;
    time: string;
    displayTime: string;
  } | null>(null);

  useEffect(() => {
    // Get current date and time
    const now = new Date();

    // Find the closest hour in the weather data
    const hourIndex = findClosestHourIndex(now);

    if (hourIndex !== -1) {
      setCurrentWeatherData({
        temperature: weatherData.hourly.temperature2m[hourIndex],
        apparentTemperature: weatherData.hourly.apparentTemperature[hourIndex],
        precipitation: weatherData.hourly.precipitation[hourIndex],
        time: weatherData.hourly.time[hourIndex],
        displayTime: new Date().toLocaleString(),
      });
    }
  }, []);

  // Function to find the closest hour in the data
  const findClosestHourIndex = (currentDate: Date): number => {
    const currentTime = currentDate.getTime();

    let closestIndex = -1;
    let smallestDiff = Number.MAX_VALUE;

    weatherData.hourly.time.forEach((timeString, index) => {
      const timeDate = new Date(timeString);
      const diff = Math.abs(timeDate.getTime() - currentTime);

      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const getWeatherCondition = (): string => {
    if (!currentWeatherData) return "";

    if (currentWeatherData.precipitation > 5) {
      return "Heavy Rain";
    } else if (currentWeatherData.precipitation > 1) {
      return "Light Rain";
    } else if (currentWeatherData.temperature < 0) {
      return "Freezing";
    } else if (currentWeatherData.temperature > 25) {
      return "Hot";
    } else if (currentWeatherData.temperature > 15) {
      return "Warm";
    } else {
      return "Cool";
    }
  };

  const getTemperatureColor = (temp: number): string => {
    if (temp < 0) return "text-blue-500";
    if (temp > 20) return "text-orange-500";
    if (temp > 10) return "text-green-500";
    return "text-gray-800";
  };

  if (!currentWeatherData) {
    return (
      <div className="rounded bg-gray-100 p-4">Loading weather data...</div>
    );
  }

  return (
    <div className="m-6 max-w-md rounded-lg bg-gray-100 p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">
        Current Weather in Bielsko-Biała
      </h2>

      <div className="mb-4">
        <p className="text-gray-600">{currentWeatherData.displayTime}</p>
        <p className="text-lg font-medium">{getWeatherCondition()}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Temperature</p>
          <p
            className={`text-2xl font-bold ${getTemperatureColor(currentWeatherData.temperature)}`}
          >
            {currentWeatherData.temperature.toFixed(1)}°C
          </p>
        </div>

        <div className="rounded bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Feels Like</p>
          <p
            className={`text-2xl font-bold ${getTemperatureColor(currentWeatherData.apparentTemperature)}`}
          >
            {currentWeatherData.apparentTemperature.toFixed(1)}°C
          </p>
        </div>

        <div className="col-span-2 rounded bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Precipitation</p>
          <p className="text-2xl font-bold text-blue-500">
            {currentWeatherData.precipitation.toFixed(1)} mm
          </p>
          {currentWeatherData.precipitation > 0 && (
            <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-blue-500"
                style={{
                  width: `${Math.min(currentWeatherData.precipitation * 5, 100)}%`,
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default WeatherToday;
