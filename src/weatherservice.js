import axios from 'axios';

const API_KEY = '8714a16d8301aeb9d0c5e138e81f2080';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const getWeatherData = async (city, units = 'metric') => {
  try {
    const response = await axios.get(`${API_URL}?q=${city}&appid=${API_KEY}&units=${units}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

export default getWeatherData;