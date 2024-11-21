import React, { useState } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    setError("");
    setWeatherData(null);

    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/weather?city=${city}`
      );
      setWeatherData(response.data);
    } catch (err) {
      setError("Unable to fetch weather data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">
        Weather Application
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <label
          htmlFor="city"
          className="block text-gray-700 font-medium mb-2"
        >
          Enter City Name:
        </label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchWeather}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition duration-200"
        >
          Get Weather
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {weatherData && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Weather in {weatherData.city}
          </h2>
          <p className="text-gray-600">
            <span className="font-medium">Temperature:</span>{" "}
            {weatherData.temperature}°C
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Condition:</span>{" "}
            {weatherData.description}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Humidity:</span>{" "}
            {weatherData.humidity}%
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Wind Speed:</span>{" "}
            {weatherData.wind_speed} km/h
          </p>
        </div>
      )}
    </div>
  );
};

export default Weather;