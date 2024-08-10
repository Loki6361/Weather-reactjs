import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, CircularProgress, Box, Typography } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import getWeatherData from './weatherservice';

const WeatherApp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState('metric');
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (data) => {
    if (!data.city || isFetching) return;

    setIsFetching(true);
    setError(null);

    try {
      const response = await getWeatherData(data.city, units);
      setWeather(response);
    } catch (error) {
        setWeather(null);
      setError('Error fetching weather. Please check the city name and try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const fadeSpring = useSpring({ opacity: weather ? 1 : 0 });
  const slideSpring = useSpring({ y: weather ? 0 : 20 });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box sx={{ maxWidth: 400, padding: 2 }}>
        <Typography variant="h4" gutterBottom>Weather App</Typography>

        <form onSubmit={handleSubmit(fetchWeather)}>
          <TextField
            fullWidth
            label="Enter a city"
            {...register('city', { required: true })}
            error={!!errors.city}
            helperText={errors.city && 'City name is required'}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={isFetching}>
              {isFetching ? <CircularProgress size={20} /> : 'Get Weather'}
            </Button>
          </Box>
        </form>

        <animated.div style={fadeSpring}>
          <animated.div style={slideSpring}>
            {weather && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="h5" gutterBottom>{weather.name}</Typography>
                <Typography>Temperature: {weather.main.temp} {units === 'metric' ? '°C' : '°F'}</Typography>
                <Typography>Description: {weather.weather[0].description}</Typography>
                <Typography>Humidity: {weather.main.humidity}%</Typography>
                <Typography>Wind Speed: {weather.wind.speed} m/s</Typography>
              </Box>
            )}
          </animated.div>
        </animated.div>

        {error && (
          <Box sx={{ marginTop: 2, color: 'error' }}>
            <Typography>{error}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default WeatherApp;