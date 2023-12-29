import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState({});
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  useEffect(() => {
    const defaultWeatherResponse = async () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });

      try {
        if (lat && long) {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather/?lat=${lat}&lon=${long}&units=metric&appid=${process.env.REACT_APP_OPENWEATHERAPI}`
          );
          setData(response.data);
          console.log(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    defaultWeatherResponse();
  }, [lat, long]);

  const searchCity = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_OPENWEATHERAPI}`
      );
      setData(response.data);
      setCity("")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="weather-container">
        <div className="search-wrapper">
          <form onSubmit={(e) => searchCity(e)}>
            <input
              type="text"
              name="city"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
            />
          </form>
        </div>
        {data && (
          <div className="weather-info">
            <div className="temperature">
              <h1>{`${Math.floor(data?.main?.temp)}°C`}</h1>
              <div className="temp-details">
                <h4>Max Temp: {Math.floor(data?.main?.temp_max)}°C</h4>
                <h4>Min Temp: {Math.floor(data?.main?.temp_min)}°C</h4>
              </div>
            </div>
            <h2 className="place">
              {data?.name}, {data?.sys?.country}
            </h2>
            <div className="other-details">
              <h4>
                <span className="gap">Humidity: {data?.main?.humidity}%</span> |{" "}
                <span className="gap">Pressure: {data?.main?.pressure} hPa</span>
              </h4>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Weather;
