'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { WeatherData } from '@/types';
import { Cloud, Droplets, Wind, AlertTriangle, Info, AlertCircle, Sprout } from 'lucide-react';

interface WeatherDisplayProps {
  weatherData: WeatherData | null;
  loading: boolean;
}

export function WeatherDisplay({ weatherData, loading }: WeatherDisplayProps) {
  if (loading) {
    return (
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" role="status" aria-label="Loading weather data" />
            <p className="text-lg text-muted-foreground">Loading weather data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardContent className="p-12">
          <div className="text-center text-muted-foreground">
            <Cloud className="h-16 w-16 mx-auto mb-4 opacity-50" aria-hidden="true" />
            <p className="text-lg">Search for a location to view weather data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getAlertVariant = (type: string): 'default' | 'destructive' => {
    return type === 'danger' ? 'destructive' : 'default';
  };

  const getAlertIcon = (type: string) => {
    if (type === 'danger') return AlertCircle;
    if (type === 'warning') return AlertTriangle;
    return Info;
  };

  return (
    <div className="space-y-6">
      {/* Main Weather Card */}
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3">
            <Cloud className="h-8 w-8 text-primary" aria-hidden="true" />
            {weatherData.location}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Temperature */}
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2" aria-label={`${weatherData.temperature} degrees Celsius`}>
                {weatherData.temperature}°C
              </div>
              <Badge variant="outline" className="text-lg px-4 py-1">
                {weatherData.condition}
              </Badge>
            </div>

            {/* Weather Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-lg">
                <Droplets className="h-6 w-6 text-blue-500" aria-hidden="true" />
                <span className="font-medium">Humidity:</span>
                <span>{weatherData.humidity}%</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <Wind className="h-6 w-6 text-gray-500" aria-hidden="true" />
                <span className="font-medium">Wind Speed:</span>
                <span>{weatherData.windSpeed} km/h</span>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-2">Forecast</h3>
            <p className="text-muted-foreground leading-relaxed">{weatherData.forecast}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Alerts and Advice */}
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <TabsTrigger value="alerts" className="text-base">
            <AlertTriangle className="h-4 w-4 mr-2" aria-hidden="true" />
            Alerts ({weatherData.alerts.length})
          </TabsTrigger>
          <TabsTrigger value="advice" className="text-base">
            <Sprout className="h-4 w-4 mr-2" aria-hidden="true" />
            Farming Advice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4 mt-4">
          {weatherData.alerts.length === 0 ? (
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <CardContent className="p-8 text-center text-muted-foreground">
                <Info className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
                <p>No active weather alerts at this time</p>
              </CardContent>
            </Card>
          ) : (
            weatherData.alerts.map((alert) => {
              const Icon = getAlertIcon(alert.type);
              return (
                <Alert
                  key={alert.id}
                  variant={getAlertVariant(alert.type)}
                  className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <AlertTitle className="text-lg font-semibold">{alert.title}</AlertTitle>
                  <AlertDescription className="text-base leading-relaxed mt-2">
                    {alert.message}
                  </AlertDescription>
                </Alert>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="advice" className="space-y-4 mt-4">
          {weatherData.farmingAdvice.map((advice) => (
            <Card key={advice.id} className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sprout className="h-6 w-6 text-primary" aria-hidden="true" />
                  {advice.title}
                </CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{advice.crop}</Badge>
                  <Badge variant="outline">{advice.season}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{advice.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
