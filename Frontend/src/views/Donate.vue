<script setup lang="ts">
import { useManager } from '@/router/manager'
import { useI18n } from 'vue-i18n'

const title = useManager().getCurrentRouteTitle()
const { t } = useI18n()
const donationUrl = 'https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1'

const usesOfFunds = [
  {
    icon: 'pi pi-heart-fill',
    title: t('donate.usesOfFunds.vet.title'),
    text: t('donate.usesOfFunds.vet.text'),
  },
  {
    icon: 'pi pi-shopping-bag',
    title: t('donate.usesOfFunds.food.title'),
    text: t('donate.usesOfFunds.food.text'),
  },
  {
    icon: 'pi pi-shield',
    title: t('donate.usesOfFunds.sterilization.title'),
    text: t('donate.usesOfFunds.sterilization.text'),
  },
  {
    icon: 'pi pi-moon',
    title: t('donate.usesOfFunds.sanctuary.title'),
    text: t('donate.usesOfFunds.sanctuary.text'),
  },
]
</script>

<template>
  <div class="flex w-full flex-col">
    <!-- HERO -->
    <section
      class="relative w-full overflow-hidden bg-[var(--scf-bg)] px-6 pb-16 pt-16 text-center md:px-[60px]"
    >
      <div
        class="pointer-events-none absolute left-1/2 -top-40 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-[var(--scf-accent-soft)]"
      ></div>
      <div class="page-shell relative mx-auto max-w-2xl space-y-5">
        <span class="eyebrow">{{ $t('donate.eyebrowHero') }}</span>
        <h1 class="display-font text-4xl font-semibold leading-tight md:text-6xl">{{ title }}</h1>
        <p class="mx-auto max-w-xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
          {{ $t('donate.heroText') }}
        </p>
      </div>
    </section>

    <!-- AMOUNTS -->
    <section class="flex w-full justify-center bg-[var(--scf-bg)] px-6 pb-14 md:px-[60px]">
      <div class="w-full max-w-xl space-y-6 rounded-[28px] bg-white p-9 text-center">
        <p class="display-font text-base font-semibold text-[var(--scf-ink)]">
          {{ $t('donate.amounts.title') }}
        </p>
        <Button
          as="a"
          :href="donationUrl"
          target="_blank"
          rel="noopener noreferrer"
          :label="$t('donate.donateOnHelloAsso')"
          icon="pi pi-arrow-right"
          iconPos="right"
          severity="contrast"
          rounded
        />
      </div>
    </section>

    <!-- USES OF FUNDS -->
    <section class="w-full bg-white px-6 py-16 md:px-[60px]">
      <div class="page-shell space-y-8">
        <h2 class="display-font text-center text-3xl font-semibold md:text-4xl">
          {{ $t('donate.usesOfFunds.title') }}
        </h2>
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="use in usesOfFunds"
            :key="use.title"
            class="rounded-[20px] bg-[var(--scf-bg)] p-6 text-center"
          >
            <div
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--scf-accent-soft)] text-lg text-[var(--scf-accent-dark)]"
            >
              <i :class="use.icon"></i>
            </div>
            <h3 class="display-font mt-4 text-base font-semibold">{{ use.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">{{ use.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- OTHER WAYS -->
    <section class="w-full bg-[var(--scf-bg)] px-6 py-16 md:px-[60px]">
      <div class="page-shell space-y-8">
        <h2 class="display-font text-center text-3xl font-semibold md:text-4xl">
          {{ $t('donate.otherWays.title') }}
        </h2>
        <div class="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
          <div class="rounded-[20px] bg-white p-8 text-center">
            <div
              class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--scf-accent)] text-white"
            >
              <i class="pi pi-home"></i>
            </div>
            <h3 class="display-font mt-4 text-lg font-semibold">
              {{ $t('home.waysToHelp.foster.title') }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">
              {{ $t('home.waysToHelp.foster.text') }}
            </p>
          </div>
          <div class="rounded-[20px] bg-white p-8 text-center">
            <div
              class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--scf-accent)] text-white"
            >
              <i class="pi pi-users"></i>
            </div>
            <h3 class="display-font mt-4 text-lg font-semibold">
              {{ $t('home.waysToHelp.volunteer.title') }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">
              {{ $t('home.waysToHelp.volunteer.text') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- MATERIAL DONATIONS -->
    <section
      class="w-full bg-[var(--scf-ink)] px-6 py-16 text-white md:px-[60px] border-b border-[var(--scf-line)]"
    >
      <div class="page-shell max-w-2xl space-y-4">
        <span class="eyebrow !bg-white/10 !text-[var(--scf-accent-soft)]">{{
          $t('donate.eyebrowMaterial')
        }}</span>
        <h2 class="display-font text-3xl font-semibold !text-white">
          {{ $t('donate.materialTitle') }}
        </h2>
        <p class="text-sm leading-7 text-white/80 md:text-base">
          {{ $t('donate.materialText') }}
        </p>
        <p class="text-sm font-medium text-white">
          {{ $t('donate.contact') }}
          <a
            class="underline decoration-white/40 underline-offset-4"
            href="mailto:dons@sanscroquettesfixes.fr"
          >
            dons@sanscroquettesfixes.fr
          </a>
        </p>
      </div>
    </section>
  </div>
</template>
