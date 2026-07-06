<script setup lang="ts">
import { RouteNames } from '@/router/routeNames'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authentication'
import router from '@/router'
import { i18n } from '@/i18n'
import { computed } from 'vue'
import { Roles } from '@/router/Roles'

const { t } = i18n.global

const isActive = (name: string) => route.name === name

const authStore = useAuthStore()
const route = useRoute()
const isAdmin = computed(() => authStore.getUserRole === Roles.ADMIN)
const logout = () => {
  authStore.logout()
  router.push({ name: RouteNames.HOME })
}
const items = computed(() =>
  [
  { label: t('admin.nav.dashboard'), icon: 'pi pi-home', routeName: RouteNames.DASHBOARD },
  {
    label: t('admin.nav.absences'),
    icon: 'pi pi-calendar-times',
    routeName: RouteNames.DASHBOARD_ABSENCES,
  },
  ...(isAdmin.value
    ? [
        { label: t('admin.nav.cats'), icon: 'pi pi-list', routeName: RouteNames.DASHBOARD_CATS },
        {
          label: t('admin.nav.analytics'),
          icon: 'pi pi-chart-line',
          routeName: RouteNames.DASHBOARD_ANALYTICS,
        },
        { label: t('admin.nav.users'), icon: 'pi pi-users', routeName: RouteNames.DASHBOARD_USERS },
        { label: t('admin.nav.settings'), icon: 'pi pi-cog', routeName: RouteNames.DASHBOARD_SETTINGS },
      ]
    : []),
]
)
</script>

<template>
  <div class="w-full h-screen flex overflow-hidden">
    <!-- Sidebar -->
    <aside class="h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <span class="text-xl font-semibold text-gray-800"> Mon Dashboard </span>
      </div>

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <router-link
          v-for="item in items"
          :key="item.label"
          :to="{ name: item.routeName }"
          class="btn-bis"
          :class="
            isActive(item.routeName)
              ? 'bg-primary-50 text-primary-600 font-medium'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          "
        >
          <i :class="item.icon" class="text-lg"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-100">
        <Button
          :label="$t('logout')"
          icon="pi pi-sign-out"
          class="w-full p-button-text p-button-danger"
          @click="logout"
        />
      </div>
    </aside>

    <main class="flex-1 overflow-y-auto bg-gray-50 p-8">
      <RouterView />
    </main>
  </div>
</template>
