<script setup lang="ts">
import { RouteNames } from '@/router/routeNames'
import { useRouter } from 'vue-router'
import { useDarkModeStore } from '@/stores/darkmode'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authentication'
import Logo from '@/assets/Logo.png'

const router = useRouter()
const darkModeStore = useDarkModeStore()
const authStore = useAuthStore()

onMounted(() => {
  darkModeStore.initDarkMode()
})
</script>

<template>
  <div
    class="section-card flex w-full flex-col gap-4 rounded-[2rem] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6"
  >
    <div class="flex items-center gap-3">
      <button
        class="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/85 px-3 py-2 text-left shadow-sm transition-transform hover:-translate-y-0.5"
        @click="router.push({ name: RouteNames.HOME })"
      >
        <img :src="Logo" width="52" :alt="$t('nav.brand')" class="shrink-0" />
        <div>
          <p class="display-font text-lg font-semibold leading-none text-[var(--scf-ink)]">
            {{ $t('nav.brand') }}
          </p>
          <p class="text-xs uppercase tracking-[0.24em] text-[var(--scf-muted)]">{{ $t('nav.brandTagline') }}</p>
        </div>
      </button>
      <div
        class="hidden lg:flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-xs text-[var(--scf-muted)]"
      >
        <i class="pi pi-map-marker text-[var(--scf-accent)]"></i>
        {{ $t('nav.location') }}
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2 md:justify-end">
      <Button
        as="router-link"
        :to="{ name: RouteNames.ADOPT }"
        :label="$t('adopt.nav-link')"
        text
        severity="secondary"
      />

      <Button
        as="router-link"
        :to="{ name: RouteNames.DISCOVER }"
        :label="$t('discover.nav-link')"
        text
        severity="secondary"
      />

      <Button
        as="router-link"
        :to="{ name: RouteNames.BLOG }"
        :label="$t('blog.nav-link')"
        text
        severity="secondary"
      />

      <Button
        v-if="authStore.isConnected"
        as="router-link"
        :to="{ name: RouteNames.USER_ADOPTION_REQUESTS }"
        :label="$t('adoptionRequest.user.navLink')"
        text
        severity="secondary"
      />

      <Button
        as="router-link"
        :to="RouteNames.ABOUT_US"
        :label="$t('nav.association')"
        size="small"
        text
        severity="secondary"
      />
      <Button
        as="router-link"
        :to="RouteNames.DONATE"
        :label="$t('nav.support')"
        size="small"
        text
        severity="secondary"
      />
      <Button
        :icon="darkModeStore.darkmodeIcon"
        outlined
        severity="secondary"
        size="small"
        rounded
        @click="darkModeStore.toggleDarkMode"
      />
      <div v-if="!authStore.isConnected" class="flex flex-wrap gap-2">
        <Button
          as="router-link"
          :to="RouteNames.LOGIN"
          :label="$t('login')"
          size="small"
          outlined
        />
        <Button as="router-link" :to="RouteNames.REGISTER" size="small" :label="$t('register')" />
      </div>
      <div v-else class="flex items-center gap-2 rounded-full bg-white/70 px-3 py-2">
        <span class="text-sm text-[var(--scf-text)]">{{ authStore.getUsername }}</span>
        <Button
          :label="$t('logout')"
          size="small"
          outlined
          severity="danger"
          @click="authStore.logout()"
        />
      </div>
    </div>
  </div>
</template>
