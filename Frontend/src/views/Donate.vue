<script setup lang="ts">
import { useManager } from '@/router/manager'
import { useI18n } from 'vue-i18n'

const title = useManager().getCurrentRouteTitle()
const { t } = useI18n()

const donations = [
  {
    amount: t('donate.tiers.small.amount'),
    title: t('donate.tiers.small.title'),
    text: t('donate.tiers.small.text'),
  },
  {
    amount: t('donate.tiers.medium.amount'),
    title: t('donate.tiers.medium.title'),
    text: t('donate.tiers.medium.text'),
  },
  {
    amount: t('donate.tiers.large.amount'),
    title: t('donate.tiers.large.title'),
    text: t('donate.tiers.large.text'),
  },
]
</script>

<template>
  <div class="page-shell space-y-8 pb-16">
    <section
      class="hero-panel hero-donate-gradient section-card rounded-[2.5rem] px-6 py-8 md:px-10 md:py-12"
    >
      <div class="max-w-2xl space-y-5">
        <span class="eyebrow">{{ $t('donate.eyebrowHero') }}</span>
        <h1 class="display-font text-4xl font-semibold leading-tight md:text-6xl">{{ title }}</h1>
        <p class="max-w-2xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
          {{ $t('donate.heroText') }}
        </p>
        <a
          href="https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-2xl bg-[var(--scf-ink)] px-5 py-3 font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <i class="pi pi-heart-fill"></i>
          {{ $t('donate.donateOnHelloAsso') }}
        </a>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <article
        v-for="donation in donations"
        :key="donation.amount"
        class="section-card rounded-[2rem] p-5"
      >
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--scf-accent-dark)]">
          {{ donation.amount }}
        </p>
        <h2 class="display-font mt-2 text-2xl font-semibold">{{ donation.title }}</h2>
        <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">{{ donation.text }}</p>
      </article>
    </section>

    <section class="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <article class="section-card rounded-[2rem] p-6 md:p-8">
        <span class="eyebrow">{{ $t('donate.eyebrowHelp') }}</span>
        <div class="mt-4 grid gap-4 md:grid-cols-3">
          <article class="rounded-[1.5rem] border border-[var(--scf-line)] bg-white/80 p-4">
            <h3 class="display-font text-xl font-semibold">{{ $t('donate.help.vet.title') }}</h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">
              {{ $t('donate.help.vet.text') }}
            </p>
          </article>
          <article class="rounded-[1.5rem] border border-[var(--scf-line)] bg-white/80 p-4">
            <h3 class="display-font text-xl font-semibold">{{ $t('donate.help.supplies.title') }}</h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">
              {{ $t('donate.help.supplies.text') }}
            </p>
          </article>
          <article class="rounded-[1.5rem] border border-[var(--scf-line)] bg-white/80 p-4">
            <h3 class="display-font text-xl font-semibold">{{ $t('donate.help.emergency.title') }}</h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">
              {{ $t('donate.help.emergency.text') }}
            </p>
          </article>
        </div>
      </article>

      <article
        class="section-card rounded-[2rem] bg-[linear-gradient(135deg,rgba(201,109,68,0.95),rgba(147,80,54,0.95))] p-6 text-white md:p-8"
      >
        <span class="eyebrow !bg-white/12 !text-[var(--scf-accent-soft)]">{{ $t('donate.eyebrowMaterial') }}</span>
        <h2 class="display-font mt-4 text-3xl font-semibold !text-white">{{ $t('donate.materialTitle') }}</h2>
        <p class="mt-3 text-sm leading-7 text-white/85 md:text-base">
          {{ $t('donate.materialText') }}
        </p>
        <p class="mt-4 text-sm font-medium text-white">
          {{ $t('donate.contact') }}
          <a class="underline decoration-white/40 underline-offset-4" href="mailto:dons@sanscroquettesfixes.fr">
            dons@sanscroquettesfixes.fr
          </a>
        </p>
      </article>
    </section>
  </div>
</template>
