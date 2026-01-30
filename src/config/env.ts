/**
 * Environment configuration
 * All environment variables are accessed through this module
 * for type safety and centralized management
 */

// Validate required environment variables
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] ?? defaultValue;
  if (value === undefined) {
    console.warn(`Environment variable ${key} is not defined`);
  }
  return value ?? '';
};

export const config = {
  // API Configuration
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:5000'),
  
  // Application settings
  appName: getEnvVar('VITE_APP_NAME', 'Sola Admin Dashboard'),
  
  // Localization
  defaultLocale: getEnvVar('VITE_DEFAULT_LOCALE', 'de'),
  
  // Feature flags
  enableMock: getEnvVar('VITE_ENABLE_MOCK', 'true') === 'true',
  
  // Development
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

export default config;
