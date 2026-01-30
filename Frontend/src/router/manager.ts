import { useRouter } from 'vue-router'
import { i18n } from '@/i18n'

export function useManager() {
  const router = useRouter()

  const t = i18n.global.t

  function getCurrentRoute(): any {
    return router.currentRoute
  }

  function getCurrentRouteName(): string {
    return getCurrentRoute().value.name
  }

  function getCurrentRouteTitle() {
    return t(`title.${getCurrentRouteName()}`)
  }

  return {
    getCurrentRoute: getCurrentRoute,
    getCurrentRouteName: getCurrentRouteName,
    getCurrentRouteTitle: getCurrentRouteTitle,
  }
}