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
      50: '#fff6ed',
      100: '#ffe6d1',
      200: '#f9c8a7',
      300: '#f2a77a',
      400: '#e68a59',
      500: '#c96d44',
      600: '#a95838',
      700: '#87452f',
      800: '#6d3928',
      900: '#5a3124',
      950: '#31180f',
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
