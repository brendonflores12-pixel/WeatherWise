'use client';

import { useState, useRef, useEffect } from 'react';
import { useVoice } from '@/contexts/VoiceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { WeatherData } from '@/types';
import { MessageSquare, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  weatherData: WeatherData | null;
}

export function ChatBot({ weatherData }: ChatBotProps) {
  const { speak } = useVoice();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your farming assistant. Ask me anything about planting, weather conditions, or crop management.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Weather-related queries
    if (lowerMessage.includes('weather') || lowerMessage.includes('temperature') || lowerMessage.includes('forecast')) {
      if (weatherData) {
        return `Current weather in ${weatherData.location}: ${weatherData.temperature}°C with ${weatherData.condition} conditions. Humidity is ${weatherData.humidity}% and wind speed is ${weatherData.windSpeed} km/h. ${weatherData.forecast}`;
      }
      return 'Please search for a location to get weather information.';
    }

    // Planting advice
    if (lowerMessage.includes('plant') || lowerMessage.includes('crop') || lowerMessage.includes('grow')) {
      if (lowerMessage.includes('when')) {
        return 'The best planting time depends on your crop and climate. Generally: Spring (March-May) for warm-season crops like tomatoes, peppers, and squash. Fall (September-October) for cool-season crops like lettuce, broccoli, and peas. Always check your local frost dates!';
      }
      if (lowerMessage.includes('what')) {
        const temp = weatherData?.temperature || 20;
        if (temp > 25) {
          return 'For warm weather, I recommend heat-tolerant crops: Tomatoes, peppers, eggplant, okra, melons, and beans. These thrive in temperatures above 25°C.';
        } else if (temp < 15) {
          return 'For cool weather, consider: Lettuce, spinach, kale, broccoli, peas, and root vegetables like carrots and radishes. These prefer temperatures below 15°C.';
        } else {
          return 'Your temperature is ideal for most crops! Consider: Tomatoes, cucumbers, zucchini, lettuce, and herbs like basil and cilantro.';
        }
      }
      return 'I can help with planting advice! Ask me: "When should I plant?" or "What should I plant in this weather?"';
    }

    // Watering advice
    if (lowerMessage.includes('water') || lowerMessage.includes('irrigation')) {
      const condition = weatherData?.condition || 'sunny';
      if (condition === 'rainy') {
        return 'With rainy conditions, reduce watering frequency. Ensure proper drainage to prevent waterlogging. Check soil moisture before watering.';
      } else if (condition === 'sunny') {
        return 'In sunny weather, water early morning (6-10 AM) or evening (4-7 PM) to minimize evaporation. Most crops need 1-2 inches of water per week. Deep, infrequent watering is better than shallow, frequent watering.';
      }
      return 'Water your plants when the top inch of soil is dry. Most vegetables need consistent moisture, about 1-2 inches per week including rainfall.';
    }

    // Pest control
    if (lowerMessage.includes('pest') || lowerMessage.includes('bug') || lowerMessage.includes('insect')) {
      return 'For natural pest control: 1) Companion planting (marigolds deter many pests), 2) Neem oil spray for soft-bodied insects, 3) Hand-picking larger pests, 4) Encourage beneficial insects like ladybugs, 5) Use row covers for vulnerable crops. For severe infestations, consult local agricultural extension services.';
    }

    // Soil health
    if (lowerMessage.includes('soil') || lowerMessage.includes('compost') || lowerMessage.includes('fertilizer')) {
      return 'Healthy soil is crucial! Tips: 1) Add compost regularly (2-3 inches annually), 2) Test soil pH (most crops prefer 6.0-7.0), 3) Rotate crops to prevent nutrient depletion, 4) Use mulch to retain moisture and prevent weeds, 5) Consider cover crops in off-season to improve soil structure.';
    }

    // Harvest timing
    if (lowerMessage.includes('harvest') || lowerMessage.includes('pick') || lowerMessage.includes('ready')) {
      return 'Harvest timing varies by crop. General signs: Tomatoes - firm with full color, Lettuce - before it bolts, Carrots - when tops are 1 inch diameter, Peppers - when they reach full size and desired color. Most vegetables taste best when harvested in the morning after dew dries.';
    }

    // Alerts and calamities
    if (lowerMessage.includes('alert') || lowerMessage.includes('warning') || lowerMessage.includes('danger')) {
      if (weatherData && weatherData.alerts.length > 0) {
        const alert = weatherData.alerts[0];
        return `Active alert: ${alert.title} - ${alert.message}`;
      }
      return 'No active weather alerts at this time. I\'ll notify you if any severe weather is detected.';
    }

    // Default responses
    const defaultResponses = [
      'I can help you with planting advice, watering schedules, pest control, soil health, and weather-related farming questions. What would you like to know?',
      'Great question! I specialize in weather-based farming advice. You can ask me about what to plant, when to water, how to prepare for weather changes, and more.',
      'I\'m here to help with your farming needs! Try asking about crop recommendations, planting schedules, or current weather conditions.',
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking time
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      speak(response);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm flex flex-col h-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" aria-hidden="true" />
          Farming Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 dark:bg-gray-800 text-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about farming, weather, or crops..."
              className="flex-1"
              aria-label="Chat message input"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
