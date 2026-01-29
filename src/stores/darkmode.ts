import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { localStorageHelper } from '@/utils/localStorageHelper'

export const useDarkModeStore = defineStore('darkMode', () => {
  const darkMode = ref<boolean>(true)

  const setDarkMode = (value: boolean) => {
    darkMode.value = value
  }

  const darkmodeIcon = computed(() => {
    return 'pi ' + (darkMode.value ? 'pi-moon' : 'pi-sun')
  })

  const initDarkMode = () => {
    const storedDarkMode = localStorageHelper.getData('darkmode')
    if (storedDarkMode !== null) {
        if (storedDarkMode) {
            addDarkModeClass()
        } else {
            removeDarkModeClass()
        }
    }
  }

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    if (darkMode.value) {
      addDarkModeClass()
    } else {
      removeDarkModeClass()
    }
    localStorageHelper.storeData('darkmode', darkMode.value)
  }

  const addDarkModeClass = () => {
    document.documentElement.classList.add('dark-mode')
    setDarkMode(true)
  }

  const removeDarkModeClass = () => {
    document.documentElement.classList.remove('dark-mode')
    setDarkMode(false)
  }
  

  return {
    darkMode,
    darkmodeIcon,
    initDarkMode,
    toggleDarkMode,
  }
})