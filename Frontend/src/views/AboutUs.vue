<script setup lang="ts">
import { useManager } from '@/router/manager'
import { RouteNames } from '@/router/routeNames'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AnaisPhoto from '@/assets/about/anais-hillion-1.png'
import IconPriseEnCharge from '@/assets/about/icone.png'
import IconDistribution from '@/assets/about/icone-1.png'
import IconSterilisation from '@/assets/about/icone-3.png'
import IconAccompagnement from '@/assets/about/icone-4.png'
import MamboImage from '@/assets/about/site-cats/mambo.jpg'
import KikiImage from '@/assets/about/site-cats/kiki.jpeg'
import PuppyImage from '@/assets/about/site-cats/puppy.jpg'
import PepinetteImage from '@/assets/about/site-cats/pepinette.jpg'

const title = useManager().getCurrentRouteTitle()
const router = useRouter()
const { t } = useI18n()
const donationUrl = 'https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1'

const actions = [
  {
    icon: IconPriseEnCharge,
    title: t('about.actions.care.title'),
    text: t('about.actions.care.text'),
  },
  {
    icon: IconDistribution,
    title: t('about.actions.distribution.title'),
    text: t('about.actions.distribution.text'),
  },
  {
    icon: IconSterilisation,
    title: t('about.actions.sterilization.title'),
    text: t('about.actions.sterilization.text'),
  },
  {
    icon: IconAccompagnement,
    title: t('about.actions.support.title'),
    text: t('about.actions.support.text'),
  },
]

const commitments = [
  t('about.commitments.local'),
  t('about.commitments.metropolis'),
  t('about.commitments.concrete'),
]

const timeline = [
  {
    year: t('about.timeline.creation.year'),
    title: t('about.timeline.creation.title'),
    text: t('about.timeline.creation.text'),
  },
  {
    year: t('about.timeline.friday.year'),
    title: t('about.timeline.friday.title'),
    text: t('about.timeline.friday.text'),
  },
  {
    year: t('about.timeline.daily.year'),
    title: t('about.timeline.daily.title'),
    text: t('about.timeline.daily.text'),
  },
]

const cats = [
  {
    name: 'Mambo',
    image: MamboImage,
    sourceUrl:
      'https://sanscroquettesfixes.fr/wp-content/uploads/elementor/thumbs/IMG_2834-scaled-qm4k5lzx05i8qkrc35kcrkcnvu3gfah96e8uyh5si0.jpg',
    text: t('about.cats.mambo'),
  },
  {
    name: 'Kiki',
    image: KikiImage,
    sourceUrl:
      'https://sanscroquettesfixes.fr/wp-content/uploads/elementor/thumbs/17cc1429-16f4-40e6-9284-ee0dcbd53cff-r9ae2xxuz9hxzh4dcjlreza2ioszu2jeg6mmvvk03s.jpeg',
    text: t('about.cats.kiki'),
  },
  {
    name: 'Puppy',
    image: PuppyImage,
    sourceUrl:
      'https://sanscroquettesfixes.fr/wp-content/uploads/elementor/thumbs/520243598_1324533869026764_8395821459482323091_n-scaled-r9a97atjwr22im91z4efzswafoiui691yu3bjhzcso.jpg',
    text: t('about.cats.puppy'),
  },
  {
    name: 'Pépinette',
    image: PepinetteImage,
    sourceUrl:
      'https://sanscroquettesfixes.fr/wp-content/uploads/elementor/thumbs/DJI_20250508202836_0291_D-scaled-r9aeatt4b8ajdpo1ayb3bzn9x1xuenuc77n9tfv3wo.jpg',
    text: t('about.cats.pepinette'),
  },
]
</script>

