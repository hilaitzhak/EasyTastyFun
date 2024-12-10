import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import enTranslations from '../locales/en.json';
import heTranslations from '../locales/he.json';

const resources = {
  en: {
    translation: enTranslations
  },
  he: {
    translation: heTranslations
  }
};

i18n
    // .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: true,
        interpolation: {
        escapeValue: false
        },
        react: {
        useSuspense: false
        }
    });
    
// Set initial direction based on saved language
document.dir = i18n.language === 'he' ? 'rtl' : 'ltr';

// Also handle direction on language change
i18n.on('languageChanged', (lng) => {
  document.dir = lng === 'he' ? 'rtl' : 'ltr';
});

export default i18n;
