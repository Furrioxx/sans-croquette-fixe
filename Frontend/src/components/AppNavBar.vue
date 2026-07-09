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
  <div class="sticky top-0 z-10 w-full border-b border-[var(--scf-line)] bg-[var(--scf-bg)]">
    <div
      class="page-shell flex w-full flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex items-center gap-3">
        <button class="flex items-center gap-2" @click="router.push({ name: RouteNames.HOME })">
          <img :src="Logo" width="40" :alt="$t('nav.brand')" class="shrink-0" />
          <span class="display-font text-lg font-semibold text-[var(--scf-ink)]">{{
            $t('nav.brand')
          }}</span>
        </button>
        <div class="hidden items-center gap-2 text-xs text-[var(--scf-muted)] lg:flex">
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
          rounded
          class="!bg-[var(--scf-accent)] !border-[var(--scf-accent)] hover:!bg-[var(--scf-accent-dark)] hover:!border-[var(--scf-accent-dark)]"
        />
        <Button
          v-if="!authStore.isConnected"
          as="router-link"
          :to="RouteNames.LOGIN"
          :label="$t('login')"
          size="small"
          outlined
        />
        <div v-else class="flex items-center gap-2 rounded-full bg-[var(--scf-bg-soft)] px-3 py-2">
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
  </div>
</template>