<template>
  <div class="page-shell space-y-8 pb-16">
    <section
      class="hero-panel hero-about-gradient section-card rounded-[2.5rem] px-6 py-8 md:px-10 md:py-12"
    >
      <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div class="space-y-6">
          <span class="eyebrow">{{ $t('about.eyebrowHero') }}</span>
          <div class="space-y-4">
            <h1 class="display-font title-wide text-4xl font-semibold md:text-6xl">{{ title }}</h1>
            <p class="max-w-2xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
              {{ $t('about.heroText1') }}
            </p>
            <p class="max-w-2xl text-sm leading-7 text-[var(--scf-muted)] md:text-base">
              {{ $t('about.heroText2') }}
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <article
              v-for="commitment in commitments"
              :key="commitment"
              class="rounded-3xl border border-white/80 bg-white/75 p-4 text-sm leading-6 text-[var(--scf-text)] shadow-sm"
            >
              {{ commitment }}
            </article>
          </div>

          <div class="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <article class="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-sm">
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--scf-accent-dark)]">
                {{ $t('about.localPresenceTitle') }}
              </p>
              <p class="mt-3 text-sm leading-7 text-[var(--scf-text)] md:text-base">
                {{ $t('about.localPresenceText') }}
              </p>
            </article>
            <article class="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-sm">
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--scf-accent-dark)]">
                {{ $t('about.responsibleAdoptionTitle') }}
              </p>
              <p class="mt-3 text-sm leading-7 text-[var(--scf-text)]">
                {{ $t('about.responsibleAdoptionText') }}
              </p>
            </article>
          </div>
        </div>

        <div class="grid gap-4 lg:pt-2">
          <article class="section-card overflow-hidden rounded-[2rem] bg-white/85 p-3">
            <div class="grid gap-3 sm:grid-cols-[0.78fr_1.22fr] sm:items-center">
              <img
                :src="AnaisPhoto"
                :alt="$t('about.photoAlt')"
                class="cat-photo aspect-square rounded-[1.5rem]"
              />
              <div class="space-y-2 p-1">
                <p class="display-font text-2xl font-semibold">{{ $t('about.fieldActionTitle') }}</p>
                <p class="text-sm leading-6 text-[var(--scf-text)]">
                  {{ $t('about.fieldActionText') }}
                </p>
                <a
                  href="https://sanscroquettesfixes.fr/about-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-xs text-[var(--scf-muted)] underline-offset-4 hover:underline"
                >
                  <i class="pi pi-external-link text-[0.7rem]"></i>
                  {{ $t('about.inspiredContent') }}
                </a>
              </div>
            </div>
          </article>

          <article class="section-card overflow-hidden rounded-[2rem] bg-white/85 p-3">
            <img
              :src="PuppyImage"
              :alt="$t('about.catInChargeAlt')"
              class="cat-photo aspect-[5/4] rounded-[1.5rem]"
            />
          </article>
        </div>
      </div>
    </section>

    <section class="grid gap-4 xl:grid-cols-4">
      <article
        v-for="action in actions"
        :key="action.title"
        class="section-card rounded-[2rem] p-5"
      >
        <img :src="action.icon" :alt="action.title" class="mb-4 h-14 w-14 object-contain" />
        <h2 class="display-font text-2xl font-semibold">{{ action.title }}</h2>
        <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">{{ action.text }}</p>
      </article>
    </section>

    <section class="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
      <article class="section-card rounded-[2rem] p-6 md:p-8">
        <span class="eyebrow">{{ $t('about.eyebrowMission') }}</span>
        <h2 class="display-font title-wide mt-4 text-3xl font-semibold md:text-4xl">
          {{ $t('about.missionTitle') }}
        </h2>
        <p class="mt-3 text-sm leading-7 text-[var(--scf-text)] md:text-base">
          {{ $t('about.missionText1') }}
        </p>
        <p class="mt-3 text-sm leading-7 text-[var(--scf-text)] md:text-base">
          {{ $t('about.missionText2') }}
        </p>
      </article>

      <article class="section-card rounded-[2rem] p-6 md:p-8">
        <span class="eyebrow">{{ $t('about.eyebrowHow') }}</span>
        <div class="mt-4 grid gap-4 md:grid-cols-3">
          <article
            v-for="item in timeline"
            :key="item.title"
            class="rounded-[1.5rem] border border-[var(--scf-line)] bg-white/80 p-4"
          >
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--scf-accent-dark)]">
              {{ item.year }}
            </p>
            <h3 class="display-font mt-3 text-2xl font-semibold">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">{{ item.text }}</p>
          </article>
        </div>
      </article>
    </section>

    <section class="space-y-4">
      <div class="space-y-2">
        <span class="eyebrow">{{ $t('about.eyebrowCats') }}</span>
        <h2 class="display-font text-3xl font-semibold md:text-4xl">
          {{ $t('about.catsTitle') }}
        </h2>
        <p class="max-w-3xl text-sm leading-7 text-[var(--scf-text)] md:text-base">
          {{ $t('about.catsText') }}
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="cat in cats"
          :key="cat.name"
          class="section-card overflow-hidden rounded-[2rem]"
        >
          <div class="overflow-hidden rounded-t-[2rem]">
            <img :src="cat.image" :alt="cat.name" class="cat-photo aspect-[4/5]" />
          </div>
          <div class="space-y-3 px-5 pb-5 pt-4">
            <h3 class="display-font text-2xl font-semibold">{{ cat.name }}</h3>
            <p class="text-sm leading-6 text-[var(--scf-text)]">{{ cat.text }}</p>
            <a
              :href="cat.sourceUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-xs text-[var(--scf-muted)] underline-offset-4 hover:underline"
            >
              <i class="pi pi-external-link text-[0.7rem]"></i>
              {{ $t('about.sourceImage') }}
            </a>
          </div>
        </article>
      </div>
    </section>

    <section class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <article class="section-card rounded-[2rem] p-6 md:p-8">
        <span class="eyebrow">{{ $t('about.eyebrowTrust') }}</span>
        <h2 class="display-font title-wide mt-4 text-3xl font-semibold md:text-4xl">
          {{ $t('about.trustTitle') }}
        </h2>
        <p class="mt-3 text-sm leading-7 text-[var(--scf-text)] md:text-base">
          {{ $t('about.trustText1') }}
        </p>
        <p class="mt-3 text-sm leading-7 text-[var(--scf-text)] md:text-base">
          {{ $t('about.trustText2') }}
        </p>
      </article>

      <article
        class="section-card rounded-[2rem] bg-[linear-gradient(135deg,rgba(201,109,68,0.95),rgba(147,80,54,0.95))] p-6 text-white md:p-8"
      >
        <span class="eyebrow !bg-white/12 !text-[var(--scf-accent-soft)]">{{ $t('about.eyebrowCta') }}</span>
        <h2 class="display-font mt-4 text-3xl font-semibold !text-white">{{ $t('about.ctaTitle') }}</h2>
        <p class="mt-3 text-sm leading-7 text-white/85 md:text-base">
          {{ $t('about.ctaText') }}
        </p>
        <div class="mt-5 flex flex-wrap gap-3">
          <Button
            :label="$t('about.seeHome')"
            icon="pi pi-home"
            severity="secondary"
            outlined
            @click="router.push({ name: RouteNames.HOME })"
          />
          <Button
            :label="$t('about.supportUs')"
            icon="pi pi-gift"
            severity="contrast"
            as="a"
            :href="donationUrl"
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>
      </article>
    </section>
  </div>
</template>
