<script setup lang="ts">
import { DONATION_URL } from '@/config/donation'
import { RouteNames } from '@/router/routeNames'

const distributionEmail = 'distribution@sanscroquettesfixes.fr'
const distributionMailto = `mailto:${distributionEmail}`
</script>

<template>
  <div class="flex w-full flex-col">
    <div class="w-full bg-[var(--scf-bg)] px-6 pt-6 md:px-[60px]">
      <nav class="page-shell flex items-center gap-1.5 text-xs font-semibold text-[var(--scf-muted)]">
        <router-link
          :to="{ name: RouteNames.HOME }"
          class="hover:text-[var(--scf-ink)]"
        >
          {{ $t('footer.links.home') }}
        </router-link>

        <span>/</span>

        <span class="text-[var(--scf-ink)]">
          {{ $t('distribution.breadcrumb') }}
        </span>
      </nav>
    </div>
  </div>
</template>