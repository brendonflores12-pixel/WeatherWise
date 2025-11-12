'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useVoice } from '@/contexts/VoiceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AuthFormProps {
  onSuccess: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const { speak } = useVoice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogin && !agreedToTerms) {
      setError('Please accept the Terms of Service and Privacy Policy');
      speak('Please accept the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    try {
      let success = false;

      if (isLogin) {
        success = await login(email, password);
        if (!success) {
          setError('Invalid email or password');
          speak('Login failed. Invalid email or password');
        } else {
          speak('Login successful. Welcome back!');
        }
      } else {
        if (!name || !location) {
          setError('Please fill in all fields');
          speak('Please fill in all fields');
          setLoading(false);
          return;
        }
        success = await signup(email, password, name, location);
        if (!success) {
          setError('Email already exists');
          speak('Signup failed. Email already exists');
        } else {
          speak('Account created successfully. Welcome to WeatherWise!');
        }
      }

      if (success) {
        onSuccess();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      speak('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? 'Sign in to access your farming dashboard'
            : 'Join WeatherWise to get started'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required={!isLogin}
                  aria-required={!isLogin}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your city or region"
                  required={!isLogin}
                  aria-required={!isLogin}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              aria-required="true"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                aria-required="true"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                required
                aria-required="true"
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the{' '}
                <Dialog>
                  <DialogTrigger asChild>
                    <button type="button" className="text-primary underline hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary rounded">
                      Terms of Service
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Terms of Service</DialogTitle>
                      <DialogDescription>Please read our terms of service carefully</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-96 pr-4">
                      <div className="space-y-4 text-sm">
                        <p className="font-semibold">Last Updated: November 2025</p>

                        <h3 className="font-semibold text-base">1. Acceptance of Terms</h3>
                        <p>By accessing and using WeatherWise, you accept and agree to be bound by the terms and provision of this agreement.</p>

                        <h3 className="font-semibold text-base">2. Use of Service</h3>
                        <p>WeatherWise provides weather forecasting and farming advisory services. The information is provided for general guidance and should not replace professional agricultural advice.</p>

                        <h3 className="font-semibold text-base">3. User Accounts</h3>
                        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

                        <h3 className="font-semibold text-base">4. Accuracy of Information</h3>
                        <p>While we strive to provide accurate weather data and farming advice, we cannot guarantee the accuracy, completeness, or timeliness of the information.</p>

                        <h3 className="font-semibold text-base">5. Limitation of Liability</h3>
                        <p>WeatherWise shall not be liable for any damages arising from the use or inability to use our services, including but not limited to crop failures or financial losses.</p>

                        <h3 className="font-semibold text-base">6. Data Privacy</h3>
                        <p>We collect and process your personal data in accordance with our Privacy Policy. Your data is used solely to provide and improve our services.</p>

                        <h3 className="font-semibold text-base">7. Modifications</h3>
                        <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.</p>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
                {' '}and{' '}
                <Dialog>
                  <DialogTrigger asChild>
                    <button type="button" className="text-primary underline hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary rounded">
                      Privacy Policy
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Privacy Policy</DialogTitle>
                      <DialogDescription>How we handle your information</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-96 pr-4">
                      <div className="space-y-4 text-sm">
                        <p className="font-semibold">Last Updated: November 2025</p>

                        <h3 className="font-semibold text-base">1. Information We Collect</h3>
                        <p>We collect information you provide directly to us, including your name, email address, location, and farming preferences.</p>

                        <h3 className="font-semibold text-base">2. How We Use Your Information</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Provide weather forecasts for your location</li>
                          <li>Deliver personalized farming advice</li>
                          <li>Send alerts about weather conditions and calamities</li>
                          <li>Improve our services and user experience</li>
                        </ul>

                        <h3 className="font-semibold text-base">3. Information Sharing</h3>
                        <p>We do not sell, trade, or rent your personal information to third parties. We may share aggregate anonymized data for research purposes.</p>

                        <h3 className="font-semibold text-base">4. Data Security</h3>
                        <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction.</p>

                        <h3 className="font-semibold text-base">5. Cookies and Tracking</h3>
                        <p>We use local storage to maintain your session and preferences. No third-party tracking cookies are used.</p>

                        <h3 className="font-semibold text-base">6. Your Rights</h3>
                        <p>You have the right to access, correct, or delete your personal data at any time through your account settings.</p>

                        <h3 className="font-semibold text-base">7. Children's Privacy</h3>
                        <p>Our service is not intended for users under 13 years of age. We do not knowingly collect information from children.</p>

                        <h3 className="font-semibold text-base">8. Contact Us</h3>
                        <p>For privacy-related questions, contact us at privacy@weatherwise.com</p>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </Label>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            aria-label={isLogin ? 'Sign in to your account' : 'Create new account'}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                speak(isLogin ? 'Switched to sign up form' : 'Switched to login form');
              }}
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
