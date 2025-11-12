'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { VoiceSettings } from '@/types';

interface VoiceContextType {
  settings: VoiceSettings;
  updateSettings: (settings: Partial<VoiceSettings>) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  currentText: string;
  startListening: () => void;
  stopListening: () => void;
  isListening: boolean;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: true,
    speed: 1,
    pitch: 1,
    language: 'en-US',
    volume: 1,
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('weatherwise_voice_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('weatherwise_voice_settings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const speak = useCallback((text: string) => {
    if (!settings.enabled || typeof window === 'undefined') return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.speed;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    utterance.lang = settings.language;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentText('');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentText('');
    };

    window.speechSynthesis.speak(utterance);
  }, [settings]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentText('');
    }
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return;
    }

    setIsListening(true);
    speak('Voice assistant activated. How can I help you?');
  }, [speak]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    speak('Voice assistant deactivated.');
  }, [speak]);

  return (
    <VoiceContext.Provider
      value={{
        settings,
        updateSettings,
        speak,
        stopSpeaking,
        isSpeaking,
        currentText,
        startListening,
        stopListening,
        isListening,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}
