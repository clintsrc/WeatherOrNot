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
  lat: string;
  lon: string;
}

// TODO: Define a class for the Weather object
/*
 * Weather data (e.g.  date, icon, iconDescription, tempF, windSpeed, humidity).
 *
 */
// class Weather {
//   //
// }

// TODO: Complete the WeatherService class
class WeatherService {
  private city: string = '';
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }
  
  // TODO: Create fetchLocationData method
  /*
   * Makes a request to OpenWeather's geocoding API to determine a city's 
   *    coordinates
   *
   */
  // private async fetchLocationData(query: string) {
  private async fetchLocationData(query: string): Promise<any> {
    try {
      const response = await fetch(query);

      if (!response.ok) {
        throw new Error(`Error fetching location data: ${response.statusText}`);
      }

      const locationData = await response.json();

      if (locationData.length === 0) {
        throw new Error('No location data found');
      }
      
      return locationData;

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // TODO: Create destructureLocationData method
  //private destructureLocationData(locationData: Coordinates): Coordinates {
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];

    if (!lat || !lon) {
      throw new Error('Coordinates not found in location data');
    }
    
    return { lat, lon };
  }

  // TODO: Create buildGeocodeQuery method
  /*
   * Construct the query string for the geocoding API
   *    http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit={limit}&appid={API key}
   * 
   */
  // private buildGeocodeQuery(): string {
  private buildGeocodeQuery(): string {
    const queryCityLimit = 1; // Only return 1 city coordinate. This could be improved
    
    let query = `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(this.city)}&limit=${queryCityLimit}&appid=${this.apiKey}`;
    
    if (! this.isValidUrl(query)) {
      throw new Error('buildGeocodeQuery(): Invalid URL');
    }

    return query;
  }

  /*
   * isValidUrl
   *
   */
  private isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);

      return true;
    } catch (e) {
      return false;
    }
  };
  
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
  // private buildWeatherQuery(coordinates: Coordinates): string {
  private buildWeatherQuery(coordinates: Coordinates): string {
    let query = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    
    if (! this.isValidUrl(query)) {
      throw new Error('buildWeatherQuery(): Invalid URL');
    }

    return query;
  }
  
  // TODO: Create fetchAndDestructureLocationData method
  /*
   * This method handles both fetching the location data and destructuring the 
   * response data.
   * 
   * It returns the city coordinates  // TODO does it? the sig doesn't have a
   *    return... does this mean indirectly through the coordinate?
   *
   */
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    // generate a query string for the city coordinates
    const queryLocation = this.buildGeocodeQuery();

    // execute the query
    const locationData = await this.fetchLocationData(queryLocation);

    // update a coordinates object for use later in the weather forecast query
    const coordinates: Coordinates = this.destructureLocationData(locationData);

    return coordinates;
  }
  
  // TODO: Create fetchWeatherData method
  /*
   * makes a request to the weather API using the city coordinates 
   * and receives the weather data for that location.
   *
   */
  // private async fetchWeatherData(coordinates: Coordinates) {
  private async fetchWeatherData(coordinates: Coordinates) {

    const query = this.buildWeatherQuery(coordinates);

    try {
      const response = await fetch(query);

      if (!response.ok) {
        throw new Error(`Error fetching weather forecast data: ${response.statusText}`);
      }

      const weatherData = await response.json();

      if (weatherData.length === 0) {
        throw new Error('No weather forecast data found');
      }
      
      console.log(weatherData);

    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  // TODO: Build parseCurrentWeather method
  /*
   * Parses the response from the weather API, then extracts weather 
   * information (e.g. temperature, conditions)
   *
   */
  //private parseCurrentWeather(response: any) {}
  
  // TODO: Complete buildForecastArray method
  /*
   * Processes the weather data and generates an array of forecast objects
   * providing a 5-day weather forecast
   *
   */
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {

  // }
  
  // TODO: Complete getWeatherForCity method
  /*
   * The main method. It takes a city name as input, fetches its coordinates, 
   * and queries the openweather api again for the weather information. It 
   * then parses the response for and returns the 5-day forecast
   * 
   */
  async getWeatherForCity(city: string) {
    console.log("getWeatherForCity", city);
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    this.fetchWeatherData(coordinates);

    // parseCurrentWeather(weatherData): Parses the current weather information from the fetched weather data.
    // buildForecastArray(weatherData): Builds an array of the forecast data from the fetched weather data.

    // return the parsed data: The parsed current weather data and the forecast array are returned to the caller.
  }

}

export default new WeatherService();
