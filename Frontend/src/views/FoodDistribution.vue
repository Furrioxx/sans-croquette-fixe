<script setup lang="ts">
import { DONATION_URL } from '@/config/donation'
import { RouteNames } from '@/router/routeNames'

const distributionEmail = 'distribution@sanscroquettesfixes.fr'
const distributionMailto = `mailto:${distributionEmail}`
const practicalItems = [
  {
    icon: 'pi pi-clock',
    title: 'distribution.scheduleTitle',
    text: 'distribution.scheduleText',
  },
  {
    icon: 'pi pi-map-marker',
    title: 'distribution.locationTitle',
    text: 'distribution.locationText',
  },
  {
    icon: 'pi pi-envelope',
    title: 'distribution.firstVisitTitle',
    text: 'distribution.firstVisitText',
  },
]
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

    <section class="w-full bg-white px-6 py-16 md:px-[60px]">
  <div class="page-shell space-y-8">
    <div class="space-y-2">
      <span class="eyebrow">
        {{ $t('distribution.practicalEyebrow') }}
      </span>

      <h2 class="display-font text-3xl font-semibold md:text-4xl">
        {{ $t('distribution.practicalTitle') }}
      </h2>
    </div>

    <div class="grid gap-5 md:grid-cols-3">
      <article
        v-for="item in practicalItems"
        :key="item.title"
        class="rounded-[22px] bg-[var(--scf-bg)] p-7"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--scf-accent-soft)] text-lg text-[var(--scf-accent-dark)]"
        >
          <i :class="item.icon"></i>
        </div>

        <h3 class="display-font mt-5 text-lg font-semibold">
          {{ $t(item.title) }}
        </h3>

        <p class="mt-2 text-sm leading-7 text-[var(--scf-text)]">
          {{ $t(item.text) }}
        </p>
      </article>
    </div>
  </div>
</section>
  </div>
</template>