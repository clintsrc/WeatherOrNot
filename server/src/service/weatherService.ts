/*
 * The core implementation uses the OpenWeather API
 *    to for a city's current weather and 5-day forecast
 *    
 * ref: https://openweathermap.org/forecast5
 * 
 */

import dotenv from 'dotenv';
dotenv.config();

/*
 * Coordinates interface
 *
 * The Coordinates interface enforces latitude and longitude for City
 * coordinates
 *
 */
interface Coordinates {
  lat: string;
  lon: string;
}

/*
 * Weather class
 *
 * Stores details about weather conditions for a city. These attributes are
 * derived from the data that the client code expects. See client/src/main.ts,
 * especially renderCurrentWeather() and renderForecastCard():
 * 
 * city: this is the name of the city. Initially it stores the value that
 *    the user passes in for the OpenWeather lookup. If OpenWeather identifies
 *    a city, this is updated with the name that it returns to formalize it
 *    and for consistency with the source of the data that's actually retrieved
 * date: the data is returned in a raw format that will be updated to 
 *    International format (MM/DD/YYYY)
 * icon: displays an icon such as sunny, cloudy, etc
 * iconDescription: accessibility text for the html image alt attribute
 * tempF: the query includes query paramter 'units=imperial' for Farenheit
 *    temperature readings
 * windSpeed
 * humidity
 * 
 */
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }

}

/*
 * WeatherService class
 *
 * The WeatherService class is responsible for running the REST API calls that
 * retrieve a city's coordinates and using those coordinates to query the
 * OpenWeather API for its current weather data and a 5-day forecast
 * 
 * It extracts the weather data, manipulates it for consistency and a 
 * user-friendly format, packages it into an array of weather data for the 
 * web client to present to the user 
 *
 */
class WeatherService {
  private city: string = '';
  private baseURL: string;
  private apiKey: string;

