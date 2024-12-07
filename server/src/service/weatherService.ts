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
 * Weather data (e.g. date, temp, wind, humidity).
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
  /*
   * This method handles both fetching the location data and destructuring the 
   * response data.
   * 
   * It returns the city coordinates  // TODO does it? the sig doesn't have a
   *    return... does this mean indirectly through the coordinate?
   *
   */
  private async fetchAndDestructureLocationData() {
    // fetchLocationData(city): This method makes the API call to get the location data for the specified city.
    // destructureLocationData(locationData): This method is called to extract the latitude and longitude from the location data returned by fetchLocationData.
  }
  
  // TODO: Create fetchWeatherData method
  /*
   * makes a request to the weather API using the city coordinates 
   * and receives the weather data for that location.
   *
   */
  private async fetchWeatherData(coordinates: Coordinates) {

  }
  
  // TODO: Build parseCurrentWeather method
  /*
   * Parses the response from the weather API, then extracts weather 
   * information (e.g. temperature, conditions)
   *
   */
  private parseCurrentWeather(response: any) {}
  
  // TODO: Complete buildForecastArray method
  /*
   * Processes the weather data and generates an array of forecast objects
   * providing a 5-day weather forecast
   *
   */
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {

  }
  
  // TODO: Complete getWeatherForCity method
  /*
   * The main method. It takes a city name as input, fetches its coordinates, 
   * and queries the openweather api again for the weather information. It 
   * then parses the response for and returns the 5-day forecast
   * 
   */
  async getWeatherForCity(city: string) {
    // fetchAndDestructureLocationData()

    // buildWeatherQuery(lat, lon): Constructs the weather query using the obtained latitude and longitude.
    // fetchWeatherData(weatherQuery): Fetches the weather data using the constructed query.
    // parseCurrentWeather(weatherData): Parses the current weather information from the fetched weather data.
    // buildForecastArray(weatherData): Builds an array of the forecast data from the fetched weather data.

    // return the parsed data: The parsed current weather data and the forecast array are returned to the caller.
  }

}

export default new WeatherService();
