import { createI18n } from 'vue-i18n'
import fr from './fr.json'

export const languages = {
  fr: fr,
}

const messages = Object.assign(languages)

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  globalInjection: true,
  messages,
})

export { i18n }