  /*
   * IMPORTANT: Use environment variables for the OpenWeather API's base URL 
   * and the API key values. You can generate the key using your OpenWeather 
   * API account.
   * 
   * By convention these are stored in server/.env **outside of source 
   * control** for your development environment as:
   *    API_BASE_URL=https://api.openweathermap.org
   *    API_KEY=<sensitive data>
   * 
   * For the production deployment it's good to have a separate key that you 
   * can store in the Render enviornment settings
   * 
   */
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }
  
  /*
   * fetchLocationData()
   * 
   * Makes a request to the geocoding API to determine a city's coordinates
   * for use in a later OpenAPI query
   * 
   * Updates the Weather object's city name to match the city name that was 
   * actually returned for data constency and to resolve any input formatting 
   * issues such as proper-casing
   * 
   * Returns the city data
   * 
   */
  private async fetchLocationData(query: string): Promise<any> {
    try {
      const response = await fetch(query);

      if (!response.ok) {
        throw new Error(`Error fetching location data: ${response.statusText}`);
      }

      const locationData = await response.json();

      if (locationData.length === 0) {
        throw new Error(`No location data found for city name: ${this.city}`);
      } else {
        // Update the user input city with the formal name that the
        //    query retrieved
        this.city = locationData[0].name;
      }

      return locationData;

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /*
   * destructureLocationData()
   *
   * This method handles destructuring the response data to get a city's
   * coordinates to be used later for the weather data lookup
   * 
   * returns the city's coordinates
   * 
   */
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];

    if (!lat || !lon) {
      throw new Error('Coordinates not found in location data');
    }
    
    return { lat, lon };
  }

  /*
   * buildGeocodeQuery()
   *
   * Uses the name of a city to call the geocoding API in order to retrieve
   * the city's coordinates
   * 
   * The query includes a limit querystring parameter to avoid a response
   * with multiple matching city names. This is a design flaw that needs 
   * improvement so that the user gets the city that they actually want, (e.g 
   * Westminster, CO and not Westminster, CA)
   * 
   * Construct the query string for the geocoding API
   *    http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit={limit}&appid={API key}
   * 
   */
  private buildGeocodeQuery(): string {
    // Only return 1 city coordinate, a design flaw that needs improvement
    const queryCityLimit = 1;
    
    let query = `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(this.city)}&limit=${queryCityLimit}&appid=${this.apiKey}`;
    
    if (! this.isValidUrl(query)) {
      throw new Error('buildGeocodeQuery(): Invalid URL');
    }

    return query;
  }

  /*
   * isValidUrl()
   *
   * This method is a convenience function to keep it DRY. It does basic 
   * validation on a URL to catch any malformed URL problems,
   * especially useful when constructing query strings
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

  /*
   * buildWeatherQuery()
   *
   * Creates the query string for the weather API call to use. It includes
   * the city coordinates retrieved earlier using the geocoding API
   * 
   * The query includes the imperial filter to return Farenheit temperatures:
   *    https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat={lat}&lon={lon}&appid={API key}
   *
   */
  private buildWeatherQuery(coordinates: Coordinates): string {
    let query = `${this.baseURL}/data/2.5/forecast?units=imperial&lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    
    if (! this.isValidUrl(query)) {
      throw new Error('buildWeatherQuery(): Invalid URL');
    }

    return query;
  }
  
  /*
   * fetchAndDestructureLocationData()
   *
   * This method handles retrieving the city coordinates by getting the 
   * necessary query string, fetching the location data, then destructuring 
   * the response data to get the city coordinates (and name) to be used
   * later for the weather data lookup
   * 
   * returns the city coordinates
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
  
  /*
   * fetchWeatherData()
   * 
   * This method handles retrieving the weather data by getting the necessary 
   * query string which includes the city's coordinates input determined 
   * earlier using the buildGeocodeQuery() call. It returns the raw weather 
   * data for futher use.
   * 
   */
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
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
      
      return weatherData;

    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  /*
   * parseCurrentWeather()
   *
   * Parses the response from the OpenWeather API to populate
   * a record with the weather information we're intersted in
   * for the client to present to the user
   * 
   * Returns a new Weather record
   *
   */
  private parseCurrentWeather(response: any): Weather {
    const { dt_txt, weather, main, wind } = response;

    const date = this.convertDate(dt_txt);
    const icon = weather[0].icon;
    const iconDescription = weather[0].description;
    const tempF = main.temp;
    const windSpeed = wind.speed;
    const humidity = main.humidity;

    let weatherReading = new Weather(this.city, date, icon, iconDescription, tempF, windSpeed, humidity);

    return weatherReading;
  }
  
  /*
   * convertDate()
   *
   * This method helps covert a UTC timestamp into a more friendly, and
   * internationalized representation (MM/DD/YYYY)
   * 
   */
  private convertDate(fullDate: string) {

    const date = new Date(fullDate);
    const formatter = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return formatter.format(date);
  }

  /*
   * buildForecastArray()
   * 
   * Create the forecast array for a city the user specified and fetched from
   * OpenWeather API.
   * 
   * The forecast data includes multiple readings per day so that this method
   * must iterate through them and retain only one reading per day
   * 
   * The first array record is the weather data for the current day, the
   * remainder are the 5-day records
   * 
   */
  private buildForecastArray(weatherData: any[]): Weather[] {
      const dailyForecasts: { [key: string]: Weather } = {};
  
      weatherData.forEach((data: any) => {
          const date = data.dt_txt.split(" ")[0]; // Extract the date part (YYYY-MM-DD)
  
          // The data contains multiple records per day, only keep one daily reading
          if (! dailyForecasts[date]) {
            dailyForecasts[date] = this.parseCurrentWeather(data);
          }
      });
  
      // Return the values as an array
      return Object.values(dailyForecasts);
  }
  
  /*
   * getWeatherForCity()
   * 
   * The main method for the weather service. It takes a city name as input, 
   * fetches its coordinates then queries the OpenWeather API for that city's
   * weather information. It then parses the response
   * 
   * returns the current weather and 5-day forecast
   * 
   */
  async getWeatherForCity(city: string): Promise<Weather[]> {
    console.info(`${this.getWeatherForCity.name} will lookup ${city}`);
    
    // temporarily set the user-input city until we have the info from
    // OpenWeather
    this.city = city;

    // build the city info query, run the query, extract the city info
    // to get the name and coordinates
    const coordinates = await this.fetchAndDestructureLocationData();

    // build the weather forecast query using the city coordinates, run the 
    // query
    const weatherData = await this.fetchWeatherData(coordinates);

    // build the array of weather records containing the current day and 
    // 5-day forecast)
    const wd = this.buildForecastArray(weatherData.list);

    return wd;
  }

}

export default new WeatherService();
