<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useManager } from '@/router/manager'
import { RouteNames } from '@/router/routeNames'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { CatSheetService } from '@/services/catSheetService'
import type { CatSheet } from '@/models/CatSheet'
import CatSheetCard from '@/components/CatSheetCard.vue'

const title = useManager().getCurrentRouteTitle()
const router = useRouter()
const { t } = useI18n()
const donationUrl = 'https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1'

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

const pillars = [
  {
    icon: 'pi pi-heart-fill',
    title: t('about.actions.care.title'),
    text: t('about.actions.care.text'),
  },
  {
    icon: 'pi pi-truck',
    title: t('about.actions.distribution.title'),
    text: t('about.actions.distribution.text'),
  },
  {
    icon: 'pi pi-shield',
    title: t('about.actions.sterilization.title'),
    text: t('about.actions.sterilization.text'),
  },
  {
    icon: 'pi pi-comments',
    title: t('about.actions.support.title'),
    text: t('about.actions.support.text'),
  },
]

const stats = [
  { value: t('home.stats.years.value'), label: t('home.stats.years.label') },
  { value: t('home.stats.animals.value'), label: t('home.stats.animals.label') },
  { value: t('home.stats.food.value'), label: t('home.stats.food.label') },
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

const catSheets = ref<CatSheet[]>([])
const loadingCats = ref(false)

onMounted(async () => {
  loadingCats.value = true
  try {
    const response = await CatSheetService.GetPublicCatSheets({ page: 1, pageSize: 3 })
    catSheets.value = response.data.data
  } catch (e) {
    console.error(e)
  } finally {
    loadingCats.value = false
  }
})
</script>

<template>
  <div class="flex w-full flex-col">
    <!-- HERO -->
    <section
      class="relative w-full overflow-hidden bg-[var(--scf-bg)] px-6 pb-16 pt-14 md:px-[60px] md:pb-24 md:pt-16"
    >
      <div
        class="pointer-events-none absolute -right-24 -top-36 h-[380px] w-[380px] rounded-full bg-[var(--scf-accent-soft)]"
      ></div>
      <div
        class="pointer-events-none absolute -right-4 bottom-[-70px] h-[200px] w-[200px] rounded-full bg-[var(--scf-bg-soft)]"
      ></div>

      <div class="page-shell relative max-w-2xl space-y-6">
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
            :label="$t('home.adoptCat')"
            icon="pi pi-heart-fill"
            rounded
            @click="router.push({ name: RouteNames.ADOPT })"
          />
          <Button
            :label="$t('home.knowAssociation')"
            icon="pi pi-arrow-right"
            severity="secondary"
            outlined
            rounded
            @click="router.push({ name: RouteNames.ABOUT_US })"
          />
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          <article
            v-for="highlight in highlights"
            :key="highlight.value"
            class="rounded-3xl border border-[var(--scf-line)] bg-white p-4"
          >
            <p class="display-font text-2xl font-semibold text-[var(--scf-ink)]">
              {{ highlight.value }}
            </p>
            <p class="mt-1 text-sm leading-6 text-[var(--scf-muted)]">{{ highlight.label }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- DONATION STRIP -->
    <section
      class="flex w-full flex-col items-center gap-4 bg-[var(--scf-accent)] px-6 py-8 text-center text-white md:flex-row md:justify-between md:px-[60px] md:text-left"
    >
      <p class="flex-1 text-sm font-semibold leading-6 md:text-base">
        {{ $t('home.donationStrip.text') }}
      </p>
      <Button
        as="a"
        :href="donationUrl"
        target="_blank"
        rel="noopener noreferrer"
        :label="$t('home.donationStrip.cta')"
        icon="pi pi-gift"
        severity="contrast"
        rounded
      />
    </section>

    <!-- MISSION PILLARS -->
    <section class="w-full bg-white px-6 py-16 md:px-[60px]">
      <div class="page-shell space-y-8">
        <div class="space-y-2">
          <span class="eyebrow">{{ $t('home.eyebrowMission') }}</span>
          <h2 class="display-font text-3xl font-semibold md:text-4xl">
            {{ $t('home.missionTitle') }}
          </h2>
        </div>
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="pillar in pillars"
            :key="pillar.title"
            class="rounded-[20px] bg-[var(--scf-bg)] p-6"
          >
            <div
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--scf-accent-soft)] text-lg text-[var(--scf-accent-dark)]"
            >
              <i :class="pillar.icon"></i>
            </div>
            <h3 class="display-font mt-4 text-lg font-semibold">{{ pillar.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">{{ pillar.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ADOPTABLE CATS -->
    <section class="w-full bg-[var(--scf-bg)] px-6 py-16 md:px-[60px]">
      <div class="page-shell space-y-8">
        <div class="flex items-end justify-between gap-4">
          <div class="space-y-2">
            <span class="eyebrow">{{ $t('home.eyebrowAdopt') }}</span>
            <h2 class="display-font text-3xl font-semibold md:text-4xl">
              {{ $t('home.adoptTitle') }}
            </h2>
          </div>
          <Button
            :label="$t('home.seeAllCats')"
            icon="pi pi-arrow-right"
            iconPos="right"
            severity="secondary"
            outlined
            rounded
            @click="router.push({ name: RouteNames.ADOPT })"
          />
        </div>

        <div v-if="loadingCats" class="grid gap-5 lg:grid-cols-3">
          <div
            v-for="i in 3"
            :key="i"
            class="animate-pulse overflow-hidden rounded-[22px] bg-white"
          >
            <div class="aspect-[4/3] bg-[var(--scf-accent-soft)]"></div>
            <div class="space-y-3 p-5">
              <div class="h-4 w-2/3 rounded bg-[var(--scf-accent-soft)]"></div>
              <div class="h-3 w-full rounded bg-[var(--scf-accent-soft)]"></div>
            </div>
          </div>
        </div>

        <div v-else-if="catSheets.length" class="grid gap-5 lg:grid-cols-3">
          <CatSheetCard
            v-for="catSheet in catSheets"
            :key="catSheet.documentId"
            :catSheet="catSheet"
          />
        </div>

        <div
          v-else
          class="flex flex-col items-center gap-3 rounded-[22px] bg-white px-6 py-14 text-center"
        >
          <i class="pi pi-heart text-4xl text-[var(--scf-muted)]"></i>
          <p class="text-sm text-[var(--scf-muted)]">{{ $t('home.noCatsAvailable') }}</p>
        </div>
      </div>
    </section>

    <!-- SANCTUARY -->
    <section class="w-full bg-[var(--scf-accent-soft)] px-6 py-16 md:px-[60px]">
      <div class="page-shell flex flex-col gap-10 md:flex-row md:items-center">
        <div class="flex-1 space-y-4">
          <span class="eyebrow">{{ $t('home.sanctuary.eyebrow') }}</span>
          <h2 class="display-font text-3xl font-semibold">{{ $t('home.sanctuary.title') }}</h2>
          <p class="max-w-xl text-sm leading-7 text-[var(--scf-text)]">
            {{ $t('home.sanctuary.text') }}
          </p>
          <Button
            as="router-link"
            :to="RouteNames.DONATE"
            :label="$t('home.sanctuary.cta')"
            icon="pi pi-heart-fill"
            rounded
          />
        </div>
        <div
          class="flex aspect-[4/3] w-full shrink-0 items-center justify-center rounded-[24px] bg-white/50 text-[var(--scf-muted)] md:w-80"
        >
          <i class="pi pi-image text-5xl"></i>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section
      class="grid w-full grid-cols-1 gap-8 bg-[var(--scf-ink)] px-6 py-14 text-center text-white sm:grid-cols-3 md:px-[60px]"
    >
      <div v-for="stat in stats" :key="stat.label">
        <p class="display-font text-4xl font-semibold !text-white">{{ stat.value }}</p>
        <p class="mt-1 text-sm font-semibold text-white/80">{{ stat.label }}</p>
      </div>
    </section>

    <!-- STORY -->
    <section class="w-full bg-white px-6 py-16 md:px-[60px]">
      <div class="page-shell flex flex-col gap-10 md:flex-row md:items-center">
        <div
          class="flex aspect-square w-full shrink-0 items-center justify-center rounded-full bg-[var(--scf-bg)] text-[var(--scf-muted)] md:w-64"
        >
          <i class="pi pi-image text-5xl"></i>
        </div>
        <div class="space-y-3">
          <span class="eyebrow">{{ $t('home.story.eyebrow') }}</span>
          <h2 class="display-font text-2xl font-semibold md:text-3xl">
            {{ $t('home.story.title') }}
          </h2>
          <p class="max-w-xl text-sm leading-7 text-[var(--scf-text)]">
            {{ $t('home.story.text') }}
          </p>
          <p class="display-font text-sm font-semibold text-[var(--scf-ink)]">
            {{ $t('home.story.author') }}
          </p>
          <Button
            as="router-link"
            :to="RouteNames.ABOUT_US"
            :label="$t('home.story.cta')"
            icon="pi pi-arrow-right"
            iconPos="right"
            text
            severity="secondary"
          />
        </div>
      </div>
    </section>

    <!-- WAYS TO HELP -->
    <section class="w-full bg-[var(--scf-bg)] px-6 py-16 md:px-[60px]">
      <div class="page-shell space-y-8">
        <h2 class="display-font text-3xl font-semibold md:text-4xl">
          {{ $t('home.waysToHelp.title') }}
        </h2>
        <div class="grid gap-5 md:grid-cols-3">
          <a
            :href="donationUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="block rounded-[18px] bg-white p-7 text-center transition-transform hover:-translate-y-1"
          >
            <div
              class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--scf-accent)] text-white"
            >
              <i class="pi pi-heart-fill"></i>
            </div>
            <h3 class="display-font mt-4 text-base font-semibold">
              {{ $t('home.waysToHelp.donate.title') }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">
              {{ $t('home.waysToHelp.donate.text') }}
            </p>
          </a>
          <div class="rounded-[18px] bg-white p-7 text-center">
            <div
              class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--scf-accent)] text-white"
            >
              <i class="pi pi-home"></i>
            </div>
            <h3 class="display-font mt-4 text-base font-semibold">
              {{ $t('home.waysToHelp.foster.title') }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">
              {{ $t('home.waysToHelp.foster.text') }}
            </p>
          </div>
          <div class="rounded-[18px] bg-white p-7 text-center">
            <div
              class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--scf-accent)] text-white"
            >
              <i class="pi pi-users"></i>
            </div>
            <h3 class="display-font mt-4 text-base font-semibold">
              {{ $t('home.waysToHelp.volunteer.title') }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">
              {{ $t('home.waysToHelp.volunteer.text') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- STEPS -->
    <section class="w-full bg-white px-6 py-16 md:px-[60px]">
      <div class="page-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <article class="space-y-3">
          <span class="eyebrow">{{ $t('home.steps.eyebrow') }}</span>
          <h2 class="display-font title-wide text-3xl font-semibold md:text-4xl">
            {{ $t('home.steps.title') }}
          </h2>
          <p class="max-w-xl text-sm leading-7 text-[var(--scf-text)] md:text-base">
            {{ $t('home.steps.text') }}
          </p>
        </article>

        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="(step, index) in steps"
            :key="step.title"
            class="rounded-[20px] bg-[var(--scf-bg)] p-5"
          >
            <div
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--scf-accent-soft)] text-lg font-semibold text-[var(--scf-accent-dark)]"
            >
              0{{ index + 1 }}
            </div>
            <h3 class="display-font title-compact mt-4 text-[1.8rem] font-semibold">
              {{ step.title }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">{{ step.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="w-full bg-[var(--scf-ink)] px-6 py-14 text-white md:px-[60px]">
      <div class="page-shell flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
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
          rounded
        />
      </div>
    </section>
  </div>
</template>
