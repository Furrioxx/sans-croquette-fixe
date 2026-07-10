<script setup lang="ts">
import { RouteNames } from '@/router/routeNames'
import { Roles } from '@/router/Roles'
import { useRouter } from 'vue-router'
import { useDarkModeStore } from '@/stores/darkmode'
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authentication'
import { useI18n } from 'vue-i18n'
import Logo from '@/assets/Logo.png'

const router = useRouter()
const darkModeStore = useDarkModeStore()
const authStore = useAuthStore()
const { t } = useI18n()
const canAccessAdmin = computed(() =>
  [Roles.ADMIN, Roles.VOLUNTEER].includes(authStore.getUserRole as Roles),
)

onMounted(() => {
  darkModeStore.initDarkMode()
})

const userMenu = ref()
const userMenuItems = computed(() => [
  ...(canAccessAdmin.value
    ? [
        {
          label: t('admin.nav.access'),
          icon: 'pi pi-briefcase',
          command: () => router.push({ name: RouteNames.DASHBOARD }),
        },
        { separator: true },
      ]
    : []),
  {
    label: t('adoptionRequest.user.navLink'),
    icon: 'pi pi-heart',
    command: () => router.push({ name: RouteNames.USER_ADOPTION_REQUESTS }),
  },
  { separator: true },
  {
    label: t('logout'),
    icon: 'pi pi-sign-out',
    command: () => authStore.logout(),
  },
])
const toggleUserMenu = (event: Event) => {
  userMenu.value?.toggle(event)
}

const navLinks = computed(() => [
  { to: { name: RouteNames.ADOPT }, label: t('adopt.nav-link') },
  { to: { name: RouteNames.DISCOVER }, label: t('discover.nav-link') },
  { to: { name: RouteNames.BLOG }, label: t('blog.nav-link') },
  { to: { name: RouteNames.ABOUT_US }, label: t('nav.association') },
])

const mobileMenuOpen = ref(false)
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
const logoutFromMobile = () => {
  authStore.logout()
  closeMobileMenu()
}
</script>

<template>
  <div class="sticky top-0 z-30 w-full border-b border-[var(--scf-line)] bg-[var(--scf-bg)]">
    <div class="page-shell flex w-full items-center justify-between py-4">
      <div class="flex items-center gap-3">
        <button class="flex items-center gap-2" @click="router.push({ name: RouteNames.HOME })">
          <img :src="Logo" width="40" :alt="$t('nav.brand')" class="shrink-0" />
          <span class="display-font text-lg font-semibold text-[var(--scf-ink)]">{{
            $t('nav.brand')
          }}</span>
        </button>
        <div class="hidden items-center gap-2 text-xs text-[var(--scf-muted)] xl:flex">
          <i class="pi pi-map-marker text-[var(--scf-accent)]"></i>
          {{ $t('nav.location') }}
        </div>
      </div>

      <!-- DESKTOP NAV -->
      <div class="hidden items-center gap-2 lg:flex lg:flex-wrap lg:justify-end xl:flex-nowrap">
        <Button
          v-for="link in navLinks"
          :key="link.label"
          as="router-link"
          :to="link.to"
          :label="link.label"
          text
          severity="secondary"
        />
        <Button
          as="router-link"
          :to="{ name: RouteNames.DONATE }"
          :label="$t('nav.support')"
          rounded
          class="whitespace-nowrap !bg-[var(--scf-accent)] !border-[var(--scf-accent)] px-1 shadow-[0_10px_24px_rgba(230,120,84,0.22)] hover:!bg-[var(--scf-accent-dark)] hover:!border-[var(--scf-accent-dark)]"
        />
        <Button
          v-if="!authStore.isConnected"
          as="router-link"
          :to="{ name: RouteNames.LOGIN }"
          :label="$t('login')"
          size="small"
          outlined
        />
        <template v-else>
          <button
            type="button"
            class="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--scf-bg-soft)] px-3 py-1.5 text-sm text-[var(--scf-text)]"
            @click="toggleUserMenu"
          >
            <i class="pi pi-user text-xs text-[var(--scf-accent-dark)]"></i>
            <span class="max-w-[8rem] truncate">{{ authStore.getUsername }}</span>
            <i class="pi pi-chevron-down text-xs"></i>
          </button>
          <Menu ref="userMenu" :model="userMenuItems" :popup="true" />
        </template>
      </div>

      <!-- MOBILE BURGER -->
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-[var(--scf-ink)] lg:hidden"
        :aria-label="mobileMenuOpen ? $t('close') : $t('menu')"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
      </button>
    </div>

    <!-- MOBILE PANEL -->
    <Transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="border-t border-[var(--scf-line)] px-6 pb-6 pt-4 lg:hidden">
        <div class="flex flex-col gap-1">
          <router-link
            v-for="link in navLinks"
            :key="link.label"
            :to="link.to"
            class="rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--scf-text)] hover:bg-[var(--scf-bg-soft)]"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </router-link>

          <router-link
            :to="{ name: RouteNames.DONATE }"
            class="mt-2 rounded-full bg-[var(--scf-accent)] px-4 py-2.5 text-center text-sm font-semibold text-white"
            @click="closeMobileMenu"
          >
            {{ $t('nav.support') }}
          </router-link>

          <div class="mt-3 flex flex-col gap-1 border-t border-[var(--scf-line)] pt-3">
            <router-link
              v-if="!authStore.isConnected"
              :to="{ name: RouteNames.LOGIN }"
              class="rounded-xl border border-[var(--scf-line)] px-3 py-2.5 text-center text-sm font-semibold text-[var(--scf-ink)]"
              @click="closeMobileMenu"
            >
              {{ $t('login') }}
            </router-link>
            <template v-else>
              <router-link
                v-if="canAccessAdmin"
                :to="{ name: RouteNames.DASHBOARD }"
                class="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--scf-accent-soft),#fff)] px-4 py-3 text-sm font-semibold text-[var(--scf-accent-dark)] ring-1 ring-[var(--scf-accent)]/20 transition-transform hover:-translate-y-0.5"
                @click="closeMobileMenu"
              >
                <i class="pi pi-briefcase"></i>
                {{ $t('admin.nav.access') }}
              </router-link>
              <router-link
                :to="{ name: RouteNames.USER_ADOPTION_REQUESTS }"
                class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--scf-text)] hover:bg-[var(--scf-bg-soft)]"
                @click="closeMobileMenu"
              >
                <i class="pi pi-heart text-[var(--scf-accent-dark)]"></i>
                {{ $t('adoptionRequest.user.navLink') }}
              </router-link>
              <button
                type="button"
                class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-500 hover:bg-[var(--scf-bg-soft)]"
                @click="logoutFromMobile"
              >
                <i class="pi pi-sign-out"></i>
                {{ $t('logout') }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: max-height 0.25s ease, opacity 0.2s ease;
  max-height: 400px;
  overflow: hidden;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
