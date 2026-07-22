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
    <div class="w-full bg-[var(--scf-bg)] px-4 pt-6 sm:px-6 md:px-[60px]">
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

    <section class="relative overflow-hidden bg-[var(--scf-bg)] px-4 pb-16 pt-8 sm:px-6 md:px-[60px] md:pb-20">
      <div class="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-[var(--scf-accent-soft)] sm:h-80 sm:w-80"></div>
      <div class="pointer-events-none absolute bottom-[-7rem] left-[42%] hidden h-56 w-56 rounded-full bg-[var(--scf-secondary-soft)] lg:block"></div>

      <div class="page-shell relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div class="max-w-2xl space-y-5">
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

    <section class="w-full bg-white px-4 py-16 sm:px-6 md:px-[60px]">
  <div class="page-shell space-y-8">
    <div class="space-y-2">
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

<section class="w-full bg-[var(--scf-accent-soft)] px-4 py-16 sm:px-6 md:px-[60px]">
  <div class="page-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
    <article
      class="mx-auto w-full max-w-xl overflow-hidden rounded-[30px] bg-white shadow-[var(--scf-shadow)] lg:mx-0"
    >
      <div class="relative overflow-hidden bg-[var(--scf-accent)] px-6 py-8 text-white sm:px-8 sm:py-10">
        <div
          class="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/12"
        ></div>
        <div
          class="pointer-events-none absolute bottom-[-2.5rem] right-10 h-20 w-20 rounded-full bg-white/10"
        ></div>

        <div class="relative flex items-start justify-between gap-4">
          <div class="space-y-3">
            <span
              class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/16 backdrop-blur-sm"
            >
              <i class="pi pi-shopping-bag text-2xl"></i>
            </span>
            <p class="display-font max-w-sm text-2xl font-semibold leading-tight !text-white sm:text-3xl">
              Une présence de terrain fidèle, chaque semaine à Lyon.
            </p>
          </div>
        </div>
      </div>

      <div class="grid gap-3 p-5 sm:p-6">
        <div class="rounded-[22px] bg-[var(--scf-bg)] p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--scf-accent-dark)]">
            Rythme
          </p>
          <p class="mt-2 display-font text-lg font-semibold text-[var(--scf-ink)]">
            {{ $t('distribution.scheduleText') }}
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-[22px] bg-[var(--scf-bg)] p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--scf-accent-dark)]">
              Lieu
            </p>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">
              {{ $t('distribution.locationText') }}
            </p>
          </div>

          <div class="rounded-[22px] bg-[var(--scf-bg)] p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--scf-accent-dark)]">
              Contact
            </p>
            <a
              :href="distributionMailto"
              class="mt-2 inline-flex text-sm font-semibold text-[var(--scf-accent-dark)] underline decoration-[var(--scf-accent)] underline-offset-4"
            >
              {{ distributionEmail }}
            </a>
          </div>
        </div>
      </div>
    </article>

    <div class="space-y-4">
      <h2 class="display-font text-3xl font-semibold md:text-4xl">
        {{ $t('distribution.storyTitle') }}
      </h2>

      <p class="max-w-2xl text-sm leading-7 text-[var(--scf-text)] md:text-base">
        {{ $t('distribution.storyText1') }}
      </p>

      <p class="max-w-2xl text-sm leading-7 text-[var(--scf-text)] md:text-base">
        {{ $t('distribution.storyText2') }}
      </p>
    </div>
  </div>
</section>

<section class="w-full bg-white px-4 py-16 sm:px-6 md:px-[60px]">
  <div class="page-shell grid gap-5 lg:grid-cols-2">
    <article class="rounded-[24px] bg-[var(--scf-bg)] p-8 md:p-10">
      <h2 class="display-font text-3xl font-semibold">
        {{ $t('distribution.audienceTitle') }}
      </h2>

      <p class="mt-4 text-sm leading-7 text-[var(--scf-text)] md:text-base">
        {{ $t('distribution.audienceText') }}
      </p>
    </article>

    <article class="rounded-[24px] bg-[var(--scf-ink)] p-8 text-white md:p-10">
      <i class="pi pi-comments text-2xl text-[var(--scf-accent-soft)]"></i>

      <h2 class="display-font mt-5 text-3xl font-semibold !text-white">
        {{ $t('distribution.howTitle') }}
      </h2>

      <p class="mt-4 text-sm leading-7 text-white/80 md:text-base">
        {{ $t('distribution.howText') }}
      </p>

      <a
        :href="distributionMailto"
        class="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white underline decoration-[var(--scf-accent-soft)] underline-offset-4"
      >
        <i class="pi pi-envelope"></i>
        {{ distributionEmail }}
      </a>
    </article>
  </div>
</section>

<section class="flex w-full flex-col items-center gap-4 bg-[var(--scf-accent)] px-4 py-8 text-center text-white sm:px-6 md:flex-row md:justify-between md:px-[60px] md:text-left">
  <p class="flex-1 text-sm font-semibold leading-6 md:text-base">
    {{ $t('distribution.supportText') }}
  </p>

  <Button
    as="a"
    :href="DONATION_URL"
    target="_blank"
    rel="noopener noreferrer"
    :label="$t('distribution.supportCta')"
    icon="pi pi-heart-fill"
    severity="contrast"
    rounded
  />
</section>
  </div>
</template>
