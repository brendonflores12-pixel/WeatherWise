'use client';

import { useVoice } from '@/contexts/VoiceContext';
import { useEffect, useState } from 'react';

export function VoiceSubtitles() {
  const { currentText, isSpeaking } = useVoice();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isSpeaking && currentText) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, currentText]);

  if (!visible || !currentText) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-3xl w-full px-4"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="bg-black/90 dark:bg-white/90 text-white dark:text-black px-6 py-4 rounded-lg shadow-2xl border-2 border-primary">
        <p className="text-center text-lg font-medium leading-relaxed">
          {currentText}
        </p>
      </div>
    </div>
  );
}
