/**
 * Settings Page
 * Manage language, theme, and profile settings
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Globe, Palette, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { changeLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [displayName, setDisplayName] = useState(user?.name || '');

  const handleLanguageChange = (lang: 'en' | 'de') => {
    changeLanguage(lang);
    toast.success(t('settings.changesSaved'));
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast.success(t('settings.changesSaved'));
  };

  const handleSaveProfile = () => {
    // In a real app, this would call the API
    toast.success(t('settings.changesSaved'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t('settings.title')}
        </h1>
        <p className="text-muted-foreground">
          Manage your preferences and profile settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Globe className="h-4 w-4" />
              {t('settings.language')}
            </CardTitle>
            <CardDescription>
              Select your preferred language
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleLanguageChange('en')}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted',
                  i18n.language === 'en' && 'border-primary bg-primary/5'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇬🇧</span>
                  <span className="font-medium">English</span>
                </div>
                {i18n.language === 'en' && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
              <button
                onClick={() => handleLanguageChange('de')}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted',
                  i18n.language === 'de' && 'border-primary bg-primary/5'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇩🇪</span>
                  <span className="font-medium">Deutsch</span>
                </div>
                {i18n.language === 'de' && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Palette className="h-4 w-4" />
              {t('settings.theme')}
            </CardTitle>
            <CardDescription>
              Choose your preferred color scheme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-muted',
                  theme === 'light' && 'border-primary bg-primary/5'
                )}
              >
                <div className="h-10 w-10 rounded-full bg-white border shadow-sm" />
                <span className="text-sm font-medium">
                  {t('settings.themeLight')}
                </span>
                {theme === 'light' && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-muted',
                  theme === 'dark' && 'border-primary bg-primary/5'
                )}
              >
                <div className="h-10 w-10 rounded-full bg-slate-900 border" />
                <span className="text-sm font-medium">
                  {t('settings.themeDark')}
                </span>
                {theme === 'dark' && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-muted',
                  theme === 'system' && 'border-primary bg-primary/5'
                )}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white to-slate-900 border" />
                <span className="text-sm font-medium">
                  {t('settings.themeSystem')}
                </span>
                {theme === 'system' && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <User className="h-4 w-4" />
              {t('settings.profile')}
            </CardTitle>
            <CardDescription>
              Update your profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    {user?.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Change avatar
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">{t('settings.profileName')}</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('users.role')}</Label>
                  <Input
                    value={user?.role ? t(`roles.${user.role}`) : ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <Button onClick={handleSaveProfile}>
                  {t('settings.saveChanges')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
