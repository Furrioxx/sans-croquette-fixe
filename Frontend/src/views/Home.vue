<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useManager } from '@/router/manager'
import { RouteNames } from '@/router/routeNames'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { CatSheetService } from '@/services/catSheetService'
import type { CatSheet } from '@/models/CatSheet'
import CatSheetCard from '@/components/CatSheetCard.vue'
import { DONATION_URL } from '@/config/donation'
import FelinOmbre from '@/assets/home/les-felins-de-lombre-scaled.jpg'
import FelinAbandon from '@/assets/home/image-abandon.jpg'

const title = useManager().getCurrentRouteTitle()
const router = useRouter()
const { t } = useI18n()
const donationUrl = DONATION_URL

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

const guideBenefits = [
  {
    value: '01',
    title: t('home.questionnaireCta.benefits.household.title'),
    text: t('home.questionnaireCta.benefits.household.text'),
  },
  {
    value: '02',
    title: t('home.questionnaireCta.benefits.preferences.title'),
    text: t('home.questionnaireCta.benefits.preferences.text'),
  },
  {
    value: '03',
    title: t('home.questionnaireCta.benefits.selection.title'),
    text: t('home.questionnaireCta.benefits.selection.text'),
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
      class="relative w-full overflow-hidden bg-[var(--scf-bg)] px-4 pb-16 pt-14 sm:px-6 md:px-[60px] md:pb-24 md:pt-16"
    >
      <div
        class="pointer-events-none absolute -right-24 -top-36 h-[380px] w-[380px] rounded-full bg-[var(--scf-accent-soft)]"
      ></div>
      <div
        class="pointer-events-none absolute -right-4 bottom-[-70px] h-[200px] w-[200px] rounded-full bg-[var(--scf-bg-soft)]"
      ></div>

      <div class="page-shell relative max-w-2xl space-y-6">
        <div class="space-y-4">
          <h1 class="display-font text-4xl font-semibold leading-tight md:text-6xl">
            {{ title }}
          </h1>
          <p class="max-w-2xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
            {{ $t('home.heroText') }}
          </p>
        </div>

        <div class="responsive-actions">
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
      class="flex w-full flex-col items-center gap-4 bg-[var(--scf-accent)] px-4 py-8 text-center text-white sm:px-6 md:flex-row md:justify-between md:px-[60px] md:text-left"
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
    <section class="w-full bg-white px-4 py-16 sm:px-6 md:px-[60px]">
      <div class="page-shell space-y-8">
        <div class="space-y-2">
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
    <section class="w-full bg-[var(--scf-bg)] px-4 py-16 sm:px-6 md:px-[60px]">
      <div class="page-shell space-y-8">
        <div class="responsive-split-header">
          <div class="space-y-2">
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

    <!-- QUESTIONNAIRE CTA -->
    <section class="w-full bg-white px-4 py-14 sm:px-6 md:px-[60px] md:py-16">
      <div
        class="page-shell grid gap-6 overflow-hidden rounded-[28px] bg-[var(--scf-bg)] p-5 sm:p-6 md:gap-8 md:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:rounded-[32px] lg:p-10"
      >
        <div class="space-y-5">
          <div class="space-y-4">
            <h2 class="display-font text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
              {{ $t('home.questionnaireCta.title') }}
            </h2>
            <p class="max-w-2xl text-sm leading-7 text-[var(--scf-text)] md:text-base">
              {{ $t('home.questionnaireCta.text') }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in $tm('home.questionnaireCta.tags')"
              :key="String(tag)"
              class="rounded-full border border-[var(--scf-line)] bg-white px-3 py-1.5 text-sm font-semibold text-[var(--scf-text)]"
            >
              {{ tag }}
            </span>
          </div>

          <div class="responsive-actions">
            <Button
              :label="$t('home.questionnaireCta.primaryCta')"
              icon="pi pi-compass"
              rounded
              @click="router.push({ name: RouteNames.ADOPT_GUIDE })"
            />
            <Button
              :label="$t('home.questionnaireCta.secondaryCta')"
              icon="pi pi-list"
              severity="secondary"
              outlined
              rounded
              @click="router.push({ name: RouteNames.ADOPT })"
            />
          </div>
        </div>

        <div class="grid gap-4">
          <article
            v-for="benefit in guideBenefits"
            :key="benefit.value"
            class="rounded-[22px] border border-[var(--scf-line)] bg-white p-4 sm:p-5"
          >
            <div class="flex items-start gap-4">
              <span
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--scf-accent-soft)] text-sm font-semibold text-[var(--scf-accent-dark)]"
              >
                {{ benefit.value }}
              </span>
              <div class="min-w-0 space-y-2">
                <h3 class="display-font text-lg font-semibold text-[var(--scf-ink)]">
                  {{ benefit.title }}
                </h3>
                <p class="text-sm leading-6 text-[var(--scf-text)]">
                  {{ benefit.text }}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- SANCTUARY -->
    <section class="w-full bg-[var(--scf-accent-soft)] px-4 py-16 sm:px-6 md:px-[60px]">
      <div class="page-shell flex flex-col gap-10 md:flex-row md:items-center">
        <div class="flex-1 space-y-4">
          <h2 class="display-font text-3xl font-semibold">{{ $t('home.sanctuary.title') }}</h2>
          <p class="max-w-xl text-sm leading-7 text-[var(--scf-text)]">
            {{ $t('home.sanctuary.text') }}
          </p>
          <Button
            as="router-link"
            :to="{ name: RouteNames.DONATE }"
            :label="$t('home.sanctuary.cta')"
            icon="pi pi-heart-fill"
            rounded
          />
        </div>
        <div
          class="aspect-[4/3] w-full shrink-0 rounded-[24px] bg-cover bg-center md:w-80"
          :style="{ backgroundImage: `url(${FelinOmbre})` }"
        ></div>
      </div>
    </section>

    <!-- STATS -->
    <section
      class="grid w-full grid-cols-1 gap-8 bg-[var(--scf-ink)] px-4 py-14 text-center text-white sm:grid-cols-3 sm:px-6 md:px-[60px]"
    >
      <div v-for="stat in stats" :key="stat.label">
        <p class="display-font text-4xl font-semibold !text-white">{{ stat.value }}</p>
        <p class="mt-1 text-sm font-semibold text-white/80">{{ stat.label }}</p>
      </div>
    </section>

    <!-- STORY -->
    <section class="w-full bg-white px-4 py-16 sm:px-6 md:px-[60px]">
      <div class="page-shell flex flex-col gap-10 md:flex-row md:items-center">
        <div
          class="flex aspect-square w-full shrink-0 bg-cover bg-center rounded-full md:w-64"
          :style="{ backgroundImage: `url(${FelinAbandon})` }"
        ></div>
        <div class="space-y-3">
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
            :to="{ name: RouteNames.ABOUT_US }"
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
    <section class="w-full bg-[var(--scf-bg)] px-4 py-16 sm:px-6 md:px-[60px]">
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
  </div>
</template>
