import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useManager } from './manager'
import { i18n } from '@/i18n'
import { useAuthStore } from '@/stores/authentication'

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

router.beforeEach((to, from, next) => {
  // Check authentication and authorization
  // check metas requiresAuth and requiredRoles of each route
  const authStore = useAuthStore()
  if (to.meta?.requiresAuth && !authStore.isConnected) {
    return next('/unauthorized')
  } else if (to.meta?.requiredRoles) {
    const requiredRoles: string[] = to.meta.requiredRoles
    if (!authStore.getUserRole || !requiredRoles.includes(authStore.getUserRole)) {
      return next('/unauthorized')
    }
  }
  return next()
})

// dynamic meta title name
router.afterEach((to) => {
  let titleKey: string | undefined = to.meta?.title
  if (!titleKey) {
    titleKey = `title.${useManager().getCurrentRouteName()}`
  }
  document.title = `${import.meta.env.VITE_APP_NAME} - ${i18n.global.t(titleKey)}`
})

export default router
