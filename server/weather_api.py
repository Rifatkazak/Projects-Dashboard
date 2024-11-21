import os
import json
import requests
from flask import Blueprint, jsonify, request
from redis import Redis
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Blueprint setup
weather_bp = Blueprint('weather', __name__)


# Load API key and Redis connection settings
VISUAL_CROSSING_API_KEY = "97JHMKXC58TTSHELXA29APDMK"#os.getenv('VISUAL_CROSSING_API_KEY')
REDIS_HOST = "localhost" #os.getenv('REDIS_HOST')
REDIS_PORT =6379 #os.getenv('REDIS_PORT')
REDIS_DB =0 #os.getenv('REDIS_DB')

# Initialize Redis connection
redis_client = Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)

# Weather API base URL
WEATHER_API_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{city}?key={api_key}"

# Cache expiration time (in seconds), here we are setting it to 12 hours
CACHE_EXPIRATION_TIME = 43200

# Helper function to fetch weather data from the Visual Crossing API
def fetch_weather_from_api(city):
    try:
        response = requests.get(WEATHER_API_URL.format(city=city, api_key=VISUAL_CROSSING_API_KEY))
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException:
        return None

# Helper function to get weather data (either from cache or API)
def get_weather_data(city):
    # Check if data is cached in Redis
    cached_data = redis_client.get(city)

    if cached_data:
        # Return the cached data if it's available
        return json.loads(cached_data)

    # If no cached data, fetch from the 3rd party API
    weather_data = fetch_weather_from_api(city)
    if weather_data:
        # Cache the result for future requests with expiration time
        redis_client.setex(city, CACHE_EXPIRATION_TIME, json.dumps(weather_data))
        return weather_data
    else:
        return None

# Weather endpoint
@weather_bp.route('/weather', methods=['GET'])
def weather():
    print("test")
    city = request.args.get('city')

    if not city:
        return jsonify({"error": "City is required"}), 400

    weather_data = get_weather_data(city)

    if weather_data:
        return jsonify(weather_data), 200
    else:
        return jsonify({"error": "Could not fetch weather data, please try again later."}), 500
