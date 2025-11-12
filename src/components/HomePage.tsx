'use client';

import { Button } from '@/components/ui/button';
import { Cloud, Sprout, AlertTriangle, MessageSquare } from 'lucide-react';
import { useVoice } from '@/contexts/VoiceContext';

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  const { speak } = useVoice();

  const features = [
    {
      icon: Cloud,
      title: 'Real-Time Weather',
      description: 'Get accurate weather forecasts and conditions for your farm location',
    },
    {
      icon: Sprout,
      title: 'Farming Advice',
      description: 'Receive personalized recommendations on what, when, and how to plant',
    },
    {
      icon: AlertTriangle,
      title: 'Calamity Alerts',
      description: 'Stay informed about severe weather conditions and protect your crops',
    },
    {
      icon: MessageSquare,
      title: 'AI Chatbot',
      description: 'Get instant answers to your farming questions 24/7',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 dark:from-gray-900 dark:via-green-950 dark:to-gray-900">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <main id="main-content" className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Welcome to <span className="text-primary">WeatherWise</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your intelligent farming companion for weather forecasting, crop planning, and harvest optimization
          </p>
          <Button
            size="lg"
            onClick={() => {
              speak('Opening sign in page. Please create an account or log in to continue.');
              onGetStarted();
            }}
            className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            aria-label="Get started with WeatherWise"
          >
            Get Started
          </Button>
        </main>

        {/* Features Grid */}
        <section aria-labelledby="features-heading" className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <h2 id="features-heading" className="sr-only">Features</h2>
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        {/* Accessibility Features */}
        <section
          aria-labelledby="accessibility-heading"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
        >
          <h2 id="accessibility-heading" className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Accessible to Everyone
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3" role="img" aria-label="Voice assistant">
                🎤
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Voice Assistant</h3>
              <p className="text-gray-600 dark:text-gray-400">Navigate and control the app using voice commands</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3" role="img" aria-label="High contrast">
                🎨
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">High Contrast</h3>
              <p className="text-gray-600 dark:text-gray-400">WCAG AAA compliant color contrast in all modes</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3" role="img" aria-label="Screen reader support">
                📱
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Screen Readers</h3>
              <p className="text-gray-600 dark:text-gray-400">Fully compatible with all screen reading software</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
