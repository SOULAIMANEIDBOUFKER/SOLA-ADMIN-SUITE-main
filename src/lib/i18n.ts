/**
 * Internationalization (i18n) configuration
 * Supports German (de) and English (en)
 * Uses i18next with react-i18next for React integration
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import config from '@/config/env';

// Import translation files
import enCommon from '@/locales/en/common.json';
import deCommon from '@/locales/de/common.json';

// Get stored language preference or use default
const getStoredLanguage = (): string => {
  const stored = localStorage.getItem('language');
  if (stored && ['en', 'de'].includes(stored)) {
    return stored;
  }
  return config.defaultLocale;
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
      },
      de: {
        common: deCommon,
      },
    },
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
      escapeValue: false, // React already handles XSS
    },
    react: {
      useSuspense: false,
    },
  });

// Helper to persist language change
export const changeLanguage = (lang: 'en' | 'de'): void => {
  localStorage.setItem('language', lang);
  i18n.changeLanguage(lang);
};

// Date formatting based on current locale
export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  const locale = i18n.language === 'de' ? 'de-DE' : 'en-US';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(dateObj);
};

// Relative time formatting (e.g., "2 hours ago")
export const formatRelativeTime = (date: string | Date): string => {
  const locale = i18n.language === 'de' ? 'de-DE' : 'en-US';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffMins < 1) return i18n.t('common:time.justNow');
  if (diffMins < 60) return rtf.format(-diffMins, 'minute');
  if (diffHours < 24) return rtf.format(-diffHours, 'hour');
  if (diffDays < 30) return rtf.format(-diffDays, 'day');
  
  return formatDate(dateObj);
};

// Number formatting based on current locale
export const formatNumber = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  const locale = i18n.language === 'de' ? 'de-DE' : 'en-US';
  return new Intl.NumberFormat(locale, options).format(value);
};

export default i18n;
