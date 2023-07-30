import React, { useEffect, useState } from 'react';
import axios from 'axios';


interface WeatherData {
    main: {
        temp: number;
        humidity: number;
    };
    weather: {
        main: string;
        icon: string;
    }[];
    name: string;
}

const axiosInstance = axios.create({
    baseURL : "https://api.openweathermap.org/data/2.5/",
})

const weatherApiKey = "7ea5bc0eb05528bdf1f8e643f9f7cc54"
const getWeatherUrl = (position:GeolocationPosition) => `/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&APPID=${weatherApiKey}`

const WeatherWidget = ({title}:{title?:string}) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const position = await getCurrentPosition();
                const response = await axiosInstance.get<WeatherData>(getWeatherUrl(position));
                setWeatherData(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError(true);
            }
        };

        fetchWeatherData().finally();
    }, []);

    const getCurrentPosition = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || !weatherData) {
        return <div>Error loading weather data</div>;
    }

    return (
        <div  >
            <h1>{title}</h1>
            <h3>{weatherData.name}</h3>
            <div>
                <img
                    src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                    alt={weatherData.weather[0].main}
                />
                <p>{Math.round(weatherData.main.temp - 273.15)}°C</p>
                <p>{weatherData.weather[0].main}</p>
                <p>Humidity: {weatherData.main.humidity}%</p>
            </div>
        </div>
    );
};

export default WeatherWidget;
