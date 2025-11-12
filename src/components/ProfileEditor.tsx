'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useVoice } from '@/contexts/VoiceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { X, Upload, User } from 'lucide-react';

interface ProfileEditorProps {
  onClose: () => void;
}

export function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { user, updateProfile } = useAuth();
  const { speak } = useVoice();
  const [name, setName] = useState(user?.name || '');
  const [location, setLocation] = useState(user?.location || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        speak('Profile picture uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({ name, location, profileImage });
    speak('Profile updated successfully');
    onClose();
  };

  return (
    <Card className="max-w-2xl mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close profile editor"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold border-4 border-primary">
                {name?.charAt(0).toUpperCase() || <User className="h-16 w-16" />}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Label
              htmlFor="profile-image"
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                <Upload className="h-4 w-4" aria-hidden="true" />
                Upload Photo
              </div>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
                aria-label="Upload profile picture"
              />
            </Label>
            {profileImage && (
              <Button
                variant="outline"
                onClick={() => {
                  setProfileImage('');
                  speak('Profile picture removed');
                }}
                aria-label="Remove profile picture"
              >
                Remove
              </Button>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Full Name</Label>
            <Input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              aria-label="Full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
              aria-label="Email (read-only)"
              aria-disabled="true"
            />
            <p className="text-sm text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-location">Location</Label>
            <Input
              id="profile-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your city or region"
              aria-label="Location"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
