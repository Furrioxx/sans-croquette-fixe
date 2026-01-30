<script setup lang="ts">
import { RouteNames } from '@/router/routeNames'
import { useRouter } from 'vue-router'
import { useDarkModeStore } from '@/stores/darkmode'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authentication'

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
      src=""
      width="70"
      alt=""
      class="hover:cursor-pointer"
      @click="router.push({ name: RouteNames.HOME })"
    />

    <div class="flex"></div>

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
    </div>
  </div>
</template>