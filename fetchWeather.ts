import { fetchWeatherApi } from 'openmeteo';

const params = {
	"latitude": 49.8225,
	"longitude": 19.0469,
	"hourly": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "precipitation", "weather_code", "wind_speed_10m"],
	"timezone": "auto",
	"forecast_days": 1
};
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
const utcOffsetSeconds = response.utcOffsetSeconds();
const timezone = response.timezone();
const timezoneAbbreviation = response.timezoneAbbreviation();
const latitude = response.latitude();
const longitude = response.longitude();

const hourly = response.hourly()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {

	hourly: {
		time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
			(t) => new Date((t + utcOffsetSeconds) * 1000)
		),
		temperature2m: hourly.variables(0)!.valuesArray()!,
		relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
		apparentTemperature: hourly.variables(2)!.valuesArray()!,
		precipitation: hourly.variables(3)!.valuesArray()!,
		weatherCode: hourly.variables(4)!.valuesArray()!,
		windSpeed10m: hourly.variables(5)!.valuesArray()!,
	},

};

const mappedData = {
	hourlyForecasts: weatherData.hourly.time.map((time, index) => ({
		time: time,
		temperature2m: weatherData.hourly.temperature2m[index],
		relativeHumidity2m: weatherData.hourly.relativeHumidity2m[index],
		apparentTemperature: weatherData.hourly.apparentTemperature[index],
		precipitation: weatherData.hourly.precipitation[index],
		weatherCode: weatherData.hourly.weatherCode[index],
		windSpeed10m: weatherData.hourly.windSpeed10m[index],
	}))
};

Bun.write("weather.json", JSON.stringify(mappedData, null, "\t"))
console.log(mappedData)
