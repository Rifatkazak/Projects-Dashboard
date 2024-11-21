import React, { useState } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [alerts,  setAlerts] = useState(null)
  const [days,  setDays] = useState(null)
  const [address,  setAdress] = useState(null)
  const [currentConditions,  setCurrentConditions] = useState(null)


  const fetchWeather = async () => {
    setError("");
    setWeatherData(null);

    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/weather/weather?city=${city}`
      );
      setWeatherData(response.data);
      setDays(response.data.days)
      setAlerts(response.data.alerts)
      setAdress(response.data.address)
      setCurrentConditions(response.data.currentConditions)
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
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-4">{address}</h1>
  
          {/* Current Conditions */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h2 className="text-2xl font-semibold mb-2">Current Weather</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg">
                  <span className="font-bold">Condition:</span> {currentConditions.conditions}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Temperature:</span> {currentConditions.temp}°F
                </p>
                <p className="text-lg">
                  <span className="font-bold">Wind Speed:</span> {currentConditions.windspeed} mph
                </p>
              </div>
              <img
                src={`https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/${currentConditions.icon}.svg`}
                alt="weather icon"
                className="w-24 h-24"
              />
            </div>
          </div>
  
          {/* Alerts */}
          {alerts && alerts.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4 mb-6 mt-2">
              <h2 className="text-2xl font-semibold text-red-600 mb-2">Alerts</h2>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="mb-4 border-b-2 border-red-200 pb-2 last:border-b-0"
                >
                  <h3 className="font-bold">{alert.headline}</h3>
                  <p>{alert.description}</p>
                  <p>
                    <span className="font-bold">From:</span> {new Date(alert.onset).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-bold">Until:</span> {new Date(alert.ends).toLocaleString()}
                  </p>
                  <a
                    href={alert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    More Info
                  </a>
                </div>
              ))}
            </div>
          )}
  
          {/* Next 3 Days Forecast */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">3-Day Forecast</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {days.slice(0, 3).map((day, index) => (
                <div
                  key={index}
                  className="bg-blue-50 rounded-lg shadow-md p-4 flex flex-col items-center"
                >
                  <h3 className="font-bold text-lg">{day.datetime}</h3>
                  <img
                    src={`https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/${day.icon}.svg`}
                    alt="weather icon"
                    className="w-16 h-16 my-2"
                  />
                  <p className="text-lg text-center">{day.description}</p>
                  <div className="text-sm">
                    <p>
                      <span className="font-bold">Max Temp:</span> {day.tempmax}°F
                    </p>
                    <p>
                      <span className="font-bold">Min Temp:</span> {day.tempmin}°F
                    </p>
                    <p>
                      <span className="font-bold">Chance of Precipitation:</span> {day.precipprob}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Weather;