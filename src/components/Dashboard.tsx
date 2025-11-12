'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useVoice } from '@/contexts/VoiceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfileEditor } from './ProfileEditor';
import { WeatherDisplay } from './WeatherDisplay';
import { TaskManager } from './TaskManager';
import { ChatBot } from './ChatBot';
import { Settings } from './Settings';
import { getWeatherData, getWeatherVideoUrl } from '@/lib/weather';
import type { WeatherData, WeatherCondition } from '@/types';
import { Search, Settings as SettingsIcon, LogOut, Home } from 'lucide-react';

export function Dashboard() {
  const { user, logout } = useAuth();
  const { speak } = useVoice();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchLocation, setSearchLocation] = useState(user?.location || '');
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('sunny');

  useEffect(() => {
    if (user?.location) {
      fetchWeather(user.location);
    }
  }, [user?.location]);

  const fetchWeather = async (location: string) => {
    setLoading(true);
    speak(`Fetching weather data for ${location}`);
    const data = await getWeatherData(location);
    if (data) {
      setWeatherData(data);
      setWeatherCondition(data.condition as WeatherCondition);
      speak(`Weather data loaded. Current temperature is ${data.temperature} degrees Celsius. Condition: ${data.condition}`);
    } else {
      speak('Unable to fetch weather data. Please check the location and try again.');
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      fetchWeather(searchLocation.trim());
    }
  };

  const handleLogout = () => {
    speak('Logging out. Goodbye!');
    setTimeout(() => {
      logout();
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          key={weatherCondition}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src={getWeatherVideoUrl(weatherCondition)} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <Home className="h-8 w-8 text-primary" aria-hidden="true" />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  WeatherWise
                </h1>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <Input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Search location..."
                    className="pr-10 bg-white dark:bg-gray-800"
                    aria-label="Search for location"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Search"
                    disabled={loading}
                  >
                    <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                  </button>
                </div>
              </form>

              {/* User Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowSettings(!showSettings);
                    speak(showSettings ? 'Closing settings' : 'Opening settings');
                  }}
                  aria-label="Settings"
                  title="Settings"
                >
                  <SettingsIcon className="h-5 w-5" aria-hidden="true" />
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowProfile(!showProfile);
                    speak(showProfile ? 'Closing profile' : 'Opening profile editor');
                  }}
                  className="flex items-center gap-2"
                  aria-label="Edit profile"
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline">{user?.name}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut className="h-5 w-5 mr-2" aria-hidden="true" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {showProfile ? (
            <ProfileEditor onClose={() => setShowProfile(false)} />
          ) : showSettings ? (
            <Settings onClose={() => setShowSettings(false)} />
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Weather and Alerts */}
              <div className="lg:col-span-2 space-y-6">
                <WeatherDisplay weatherData={weatherData} loading={loading} />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <TaskManager />
                <ChatBot weatherData={weatherData} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
