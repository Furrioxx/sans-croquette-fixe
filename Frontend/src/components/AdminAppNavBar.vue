<script setup lang="ts">
import { RouteNames } from '@/router/routeNames'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authentication'
import router from '@/router'

const items = [
  { label: 'Dashboard', icon: 'pi pi-home', routeName: RouteNames.DASHBOARD },
  { label: 'Analytics', icon: 'pi pi-chart-line', routeName: RouteNames.DASHBOARD },
  { label: 'Utilisateurs', icon: 'pi pi-users', routeName: RouteNames.DASHBOARD_USERS },
  { label: 'Paramètres', icon: 'pi pi-cog', routeName: RouteNames.DASHBOARD },
]

const isActive = (name: string) => route.name === name

const authStore = useAuthStore()
const route = useRoute()
const logout = () => {
  authStore.logout()
  router.push({ name: RouteNames.HOME })
}
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
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
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
          label="Déconnexion"
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
