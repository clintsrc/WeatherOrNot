import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  const cityName = req.body.cityName;
  if (cityName) {
    try {
      const weatherData = await WeatherService.getWeatherForCity(cityName);
      await HistoryService.addCity(cityName);
      res.status(200).json(weatherData);
    } catch (error) {
      res.status(500).send('Error retrieving weather data');
    }
  } else {
    res.status(400).send('City name is required');
  }
});

// TODO: GET search history
//router.get('/history', async (req: Request, res: Response) => {});
router.get('/history', async (req: Request, res: Response) => {
  console.info(`${req.method} request received for history`);
  try {
    const historyData = await HistoryService.getCities();
    res.status(200).json(historyData);
  } catch (error) {
    res.status(500).send('Error retrieving search history');
  }
});

// * BONUS TODO: DELETE city from search history
//router.delete('/history/:id', async (req: Request, res: Response) => {});
router.delete('/history/:id', async (req: Request, res: Response) => {
  const cityId = req.params.id;
  if (cityId) {
    await HistoryService.removeCity(cityId);
    res.status(200).send('City deleted');
  } else {
    res.status(400).send('Invalid city ID');
  }
});

export default router;
