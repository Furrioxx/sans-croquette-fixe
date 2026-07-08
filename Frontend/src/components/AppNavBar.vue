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
  <div class="flex w-full justify-between items-center p-4">
    <!-- Logo -->
    <img
      :src="Logo"
      width="50"
      alt=""
      class="hover:cursor-pointer"
      @click="router.push({ name: RouteNames.HOME })"
    />

    <div class="flex">
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
    </div>

    <div class="flex gap-3 items-center">
      <Button
        :icon="darkModeStore.darkmodeIcon"
        outlined
        severity="secondary"
        size="small"
        @click="darkModeStore.toggleDarkMode"
      />
      <div v-if="!authStore.isConnected" class="flex flex-wrap gap-x-2">
        <Button
          as="router-link"
          :to="RouteNames.LOGIN"
          :label="$t('login')"
          size="small"
          outlined
        />
        <Button as="router-link" :to="RouteNames.REGISTER" size="small" :label="$t('register')" />
      </div>
      <div v-else class="flex items-center gap-2">
        <span>{{ authStore.getUsername }}</span>
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
