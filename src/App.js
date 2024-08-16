import { useState, useEffect, useCallback } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);

  const ApiKey = "f5691be9317a02cdef90ff1f3650d22c";

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${ApiKey}`
      );
      setWeather(response.data);
      setError("");
    } catch (err) {
      setError("City not found");
      setWeather(null);
    }
  };

  const fetchForecast = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${ApiKey}`
      );
      setForecast(response.data);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Could not fetch forecast");
      setForecast(null);
    }
  }, [city, ApiKey]);

  useEffect(() => {
    if (weather) {
      fetchForecast();
    }
  }, [weather, fetchForecast]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather();
    }
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {error && <p>{error}</p>}
      {weather && (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}

      {forecast && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-container">
            {forecast.list.map((item, index) => (
              <div key={index} className="forecast-item">
                <p>{new Date(item.dt_txt).toLocaleString()}</p>
                <p>{item.weather[0].description}</p>
                <p>Temp: {item.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;