<script setup lang="ts">
import { getFeaturedCats } from '@/content/catGallery'
import { useManager } from '@/router/manager'
import { RouteNames } from '@/router/routeNames'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const title = useManager().getCurrentRouteTitle()
const router = useRouter()
const { t } = useI18n()
const donationUrl = 'https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1'
const featuredCats = getFeaturedCats()

const highlights = [
  {
    value: t('home.highlights.delay.value'),
    label: t('home.highlights.delay.label'),
  },
  {
    value: t('home.highlights.local.value'),
    label: t('home.highlights.local.label'),
  },
  {
    value: t('home.highlights.human.value'),
    label: t('home.highlights.human.label'),
  },
]

const steps = [
  {
    title: t('home.steps.observe.title'),
    text: t('home.steps.observe.text'),
  },
  {
    title: t('home.steps.file.title'),
    text: t('home.steps.file.text'),
  },
  {
    title: t('home.steps.exchange.title'),
    text: t('home.steps.exchange.text'),
  },
]
</script>

<template>
  <div class="page-shell space-y-8 pb-16">
    <section
      class="hero-panel hero-home-gradient section-card overflow-hidden rounded-[2.5rem] px-6 py-8 md:px-10 md:py-12"
    >
      <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div class="max-w-3xl space-y-6">
          <span class="eyebrow">{{ $t('home.eyebrowHero') }}</span>
          <div class="space-y-4">
            <h1 class="display-font text-4xl font-semibold leading-tight md:text-6xl">
              {{ title }}
            </h1>
            <p class="max-w-2xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
              {{ $t('home.heroText') }}
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <Button
              :label="$t('home.seeProfiles')"
              icon="pi pi-heart-fill"
              @click="router.push({ name: RouteNames.REGISTER })"
            />
            <Button
              :label="$t('home.knowAssociation')"
              icon="pi pi-arrow-right"
              severity="secondary"
              outlined
              @click="router.push({ name: RouteNames.ABOUT_US })"
            />
          </div>

          <div class="grid gap-3 md:grid-cols-3">
            <article
              v-for="highlight in highlights"
              :key="highlight.value"
              class="stagger-rise rounded-3xl border border-white/80 bg-white/75 p-4 shadow-sm"
            >
              <p class="display-font text-2xl font-semibold text-[var(--scf-ink)]">{{ highlight.value }}</p>
              <p class="mt-1 text-sm leading-6 text-[var(--scf-muted)]">{{ highlight.label }}</p>
            </article>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          <article
            class="floating-card section-card relative overflow-hidden rounded-[2rem] bg-[var(--scf-surface-strong)] p-4"
          >
            <div class="grid gap-4 sm:grid-cols-[0.95fr_1.05fr] sm:items-center">
              <div class="overflow-hidden rounded-[1.6rem]">
                <img :src="featuredCats[0].imageUrl" :alt="featuredCats[0].name" class="cat-photo aspect-[4/5]" />
              </div>
              <div class="space-y-3">
                <span class="eyebrow">{{ $t('home.seekingHome') }}</span>
                <div>
                  <h2 class="display-font text-3xl font-semibold">{{ featuredCats[0].name }}</h2>
                  <p class="text-sm uppercase tracking-[0.2em] text-[var(--scf-muted)]">
                    {{ featuredCats[0].role }} . {{ featuredCats[0].age }}
                  </p>
                </div>
                <p class="text-sm leading-6 text-[var(--scf-text)]">{{ featuredCats[0].story }}</p>
              </div>
            </div>
          </article>

          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <article
              v-for="cat in featuredCats.slice(1)"
              :key="cat.name"
              class="stagger-rise overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/80 p-3 shadow-sm"
            >
              <div class="overflow-hidden rounded-[1.35rem]">
                <img :src="cat.imageUrl" :alt="cat.name" class="cat-photo aspect-[4/5]" />
              </div>
              <div class="space-y-1 px-1 pb-1 pt-3">
                <p class="display-font text-2xl font-semibold">{{ cat.name }}</p>
                <p class="text-xs uppercase tracking-[0.18em] text-[var(--scf-muted)]">{{ cat.mood }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-end justify-between gap-4">
        <div class="space-y-2">
          <span class="eyebrow">{{ $t('home.eyebrowFeatured') }}</span>
          <h2 class="display-font text-3xl font-semibold md:text-4xl">
            {{ $t('home.featuredTitle') }}
          </h2>
        </div>
        <Button
          :label="$t('home.createAccount')"
          icon="pi pi-user-plus"
          severity="secondary"
          outlined
          @click="router.push({ name: RouteNames.REGISTER })"
        />
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <article
          v-for="cat in featuredCats"
          :key="cat.name"
          class="section-card overflow-hidden rounded-[2rem]"
        >
          <div class="bg-gradient-to-br p-4" :class="cat.accentClass">
            <div class="overflow-hidden rounded-[1.5rem] bg-white/70">
              <img :src="cat.imageUrl" :alt="cat.name" class="cat-photo aspect-[4/5]" />
            </div>
          </div>
          <div class="space-y-4 px-5 pb-5 pt-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="display-font text-2xl font-semibold">{{ cat.name }}</h3>
                <p class="text-xs uppercase tracking-[0.18em] text-[var(--scf-muted)]">
                  {{ cat.role }} . {{ cat.age }} . {{ $t('home.adoptionCatLyon') }}
                </p>
              </div>
              <span class="rounded-full bg-[var(--scf-bg-soft)] px-3 py-1 text-xs font-semibold text-[var(--scf-accent-dark)]">
                {{ cat.mood }}
              </span>
            </div>
            <p class="text-sm leading-6 text-[var(--scf-text)]">{{ cat.story }}</p>
            <a
              :href="cat.creditUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-xs text-[var(--scf-muted)] underline-offset-4 hover:underline"
            >
              <i class="pi pi-external-link text-[0.7rem]"></i>
              {{ cat.creditLabel }} ({{ cat.licenseLabel }})
            </a>
          </div>
        </article>
      </div>
    </section>

    <section class="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <article class="section-card rounded-[2rem] p-6 md:p-8">
        <span class="eyebrow">{{ $t('home.steps.eyebrow') }}</span>
        <h2 class="display-font title-wide mt-4 text-3xl font-semibold md:text-4xl">
          {{ $t('home.steps.title') }}
        </h2>
        <p class="mt-3 max-w-xl text-sm leading-7 text-[var(--scf-text)] md:text-base">
          {{ $t('home.steps.text') }}
        </p>
      </article>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="(step, index) in steps"
          :key="step.title"
          class="section-card rounded-[2rem] p-5"
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--scf-bg-soft)] text-lg font-semibold text-[var(--scf-accent-dark)]">
            0{{ index + 1 }}
          </div>
          <h3 class="display-font title-compact mt-4 text-[1.8rem] font-semibold">{{ step.title }}</h3>
          <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">{{ step.text }}</p>
        </article>
      </div>
    </section>

    <section class="dark-cta-panel rounded-[2.25rem] px-6 py-8 text-white md:px-8">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div class="max-w-2xl space-y-3">
          <span class="eyebrow !bg-white/10 !text-orange-100">{{ $t('home.cta.eyebrow') }}</span>
          <h2 class="display-font text-3xl font-semibold !text-white md:text-4xl">
            {{ $t('home.cta.title') }}
          </h2>
          <p class="text-sm leading-7 text-orange-50/85 md:text-base">
            {{ $t('home.cta.text') }}
          </p>
        </div>
        <Button
          as="a"
          :href="donationUrl"
          target="_blank"
          rel="noopener noreferrer"
          :label="$t('home.cta.donate')"
          icon="pi pi-gift"
          severity="contrast"
        />
      </div>
    </section>
  </div>
</template>
