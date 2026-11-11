import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fa from './locales/fa.json'
import en from './locales/en.json'
import ar from './locales/ar.json'

export const LANGUAGES = [
  { code: 'fa', label: 'Fa' },
  { code: 'en', label: 'en' },
  { code: 'ar', label: 'ar' },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]['code']

const savedLanguage = localStorage.getItem('shop-language')
const initialLanguage: LanguageCode =
  savedLanguage === 'fa' || savedLanguage === 'en' || savedLanguage === 'ar'
    ? savedLanguage
    : 'fa'

export function syncDocumentLanguage(language: string) {
  const code = language.split('-')[0]
  const isRtl = code === 'fa' || code === 'ar'
  document.documentElement.lang = code
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fa: { translation: fa },
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    supportedLngs: ['fa', 'en', 'ar'],
    interpolation: { escapeValue: false },
  })

syncDocumentLanguage(initialLanguage)

i18n.on('languageChanged', (language) => {
  const code = language.split('-')[0]
  if (code === 'fa' || code === 'en' || code === 'ar') {
    localStorage.setItem('shop-language', code)
    syncDocumentLanguage(code)
  }
})

export default i18n
