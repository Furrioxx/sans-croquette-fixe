import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useManager } from './manager'
import { i18n } from '@/i18n'
import { useAuthStore } from '@/stores/authentication'
import { RouteNames } from './routeNames'

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

router.beforeEach(async (to, from, next) => {
  // Check authentication and authorization
  // check metas requiresAuth and requiredRoles of each route
  const authStore = useAuthStore()
  if (to.meta?.requiresAuth && !authStore.isConnected) {
    return next({ name: RouteNames.LOGIN, query: { redirect: to.fullPath } })
  } else if (to.meta?.requiredRoles) {
    const requiredRoles: string[] = to.meta.requiredRoles
    if (authStore.user == null) {
      // here we do have a token but we don't have the user data, so we need to fetch it to get the role for routing
      await retrieveUserData(() => {
        return next('/unauthorized')
      })
    }

    if (!authStore.getUserRole || !requiredRoles.includes(authStore.getUserRole)) {
      return next('/unauthorized')
    }
  }

  if (authStore.isConnected && !authStore.user) {
    // here we do have a token but we don't have the user data, so we need to fetch it to get the role for routing
    // there is no need to put an error callback here because this route isn't protected by a role or authentication
    retrieveUserData(() => {
      return
    })
  }
  return next()
})

const retrieveUserData = async (errorCallback: Function) => {
  const authStore = useAuthStore()
  await authStore.me().catch(() => {
    authStore.logout()
    errorCallback()
  })
}

// dynamic meta title name
router.afterEach((to) => {
  let titleKey: string | undefined = to.meta?.title
  if (!titleKey) {
    titleKey = `title.${useManager().getCurrentRouteName()}`
  }
  document.title = `${import.meta.env.VITE_APP_NAME} - ${i18n.global.t(titleKey)}`
})

export default router
