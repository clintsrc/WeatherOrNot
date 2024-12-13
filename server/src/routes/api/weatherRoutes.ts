import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

/*
 * POST root
 *
 * Request with city name to retrieve weather data and save the city to the 
 * search history (db/searchHistory.json)
 * 
 * The user can select the history item again later to refresh the current 
 * weather again for that city, similar to a bookmark
 * 
 */
router.post('/', async (req: Request, res: Response) => {
  console.info(`${req.method} request received for weather data`);

  const cityName = req.body.cityName;

  if (cityName) {
    try {
      const weatherData = await WeatherService.getWeatherForCity(cityName)
      
      // Save city to search history: use the verified city name
      //    that OpenWeather retrieved
      console.info(`${req.method} update the history: ${weatherData[0].city}`);
      await HistoryService.addCity(weatherData[0].city);

      res.status(200).json(weatherData);
    } catch (error) {
      res.status(500).send('Error retrieving weather data');
    }
  } else {
    res.status(400).send('City name is required');
  }
  
});

/*
 * GET /history
 *
 * Read the search history (from db/searchHistory.json)
 * 
 */
router.get('/history', async (req: Request, res: Response) => {
  console.info(`${req.method} request received for history`);

  try {
    const historyData = await HistoryService.getCities();
    res.status(200).json(historyData);
  } catch (error) {
    res.status(500).send('Error retrieving search history');
  }
});

/*
 * DELETE /history/:id
 *
 * Remove a city from search history
 * 
 * The unique ID index is passed in from the client when they click the 
 * history item
 * 
 */
router.delete('/history/:id', async (req: Request, res: Response) => {
  const cityId = req.params.id;
  console.info(`${req.method} request received for history id: ${cityId}`);
  
  if (cityId) {
    await HistoryService.removeCity(cityId);
    res.status(200).send('City deleted');
  } else {
    res.status(400).send('Invalid city ID');
  }
});

export default router;
