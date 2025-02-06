import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip, BarElement } from 'chart.js';
import { useEffect, useState } from 'react';
import weatherData from '../../data/weather.json'

export const WeatherToday = () => {
    const [isRegistered, setIsRegistered] = useState(false);
    useEffect(() => {
        ChartJS.register(
            LineController,
            LineElement,
            BarElement,
            PointElement,
            LinearScale,
            Title,
            CategoryScale,
            Legend,
            Tooltip
        );
        setIsRegistered(true);
    }, [])

    if (!isRegistered) return <></>

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const
            },
            title: {
                display: true,
                text: 'Hourly weather'
            }
        },
        scales: {
            y: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: '°C'
                }
            },
            y1: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'mm'
                },
                min: 0,
                max: 20,
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    }

    const todaysDate = new Date();
    const labels = weatherData.hourly.time.map((date: string) => {
        const dateObj = new Date(date)
        switch (dateObj.getDay() - todaysDate.getDay()) {
            case -1:
                return `Yesterday ${dateObj.getHours()}:00`
            case 0:
                return `Today ${dateObj.getHours()}:00`
            case 1:
                return `Tommorow ${dateObj.getHours()}:00`
            default:
                return `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}.${dateObj.getDay()} ${dateObj.getHours()}:00`
        }
    });
    const chartData = {
        labels: labels,
        yLabel: 'C',
        color: function (context) {
            const index = context.dataIndex;
            const value = context.dataset.data[index];
            return value < 0 ? 'blue' :
                value > 10 ? 'green' :
                    value > 20 ? 'orange' : 'white'
        },
        datasets: [
            {
                type: 'line' as const,
                label: 'Temperature',
                data: weatherData.hourly.temperature2m,
                backgroundColor: 'rgb(150, 70, 120)',
                yAxisID: 'y'
            },
            {
                type: 'line' as const,
                label: 'Apparent Temperature',
                data: weatherData.hourly.apparentTemperature,
                backgroundColor: 'rgb(50, 170, 30)',
                borderColor: 'rgba(128,129,130,0.5)',
                yAxisID: 'y'
            },
            {
                type: 'bar' as const,
                label: 'Precipation',
                data: weatherData.hourly.precipitation,
                backgroyndColor: 'rbg(100,100,250)',
                yAxisID: 'y1'
            }
        ],

    }
    return (
        <>
        <p>{todaysDate.toDateString()}</p>
        <div className='chart-container' style={{ position: 'relative' }} >
            <Chart options={options} type='bar' data={chartData} />
        </div>
</>
    )
}
export default WeatherToday;