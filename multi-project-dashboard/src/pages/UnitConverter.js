import React, { useState } from 'react';

const UnitConverter = () => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Unit options for each category
  const units = {
    length: ['millimeter', 'centimeter', 'meter', 'kilometer', 'inch', 'foot', 'yard', 'mile'],
    weight: ['milligram', 'gram', 'kilogram', 'ounce', 'pound'],
    temperature: ['Celsius', 'Fahrenheit', 'Kelvin']
  };

  // Handles form submission and calls the conversion API
  const handleConvert = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/converter/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: parseFloat(value),
          fromUnit,
          toUnit,
          category
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred during conversion.');
      } else {
        const data = await response.json();
        setResult(data.result);
      }
    } catch (error) {
      setError('Failed to reach the conversion API.');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Unit Converter</h2>

      {/* Category Selection */}
      <div className="mb-4">
        <label className="block mb-2">Select Category</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setFromUnit('');
            setToUnit('');
          }}
          className="w-full p-2 border rounded"
        >
          <option value="length">Length</option>
          <option value="weight">Weight</option>
          <option value="temperature">Temperature</option>
        </select>
      </div>

      {/* From Unit Selection */}
      <div className="mb-4">
        <label className="block mb-2">From Unit</label>
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Unit</option>
          {units[category].map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      {/* To Unit Selection */}
      <div className="mb-4">
        <label className="block mb-2">To Unit</label>
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Unit</option>
          {units[category].map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      {/* Value Input */}
      <div className="mb-4">
        <label className="block mb-2">Value</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter value to convert"
        />
      </div>

      {/* Convert Button */}
      <button
        onClick={handleConvert}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Convert
      </button>

      {/* Display Result or Error */}
      {result !== null && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          Result: {result}
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default UnitConverter;
