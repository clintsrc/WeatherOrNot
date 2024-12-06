/*
 * OpenWeather API
 * https://openweathermap.org/forecast5
 * 
 */

import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
/*
 * Geocoding API:
 * http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit={limit}&appid={API key}
 *
 */
interface Coordinates {
  // eg.: receivePay(pay: number): number;
}

// TODO: Define a class for the Weather object
/*
 * 5 day weather forecast:
 * https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
 *
 */
class Weather {
  //
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = process.env.BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = process.env.CITY_NAME || '';
  }
  
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);

      //const parks = await response.json();

      //const mappedParks = await this.parkDataMapping(parks.data);
      //return mappedParks;
    } catch {
      console.log('Error:', err);
      return err;
    }
  }

  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  
  // TODO: Create buildGeocodeQuery method
  // Query for the city's coordinates
  private buildGeocodeQuery(): string {
    // passed into WeatherService from the env: baseURL, apiKey, cityName

    query = `${this.baseURL}/?forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    // http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit={limit}&appid={API key}
    // https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
  }
  
  // TODO: Create buildWeatherQuery method
  // Use the city's cooridinates to build the 5-day forecast query
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  
  // TODO: Create fetchAndDestructureLocationData method
  // ??
  // private async fetchAndDestructureLocationData() {}
  
  // TODO: Create fetchWeatherData method
  // ??
  // private async fetchWeatherData(coordinates: Coordinates) {}
  
  // TODO: Build parseCurrentWeather method
  // pare the 5-day response
  // private parseCurrentWeather(response: any) {}
  
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  
  // TODO: Complete getWeatherForCity method
  // Top level?
  // async getWeatherForCity(city: string) {}

}

export default new WeatherService();


/*
Expected Flow(?):
Call getWeatherForCity(city) with a city name.
Inside getWeatherForCity, call fetchLocationData(city) to get the coordinates.
Use destructureLocationData to extract latitude and longitude.
Build the weather query using buildWeatherQuery.
Fetch the weather data using fetchWeatherData.
Parse the current weather data using parseCurrentWeather.
Build the forecast array using buildForecastArray.
Return the parsed data to the caller.
 */
