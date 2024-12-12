import fs from 'node:fs/promises';
import {v4 as uuidv4} from 'uuid';

/*
 * City class
 *
 * The HistoryService class works with information about a City
 * 
 */

class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

/*
 * HistoryService class
 *
 * Cities that the user submits to the front end are logged as a record 
 * in 'database' file: db/searchHistory.json. If the file doesn't exist
 * the class creates it with an append
 * 
 * Each entry has a unique UUID for the city which the user can use like a
 * bookmark such that when the select a city in the history it the app
 * will retrieve a fresh weather reading and forecast
 * 
 * The user can choose to delete a record from the 
 * history (db/searchHistory.json)
 *
 */
class HistoryService {

  /*
   * read()
   * 
   * Reads the User's city search history from a searchHistory.json file. 
   * If the file doesn't exist it will be created.
   * 
   */
  private async read() {
    return await fs.readFile('db/searchHistory.json', {
      flag: 'a+',   // append to create the file if it doesn't exist
      encoding: 'utf8',
    });
  }

  /*
   * write()
   * 
   * Write the updated cities array to the searchHistory.json file
   * 
   */
  private async write(cities: City[]) {
    return await fs.writeFile(
      'db/searchHistory.json', JSON.stringify(cities, null, '\t'));
  }

  /*
   * getCities()
   * 
   * Read the City records from the searchHistory.json file
   * 
   * Return the records in an array of City objects
   * 
   */
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }

  /*
   * addCity()
   * 
   * Add a city record to the searchHistory.json file after the user has
   * queried the OpenWeather API for weather data
   * 
   * Return an array of the City records for the client to use further as
   * needed
   * 
   */
  async addCity(city: string) {
    if (!city) {
      throw new Error('city cannot be blank');
    }

    // Track each city adding a unique index id to the city using uuid package
    const newCity: City = { name: city, id: uuidv4() };

    // Read all cities, add the new city, write all the updated cities, 
    // return the newCity or an array of cities including the newCity
    // if others already existed
    return await this.getCities()
    .then((cities) => {
      if (cities.find((index) => index.name === city)) {
        return cities;
      }
      return [...cities, newCity];
    })
    .then((updatedCity) => this.write(updatedCity))
    .then(() => newCity);
  }

  /*
   * removeCity()
   * 
   * Delete a city from the searchHistory.json file by its unique 
   * ID (uuid4 index)
   * 
   */
  async removeCity(id: string) {
    return await this.getCities()
      .then(
        (cities) => cities.filter((city) => city.id != id)
      )
      .then(
        (filteredCities) => this.write(filteredCities)
      );
  }
}

export default new HistoryService();
