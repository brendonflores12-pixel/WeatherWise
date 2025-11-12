import type { WeatherData, Alert, FarmingAdvice, WeatherCondition } from '@/types';

export async function getCoordinates(location: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
}

export async function getWeatherData(location: string): Promise<WeatherData | null> {
  try {
    const coords = await getCoordinates(location);
    if (!coords) return null;

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto`
    );
    const data = await response.json();

    const condition = getWeatherCondition(data.current.weather_code);
    const alerts = generateAlerts(data.current, data.daily);
    const farmingAdvice = generateFarmingAdvice(condition, data.current.temperature_2m, location);

    return {
      location,
      temperature: Math.round(data.current.temperature_2m),
      condition,
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      forecast: getForecastDescription(data.daily),
      alerts,
      farmingAdvice,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0) return 'sunny';
  if (code >= 1 && code <= 3) return 'cloudy';
  if (code >= 51 && code <= 67) return 'rainy';
  if (code >= 71 && code <= 77) return 'snowy';
  if (code >= 95) return 'stormy';
  if (code >= 45 && code <= 48) return 'foggy';
  return 'cloudy';
}

function generateAlerts(current: any, daily: any): Alert[] {
  const alerts: Alert[] = [];

  if (current.temperature_2m > 35) {
    alerts.push({
      id: '1',
      type: 'warning',
      title: 'Extreme Heat Warning',
      message: 'Temperature exceeds 35°C. Ensure adequate irrigation and shade for crops.',
      timestamp: new Date(),
    });
  }

  if (current.temperature_2m < 0) {
    alerts.push({
      id: '2',
      type: 'danger',
      title: 'Frost Warning',
      message: 'Freezing temperatures detected. Protect sensitive crops immediately.',
      timestamp: new Date(),
    });
  }

  if (current.wind_speed_10m > 50) {
    alerts.push({
      id: '3',
      type: 'danger',
      title: 'High Wind Alert',
      message: 'Strong winds detected. Secure loose structures and protect tall crops.',
      timestamp: new Date(),
    });
  }

  if (daily.precipitation_sum && daily.precipitation_sum[0] > 50) {
    alerts.push({
      id: '4',
      type: 'warning',
      title: 'Heavy Rainfall Expected',
      message: 'Significant rainfall expected. Ensure proper drainage to prevent waterlogging.',
      timestamp: new Date(),
    });
  }

  return alerts;
}

function generateFarmingAdvice(condition: WeatherCondition, temp: number, location: string): FarmingAdvice[] {
  const advice: FarmingAdvice[] = [];
  const season = getCurrentSeason();

  advice.push({
    id: '1',
    title: 'Optimal Planting Time',
    description: temp > 15 && temp < 30
      ? 'Temperature is ideal for planting most crops. Consider tomatoes, peppers, and cucumbers.'
      : temp > 30
      ? 'Temperature is high. Focus on heat-resistant crops like okra, eggplant, and melons.'
      : 'Temperature is low. Consider cool-season crops like lettuce, spinach, and peas.',
    crop: 'Various',
    season,
  });

  if (condition === 'rainy') {
    advice.push({
      id: '2',
      title: 'Moisture Management',
      description: 'Rainy conditions detected. Avoid excessive watering and ensure proper drainage. Good time for transplanting.',
      crop: 'All crops',
      season,
    });
  }

  if (condition === 'sunny') {
    advice.push({
      id: '3',
      title: 'Irrigation Schedule',
      description: 'Sunny weather requires regular watering. Water early morning or late evening to minimize evaporation.',
      crop: 'All crops',
      season,
    });
  }

  advice.push({
    id: '4',
    title: 'Seasonal Crop Recommendations',
    description: getSeasonalRecommendations(season),
    crop: 'Seasonal',
    season,
  });

  return advice;
}

function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Fall';
  return 'Winter';
}

function getSeasonalRecommendations(season: string): string {
  const recommendations: Record<string, string> = {
    Spring: 'Plant warm-season crops like tomatoes, peppers, beans, and squash. Start preparing soil with compost.',
    Summer: 'Focus on heat-tolerant crops. Maintain consistent watering. Plant succession crops for continuous harvest.',
    Fall: 'Plant cool-season crops like broccoli, cauliflower, and root vegetables. Prepare for winter storage crops.',
    Winter: 'Grow cold-hardy greens like kale and collards. Plan crop rotation for next season. Maintain greenhouse crops.',
  };
  return recommendations[season] || 'Monitor weather conditions and adjust planting schedule accordingly.';
}

function getForecastDescription(daily: any): string {
  const maxTemp = Math.round(daily.temperature_2m_max[0]);
  const minTemp = Math.round(daily.temperature_2m_min[0]);
  const precipitation = daily.precipitation_sum[0];

  let description = `High: ${maxTemp}°C, Low: ${minTemp}°C. `;

  if (precipitation > 10) {
    description += 'Significant rainfall expected.';
  } else if (precipitation > 0) {
    description += 'Light precipitation possible.';
  } else {
    description += 'No precipitation expected.';
  }

  return description;
}

export function getWeatherVideoUrl(condition: WeatherCondition): string {
  const videos: Record<WeatherCondition, string> = {
    sunny: 'https://assets.mixkit.co/videos/preview/mixkit-sunny-day-with-clouds-in-the-sky-28642-large.mp4',
    rainy: 'https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-lake-seen-up-18312-large.mp4',
    cloudy: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-moving-in-the-blue-sky-2408-large.mp4',
    snowy: 'https://assets.mixkit.co/videos/preview/mixkit-snow-falling-on-a-forest-3120-large.mp4',
    stormy: 'https://assets.mixkit.co/videos/preview/mixkit-thunderstorm-with-lightning-at-night-28303-large.mp4',
    foggy: 'https://assets.mixkit.co/videos/preview/mixkit-fog-in-a-forest-2473-large.mp4',
  };
  return videos[condition];
}
