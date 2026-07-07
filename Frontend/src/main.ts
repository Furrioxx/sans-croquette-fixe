import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'primeicons/primeicons.css'
import App from './App.vue'
import router from './router'
import { PrimeVue } from '@primevue/core'
import { i18n } from './i18n'
import { ToastService } from 'primevue'
import ConfirmationService from 'primevue/confirmationservice'
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

import './style.css'

const app = createApp(App)

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fff1f1',
      100: '#ffdede',
      200: '#ffc4c4',
      300: '#ffa5a5',
      400: '#fc7676',
      500: '#f25f68',
      600: '#e14f61',
      700: '#bf4055',
      800: '#9f384d',
      900: '#853345',
      950: '#491923',
    },
  },
})

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.dark-mode',
    },
  },
})
app.use(i18n)
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
