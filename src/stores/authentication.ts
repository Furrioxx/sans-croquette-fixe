import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, UserLogin, UserPost, UserWithToken } from '@/models/User'
import { axiosInstance } from '@/services/axiosInsance'
import { localStorageHelper } from '@/utils/localStorageHelper'
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router/routeNames'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorageHelper.getData('token'))

  // Computed
  const isConnected = computed(() => token.value !== null)
  const getUsername = computed(() => user.value?.username ?? '')

  // Actions

  const register = async (userPost: UserPost) => {
    try {
      await axiosInstance.post('/auth/register', {
        username: userPost.username,
        email: userPost.email,
        password: userPost.password,
      })

      router.push({ name: RouteNames.LOGIN })
    } catch (error) {
      throw error
    }
  }

  const login = async (user: UserLogin) => {
    try {
      const res = await axiosInstance.post('/auth/login', {
        email: user.email,
        password: user.password,
      })
      const resData: UserWithToken = res.data
      setUser(resData.user)
      token.value = resData.token
      localStorageHelper.storeData('token', resData.token)
      router.push({ name: RouteNames.HOME })
    } catch (error: Error | any) {
      throw error
    }
  }

  const setUser = (userData: User) => {
    user.value = userData
  }

  const logout = () => {
    user.value = null
    token.value = null
  }

  return {
    // State
    user,
    token,
    // Computed
    isConnected,
    getUsername,
    // Actions
    register,
    login,
    logout,
  }
})
