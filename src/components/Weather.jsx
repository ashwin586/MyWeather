import React, { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import axios from "axios";
import "./Weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState({});
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const defaultWeatherResponse = async () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });

      try {
        if (lat && long) {
          setLoading(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather/?lat=${lat}&lon=${long}&units=metric&appid=${process.env.REACT_APP_API}`
          );
          setData(response.data);
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    defaultWeatherResponse();
  }, [lat, long]);

  const searchCity = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_API}`
      );
      setData(response.data);
      setCity("");
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div className="spinner">
          <BeatLoader
            color="#43cea2"
            loading={loading}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
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
              {data?.weather && data?.weather[0] && (
                <img
                  src={`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@2x.png`}
                  alt="Weather-Icon"
                />
              )}
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
                <span className="gap">
                  Pressure: {data?.main?.pressure} hPa
                </span>
              </h4>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Weather;
