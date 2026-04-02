import { useState, useEffect } from "react";

import getWeather from "../services/weather";

const Weather = ({ name, lat, lon }) => {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    getWeather(lat, lon)
      .then((weather) => {
        if (!isCancelled) {
          setWeather(weather);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });


    return () => {
      isCancelled = true;
    };
  }, [lat, lon]);

  return (
    <>
      <h2>Weather in {name}</h2>
      {isLoading ? <p>Loading weather...</p> : null}
      {!isLoading && !weather ? <p>Failed to load weather data.</p> : null}
      {!isLoading && weather && (
        <>
        <p>temperature {weather.main.temp} Celsius</p>
        <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
        />
        <p>wind {weather.wind.speed} m/s</p>
        </>
        )
      }
    </>
  );
};

export default Weather;
