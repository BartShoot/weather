import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, Title, type ChartData, CategoryScale } from 'chart.js';
import { useEffect, useState } from 'react';
import weatherData from '../../data/weather.json'

export const WeatherToday = () => {
    const [isRegistered, setIsRegistered] = useState(false);
    useEffect(() => {
        ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
        setIsRegistered(true);
    }, [])

    if (!isRegistered) return <></>

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'ChartJs chart'
            }
        }
    }

    const todaysDate = new Date();
    const labels = weatherData.hourly.time.map((date: string) => {
        const dateObj = new Date(date)
        switch (dateObj.getDay()- todaysDate.getDay()) {
            case 0:
                return `Today ${dateObj.getHours()}:00`
            case 1:
                return `Tommorow ${dateObj.getHours()}:00`
            default:
                return `${(dateObj.getMonth()+1).toString().padStart(2, '0')}.${dateObj.getDay()} ${dateObj.getHours()}:00`
        }
    });
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Temperature',
                data: weatherData.hourly.temperature2m
            },
            {
                label: 'Apparent Temperature',
                data: weatherData.hourly.apparentTemperature
            },
        ],

    }
    return (
        <div>
            <Chart options={options} type="line" data={chartData} />
        </div>
    )
}
export default WeatherToday;