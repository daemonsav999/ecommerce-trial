import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your language files
import en from './locales/en.json';
import zh from './locales/zh.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      zh: {
        translation: zh,
      },
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;