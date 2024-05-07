import React, { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import useDebouncer from "../hooks/useDebouncer";
import axios from "axios";
import "./Weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState({});
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [xMark, setXMark] = useState(false);

  const debouncedCity = useDebouncer(city, 500);

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

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedCity) {
        setSuggestions([]);
        return;
      }
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          debouncedCity
        )}.json?access_token=${process.env.REACT_APP_MAPBOXAPI}`
      );
      setSuggestions(response.data.features);
    };
    fetchSuggestions();
  }, [debouncedCity]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setCity(inputValue);
  };

  const handleInputClick = (e, selectedPlace) => {
    setCity(selectedPlace);
    setSuggestions([]);
    searchCity(e);
  };

  const handleInputTextRemove = () => {
    setCity("");
    setXMark(false);
  };

  const searchCity = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_API}`
      );

      setData(response.data);
      setXMark(true);
      setCity("");
      setSuggestions([]);
    } catch (err) {
      try {
        const mapboxResponse = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            city
          )}.json?access_token=${process.env.REACT_APP_MAPBOXAPI}`
        );
        if (mapboxResponse.data.features.length > 0) {
          const location = mapboxResponse.data.features[0];
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.center[1]}&lon=${location.center[0]}&units=metric&appid=${process.env.REACT_APP_API}`
          );
          setData(weatherResponse.data);
          setCity(location.place_name);
          setXMark(true);
          setSuggestions([]);
        } else {
          throw new Error("Location Not Found");
        }
      } catch (error) {
        console.log(error);
      }
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
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="lg"
            color="black"
            className="fa-icons"
          />
          <form onSubmit={(e) => searchCity(e)}>
            <input
              type="text"
              name="city"
              id="city"
              value={city}
              onChange={handleInputChange}
              placeholder="Enter city name"
              autoComplete="off"
            />
          </form>
          {xMark && (
            <FontAwesomeIcon
              icon={faXmark}
              size="lg"
              className="fa-icons"
              onClick={handleInputTextRemove}
            />
          )}
        </div>

        {data && (
          <div className="weather-info">
            {suggestions && suggestions.length > 1 && (
              <div className="suggestions-wrapper">
                <ul>
                  {suggestions.map((suggestion, index) => (
                    <div key={index}>
                      <li
                        className="suggestions"
                        key={index}
                        onClick={(e) =>
                          handleInputClick(e, suggestion?.place_name)
                        }
                      >
                        {suggestion?.place_name}
                      </li>
                      <hr />
                    </div>
                  ))}
                </ul>
              </div>
            )}
            <div className="temperature">
              <div className="temp-img">
                {data?.weather && data?.weather[0] && (
                  <img
                    src={`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@2x.png`}
                    alt="Weather-Icon"
                  />
                )}
              </div>
              <h1 className="temp-deg">{`${Math.floor(data?.main?.temp)}°C`}</h1>
              <div className="temp-details">
                <h4>Max Temp: {Math.floor(data?.main?.temp_max)}°C</h4>
                <h4>Min Temp: {Math.floor(data?.main?.temp_min)}°C</h4>
              </div>
            </div>
            <h2 className="place">
              {data?.name}, {data?.sys?.country}
            </h2>
            <div className="other-details-md">
              <h4>
                <span className="gap">Humidity: {data?.main?.humidity}%</span> |{" "}
                <span className="gap">
                  Pressure: {data?.main?.pressure} hPa
                </span>
              </h4>
            </div>
            <div className="other-details-sm">
              <h4>
                <p>Humidity: {data?.main?.humidity}%</p>
                <p>Pressure: {data?.main?.pressure} hPa</p>
              </h4>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Weather;
