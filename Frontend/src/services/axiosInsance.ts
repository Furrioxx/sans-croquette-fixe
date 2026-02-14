import axios from 'axios'
import { useAuthStore } from '@/stores/authentication'

export var axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// token interceptor
axiosInstance.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.isConnected) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }

  return config
})