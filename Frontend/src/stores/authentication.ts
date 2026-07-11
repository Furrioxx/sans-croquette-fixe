import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, UserLogin, UserPost, UserWithToken } from '@/models/User'
import { axiosInstance } from '@/services/axiosInsance'
import { localStorageHelper } from '@/utils/localStorageHelper'
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router/routeNames'
import { Roles } from '@/router/Roles'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const sessionTokenKey = 'session-token'
  const persistentToken = localStorageHelper.getData('token')
  const sessionToken = sessionStorage.getItem(sessionTokenKey)

  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(persistentToken ?? sessionToken)

  // Computed
  const isConnected = computed<boolean>(() => {
    return token.value !== null && token.value !== undefined && token.value !== ''
  })
  const getUsername = computed<string | null>(() => user.value?.username ?? null)
  const getUserRole = computed<Roles | null>(() => {
    const roleName = user.value?.role?.name ?? ''
    switch (roleName) {
      case 'Admin':
        return Roles.ADMIN
      case 'Volunteer':
        return Roles.VOLUNTEER
      case 'User':
        return Roles.USER
      default:
        return null
    }
  })

  // Actions
  const register = async (userPost: UserPost) => {
    try {
      const response = await axiosInstance.post('/auth/local/register', {
        username: userPost.username,
        email: userPost.email,
        password: userPost.password,
        newsletterOptIn: userPost.newsletterOptIn,
      })

      // handle success, here we directly log the user in after registration
      const resData: UserWithToken = response.data
      handleAuthSuccess(resData)
    } catch (error) {
      throw error
    }
  }

  const login = async (user: UserLogin, rememberMe = true) => {
    try {
      const res = await axiosInstance.post('/auth/local', {
        identifier: user.identifier,
        password: user.password,
      })
      const resData: UserWithToken = res.data
      handleAuthSuccess(resData, rememberMe)
    } catch (error: Error | any) {
      throw error
    }
  }

  const me = async () => {
    try {
      const res = await axiosInstance.get('/user-profiles/me')
      const userData: User = res.data
      setUser(userData)
    } catch (error: Error | any) {
      throw error
    }
  }

  const handleAuthSuccess = async (resData: UserWithToken, rememberMe = true) => {
    token.value = resData.jwt
    if (rememberMe) {
      localStorageHelper.storeData('token', resData.jwt)
      sessionStorage.removeItem(sessionTokenKey)
    } else {
      localStorageHelper.removeData('token')
      sessionStorage.setItem(sessionTokenKey, resData.jwt)
    }

    // we need to set the user data to get the role for routing
    try {
      await me()

      const redirect = router.currentRoute.value.query.redirect

      if (typeof redirect === 'string' && redirect.length > 0) {
        router.push(redirect)
        return
      }

      switch (getUserRole.value) {
        case Roles.ADMIN:
        case Roles.VOLUNTEER:
          router.push({ name: RouteNames.DASHBOARD })
          break
        case Roles.USER:
          router.push({ name: RouteNames.HOME })
          break
        default:
          break
      }
    } catch (error) {
      throw error
    }
  }

  const setUser = (userData: User) => {
    user.value = userData
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorageHelper.removeData('token')
    sessionStorage.removeItem(sessionTokenKey)
  }

  return {
    // State
    user,
    token,
    // Computed
    isConnected,
    getUsername,
    getUserRole,
    // Actions
    register,
    login,
    logout,
    me,
  }
})
