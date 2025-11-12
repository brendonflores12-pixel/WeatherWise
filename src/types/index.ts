export interface User {
  id: string;
  email: string;
  name: string;
  location: string;
  profileImage?: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: string;
  alerts: Alert[];
  farmingAdvice: FarmingAdvice[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

export interface FarmingAdvice {
  id: string;
  title: string;
  description: string;
  crop: string;
  season: string;
}

export interface Task {
  id: string;
  title: string;
  crop: string;
  plantingDate: Date;
  harvestDate: Date;
  status: 'planning' | 'planted' | 'growing' | 'harvested';
  notes?: string;
}

export interface VoiceSettings {
  enabled: boolean;
  speed: number;
  pitch: number;
  language: string;
  volume: number;
}

export type WeatherCondition = 'sunny' | 'rainy' | 'cloudy' | 'snowy' | 'stormy' | 'foggy';
