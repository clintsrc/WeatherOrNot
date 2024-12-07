/*
 * OpenWeather API
 * https://openweathermap.org/forecast5
 * 
 */

import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
/*
 * 
 * The Coordinates object enforces tracking a city's latitude and longitude
 *
 */
interface Coordinates {
  latitude: string;
  longitude: string;
}

// TODO: Define a class for the Weather object
/*
 * Weather data (e.g. current weather, forecasts).
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
  /*
   * Makes a request to OpenWeather's geocoding API to determine a city's 
   *    coordinates
   *
   */
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);

      //const parks = await response.json();

      //const mappedParks = await this.parkDataMapping(parks.data);
      //return mappedParks;
    } catch(err) {
      console.log('Error:', err);
      return err;
    }
  }

  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  
  // TODO: Create buildGeocodeQuery method
  /*
   * Construct the query string for the geocoding API
   *    http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit={limit}&appid={API key}
   * 
   */
  private buildGeocodeQuery(): string {
    const queryCityLimit = 1; // Only return 1 city coordinate. This could be improved
    
    let query = `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=${queryCityLimit}&appid=${this.apiKey}`;

    return query;
  }
  
  // TODO: Create buildWeatherQuery method
  /*
   * buildWeatherQuery()
   *    Creates the query string for the weather API call using the coordinates 
   *    for a city return from the geocoding API
   *
   * Parameter: 
   *    Coordinates object with the city coordinates
   * 
   * Returns: 
   *    Creates the query string for the weather API 5-day forecast call:
   *    https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
   *
   */
  private buildWeatherQuery(coordinates: Coordinates): string {
    let query = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
    
    return query;
  }
  
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
