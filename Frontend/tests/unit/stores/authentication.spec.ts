import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/authentication'
import { axiosInstance } from '@/services/axiosInsance'
import { RouteNames } from '@/router/routeNames'
import { Roles } from '@/router/Roles'

vi.mock('@/services/axiosInsance', () => ({
  axiosInstance: { post: vi.fn(), get: vi.fn() },
}))

const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock, currentRoute: { value: { query: {} } } }),
}))

describe('authentication store', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('logs in, fetches the profile, and redirects an admin to the dashboard', async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: { jwt: 'fake-jwt' } })
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: { username: 'admin', role: { name: 'Admin' } },
    })

    const authStore = useAuthStore()
    await authStore.login({ identifier: 'a@a.com', password: 'pw' })

    await vi.waitFor(() => expect(pushMock).toHaveBeenCalledWith({ name: RouteNames.DASHBOARD }))
    expect(authStore.isConnected).toBe(true)
    expect(authStore.getUserRole).toBe(Roles.ADMIN)
  })

  it('redirects a standard user to home instead of the dashboard', async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: { jwt: 'fake-jwt' } })
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: { username: 'user', role: { name: 'User' } },
    })

    const authStore = useAuthStore()
    await authStore.login({ identifier: 'user@a.com', password: 'pw' })

    await vi.waitFor(() => expect(pushMock).toHaveBeenCalledWith({ name: RouteNames.HOME }))
  })

  it('stores the token in localStorage when rememberMe is true', async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: { jwt: 'fake-jwt' } })
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: { username: 'user', role: { name: 'User' } },
    })

    const authStore = useAuthStore()
    await authStore.login({ identifier: 'user@a.com', password: 'pw' }, true)

    expect(localStorage.getItem('token')).toBe(JSON.stringify('fake-jwt'))
    expect(sessionStorage.getItem('session-token')).toBeNull()
  })

  it('stores the token in sessionStorage when rememberMe is false', async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: { jwt: 'fake-jwt' } })
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: { username: 'user', role: { name: 'User' } },
    })

    const authStore = useAuthStore()
    await authStore.login({ identifier: 'user@a.com', password: 'pw' }, false)

    expect(sessionStorage.getItem('session-token')).toBe('fake-jwt')
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('rejects and leaves the user disconnected when the credentials are wrong', async () => {
    vi.mocked(axiosInstance.post).mockRejectedValue(new Error('invalid credentials'))

    const authStore = useAuthStore()
    await expect(authStore.login({ identifier: 'a@a.com', password: 'wrong' })).rejects.toThrow(
      'invalid credentials',
    )
    expect(authStore.isConnected).toBe(false)
  })

  it('clears the token and user on logout', async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: { jwt: 'fake-jwt' } })
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: { username: 'admin', role: { name: 'Admin' } },
    })

    const authStore = useAuthStore()
    await authStore.login({ identifier: 'a@a.com', password: 'pw' })
    await vi.waitFor(() => expect(authStore.getUsername).toBe('admin'))

    authStore.logout()

    expect(authStore.isConnected).toBe(false)
    expect(authStore.getUsername).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })
})
