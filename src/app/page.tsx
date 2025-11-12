'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { HomePage } from '@/components/HomePage';
import { AuthForm } from '@/components/AuthForm';
import { Dashboard } from '@/components/Dashboard';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { VoiceSubtitles } from '@/components/VoiceSubtitles';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (isAuthenticated) {
    return (
      <>
        <Dashboard />
        <VoiceAssistant />
        <VoiceSubtitles />
      </>
    );
  }

  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-blue-50 to-green-100 dark:from-gray-900 dark:via-green-950 dark:to-gray-900">
        <AuthForm onSuccess={() => setShowAuth(false)} />
        <VoiceAssistant />
        <VoiceSubtitles />
      </div>
    );
  }

  return (
    <>
      <HomePage onGetStarted={() => setShowAuth(true)} />
      <VoiceAssistant />
      <VoiceSubtitles />
    </>
  );
}
