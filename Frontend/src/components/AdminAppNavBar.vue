<script setup lang="ts">
import { RouteNames } from '@/router/routeNames'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authentication'
import router from '@/router'
import { i18n } from '@/i18n'
import { computed, ref, watch } from 'vue'
import { Roles } from '@/router/Roles'

const { t } = i18n.global

const isActive = (name: string) => route.name === name

const authStore = useAuthStore()
const route = useRoute()
const isAdmin = computed(() => authStore.getUserRole === Roles.ADMIN)
const mobileMenuOpen = ref(false)
const logout = () => {
  mobileMenuOpen.value = false
  authStore.logout()
  router.push({ name: RouteNames.HOME })
}
const items = computed(() => [
  { label: t('admin.nav.dashboard'), icon: 'pi pi-home', routeName: RouteNames.DASHBOARD },
  {
    label: t('admin.nav.absences'),
    icon: 'pi pi-calendar-times',
    routeName: RouteNames.DASHBOARD_ABSENCES,
  },
  {
    label: t('admin.nav.adoptionRequests'),
    icon: 'pi pi-inbox',
    routeName: RouteNames.DASHBOARD_ADOPTION_REQUESTS,
  },
  {
    label: t('admin.nav.conversations'),
    icon: 'pi pi-comments',
    routeName: RouteNames.DASHBOARD_CONVERSATIONS,
  },
  ...(isAdmin.value
    ? [
        { label: t('admin.nav.cats'), icon: 'pi pi-list', routeName: RouteNames.DASHBOARD_CATS },
        {
          label: t('admin.nav.tarifications'),
          icon: 'pi pi-tag',
          routeName: RouteNames.DASHBOARD_TARIFICATIONS,
        },
        {
          label: t('admin.nav.blog'),
          icon: 'pi pi-pen-to-square',
          routeName: RouteNames.DASHBOARD_BLOG,
        },
        {
          label: t('admin.nav.analytics'),
          icon: 'pi pi-chart-line',
          routeName: RouteNames.DASHBOARD_ANALYTICS,
        },
        { label: t('admin.nav.users'), icon: 'pi pi-users', routeName: RouteNames.DASHBOARD_USERS },
        {
          label: t('admin.nav.settings'),
          icon: 'pi pi-cog',
          routeName: RouteNames.DASHBOARD_SETTINGS,
        },
      ]
    : []),
])

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    mobileMenuOpen.value = false
  },
)
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden bg-gray-50">
    <Transition name="admin-overlay">
      <button
        v-if="mobileMenuOpen"
        type="button"
        class="fixed inset-0 z-30 bg-gray-950/35 lg:hidden"
        aria-label="Fermer le menu d'administration"
        @click="closeMobileMenu"
      ></button>
    </Transition>

    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 flex h-full w-[88vw] max-w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:w-64 lg:max-w-none lg:translate-x-0',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex h-16 items-center justify-between border-b border-gray-100 px-5 lg:px-6">
        <span class="text-lg font-semibold text-gray-800 lg:text-xl">{{ $t('admin.space-title') }}</span>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 lg:hidden"
          aria-label="Fermer le menu d'administration"
          @click="closeMobileMenu"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <nav class="flex-1 space-y-2 overflow-y-auto p-4">
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
          @click="closeMobileMenu"
        >
          <i :class="item.icon" class="text-lg"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-100">
        <Button
          :label="$t('admin.go-to-site')"
          icon="pi pi-external-link"
          class="w-full mb-2"
          outlined
          @click="closeMobileMenu(); router.push({ name: RouteNames.HOME })"
        />
        <Button
          :label="$t('logout')"
          icon="pi pi-sign-out"
          class="w-full p-button-text p-button-danger"
          @click="logout"
        />
      </div>
    </aside>

    <main class="flex min-w-0 flex-1 flex-col overflow-y-auto">
      <div class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-wide text-primary-600">Administration</p>
          <p class="truncate text-sm font-semibold text-gray-800">{{ $t('admin.space-title') }}</p>
        </div>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700"
          aria-label="Ouvrir le menu d'administration"
          @click="mobileMenuOpen = true"
        >
          <i class="pi pi-bars"></i>
        </button>
      </div>

      <div class="flex-1 p-4 sm:p-6 lg:p-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-overlay-enter-active,
.admin-overlay-leave-active {
  transition: opacity 0.2s ease;
}

.admin-overlay-enter-from,
.admin-overlay-leave-to {
  opacity: 0;
}
</style>
