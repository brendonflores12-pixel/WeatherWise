'use client';

import { useVoice } from '@/contexts/VoiceContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { X, Volume2, Gauge, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const { settings, updateSettings, speak } = useVoice();
  const { theme, setTheme } = useTheme();

  const handleSpeedChange = (value: number[]) => {
    updateSettings({ speed: value[0] });
  };

  const handleVolumeChange = (value: number[]) => {
    updateSettings({ volume: value[0] });
  };

  const handleLanguageChange = (language: string) => {
    updateSettings({ language });
    speak('Language updated');
  };

  const handleVoiceToggle = (enabled: boolean) => {
    updateSettings({ enabled });
    if (enabled) {
      speak('Voice assistant enabled');
    }
  };

  const testVoice = () => {
    speak('This is a test of the voice assistant. The current speed and volume settings are being applied.');
  };

  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'pt-BR', label: 'Portuguese' },
    { value: 'zh-CN', label: 'Chinese' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ko-KR', label: 'Korean' },
  ];

  return (
    <Card className="max-w-3xl mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Settings</CardTitle>
            <CardDescription>Customize your WeatherWise experience</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close settings"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Assistant Settings */}
        <section aria-labelledby="voice-settings-heading">
          <h3 id="voice-settings-heading" className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" aria-hidden="true" />
            Voice Assistant
          </h3>

          <div className="space-y-6">
            {/* Enable/Disable Voice */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="voice-enabled">Enable Voice Assistant</Label>
                <p className="text-sm text-muted-foreground">
                  Turn on voice feedback and controls
                </p>
              </div>
              <Switch
                id="voice-enabled"
                checked={settings.enabled}
                onCheckedChange={handleVoiceToggle}
                aria-label="Toggle voice assistant"
              />
            </div>

            <Separator />

            {/* Speech Speed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-speed" className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" aria-hidden="true" />
                  Speech Speed
                </Label>
                <span className="text-sm text-muted-foreground">
                  {settings.speed.toFixed(1)}x
                </span>
              </div>
              <Slider
                id="voice-speed"
                min={0.5}
                max={2}
                step={0.1}
                value={[settings.speed]}
                onValueChange={handleSpeedChange}
                disabled={!settings.enabled}
                aria-label="Adjust speech speed"
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Slow (0.5x)</span>
                <span>Normal (1.0x)</span>
                <span>Fast (2.0x)</span>
              </div>
            </div>

            <Separator />

            {/* Volume */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-volume">Volume</Label>
                <span className="text-sm text-muted-foreground">
                  {Math.round(settings.volume * 100)}%
                </span>
              </div>
              <Slider
                id="voice-volume"
                min={0}
                max={1}
                step={0.1}
                value={[settings.volume]}
                onValueChange={handleVolumeChange}
                disabled={!settings.enabled}
                aria-label="Adjust volume"
                className="w-full"
              />
            </div>

            <Separator />

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="voice-language" className="flex items-center gap-2">
                <Globe className="h-4 w-4" aria-hidden="true" />
                Language
              </Label>
              <Select
                value={settings.language}
                onValueChange={handleLanguageChange}
                disabled={!settings.enabled}
              >
                <SelectTrigger id="voice-language" aria-label="Select language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={testVoice}
              disabled={!settings.enabled}
              variant="outline"
              className="w-full"
            >
              Test Voice Settings
            </Button>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Theme Settings */}
        <section aria-labelledby="theme-settings-heading">
          <h3 id="theme-settings-heading" className="text-lg font-semibold mb-4">
            Appearance
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-select">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme-select" aria-label="Select theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="system">System Default</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Both light and dark modes meet WCAG AAA contrast standards
              </p>
            </div>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Keyboard Shortcuts */}
        <section aria-labelledby="shortcuts-heading">
          <h3 id="shortcuts-heading" className="text-lg font-semibold mb-4">
            Keyboard Shortcuts
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span>Toggle Voice Assistant</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                Alt + V
              </kbd>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span>Stop Speaking</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                Alt + S
              </kbd>
            </div>
            <div className="flex justify-between py-2">
              <span>Skip to Main Content</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                Tab
              </kbd>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
