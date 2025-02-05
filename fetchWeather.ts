import { fetchWeatherApi } from 'openmeteo';

const params = {
	"latitude": 49.8225,
	"longitude": 19.0469,
	"hourly": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "precipitation", "weather_code", "wind_speed_10m"],
	"timezone": "auto",
	"forecast_days": 2
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
		temperature2m: Object.values(hourly.variables(0)!.valuesArray()!),
		relativeHumidity2m: Object.values(hourly.variables(1)!.valuesArray()!),
		apparentTemperature: Object.values(hourly.variables(2)!.valuesArray()!),
		precipitation: Object.values(hourly.variables(3)!.valuesArray()!),
		weatherCode: Object.values(hourly.variables(4)!.valuesArray()!),
		windSpeed10m: Object.values(hourly.variables(5)!.valuesArray()!),
	},
};

Bun.write("data/weather.json", JSON.stringify(weatherData, null, "\t"))
