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

    <section class="relative overflow-hidden bg-[var(--scf-bg)] px-6 pb-16 pt-8 md:px-[60px] md:pb-20">
      <div class="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[var(--scf-accent-soft)]"></div>
      <div class="pointer-events-none absolute bottom-[-7rem] left-[42%] h-56 w-56 rounded-full bg-[var(--scf-secondary-soft)]"></div>

      <div class="page-shell relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div class="max-w-2xl space-y-5">
          <span class="eyebrow">
            {{ $t('distribution.eyebrow') }}
          </span>

          <h1 class="display-font text-4xl font-semibold leading-tight md:text-6xl">
            {{ $t('distribution.title') }}
          </h1>

          <p class="max-w-xl text-base leading-8 text-[var(--scf-text)] md:text-lg">
            {{ $t('distribution.heroText') }}
          </p>

          <Button
            as="a"
            :href="distributionMailto"
            :label="$t('distribution.contactCta')"
            icon="pi pi-envelope"
            rounded
          />
        </div>

        <aside class="rounded-[28px] bg-[var(--scf-ink)] p-7 text-white shadow-[var(--scf-shadow)] md:p-8">
          <i class="pi pi-heart-fill text-2xl text-[var(--scf-accent-soft)]"></i>

          <p class="display-font mt-5 text-2xl font-semibold !text-white">
            {{ $t('distribution.scheduleText') }}
          </p>

          <p class="mt-2 text-sm leading-6 text-white/75">
            {{ $t('distribution.locationText') }}
          </p>
        </aside>
      </div>
    </section>
  </div>
</template>