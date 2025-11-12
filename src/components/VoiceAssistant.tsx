'use client';

import { useVoice } from '@/contexts/VoiceContext';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useEffect } from 'react';

export function VoiceAssistant() {
  const { settings, isListening, isSpeaking, startListening, stopListening, speak, stopSpeaking } = useVoice();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'v') {
        e.preventDefault();
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }

      if (e.altKey && e.key === 's') {
        e.preventDefault();
        if (isSpeaking) {
          stopSpeaking();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isListening, isSpeaking, startListening, stopListening, stopSpeaking]);

  if (!settings.enabled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <Button
        size="lg"
        variant={isListening ? 'default' : 'outline'}
        className="rounded-full w-16 h-16 shadow-lg hover:scale-110 transition-transform"
        onClick={isListening ? stopListening : startListening}
        aria-label={isListening ? 'Stop voice assistant (Alt+V)' : 'Start voice assistant (Alt+V)'}
        title={isListening ? 'Stop voice assistant (Alt+V)' : 'Start voice assistant (Alt+V)'}
      >
        {isListening ? (
          <Mic className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MicOff className="h-6 w-6" aria-hidden="true" />
        )}
      </Button>

      {isSpeaking && (
        <Button
          size="lg"
          variant="destructive"
          className="rounded-full w-16 h-16 shadow-lg hover:scale-110 transition-transform"
          onClick={stopSpeaking}
          aria-label="Stop speaking (Alt+S)"
          title="Stop speaking (Alt+S)"
        >
          <VolumeX className="h-6 w-6" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
