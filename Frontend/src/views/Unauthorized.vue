<script setup lang="ts">
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router/routeNames'

const router = useRouter()
</script>

<template>
  <div
    class="flex min-h-[60vh] w-full flex-col items-center justify-center gap-5 bg-[var(--scf-bg)] px-4 text-center"
  >
    <div class="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--scf-accent-soft)]">
      <i class="pi pi-lock text-3xl text-[var(--scf-accent-dark)]" aria-hidden="true"></i>
    </div>
    <h1
      data-cy="unauthorized-title"
      class="display-font text-2xl font-bold text-[var(--scf-ink)]"
    >
      {{ $t('errorPages.unauthorized.title') }}
    </h1>
    <p class="text-[var(--scf-muted)]">{{ $t('errorPages.unauthorized.subtitle') }}</p>
    <Button
      :label="$t('errorPages.backHome')"
      icon="pi pi-arrow-left"
      severity="secondary"
      outlined
      rounded
      @click="router.push({ name: RouteNames.HOME })"
    />
  </div>
</template>
