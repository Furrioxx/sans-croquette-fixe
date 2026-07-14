<script setup lang="ts">
import { RouteNames } from '@/router/routeNames'
import { useI18n } from 'vue-i18n'
import { CatSheetService } from '@/services/catSheetService'
import type { CatSheet } from '@/models/CatSheet'
import { getCatStatusLabel } from '@/utils/catUtils'
import { getCatImageUrl } from '@/utils/catImageUrl'
import { onMounted, ref } from 'vue'
import AnaisPhoto from '@/assets/about/anais-hillion-1.png'
import { DONATION_URL } from '@/config/donation'

const { t } = useI18n()
const donationUrl = DONATION_URL

const actions = [
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
  {
    icon: 'pi pi-megaphone',
    title: t('about.actions.awareness.title'),
    text: t('about.actions.awareness.text'),
  },
]

const missionItems = [
  {
    icon: 'pi pi-shopping-bag',
    title: t('about.missionsBrief.food.title'),
    text: t('about.missionsBrief.food.text'),
  },
  {
    icon: 'pi pi-heart-fill',
    title: t('about.missionsBrief.care.title'),
    text: t('about.missionsBrief.care.text'),
  },
  {
    icon: 'pi pi-shield',
    title: t('about.missionsBrief.prevention.title'),
    text: t('about.missionsBrief.prevention.text'),
  },
]

const catSheets = ref<CatSheet[]>([])
const loadingCats = ref(false)

onMounted(async () => {
  loadingCats.value = true
  try {
    const response = await CatSheetService.GetPublicCatSheets({ page: 1, pageSize: 4 })
    catSheets.value = response.data.data
  } catch (e) {
    console.error(e)
  } finally {
    loadingCats.value = false
  }
})

const catName = (sheet: CatSheet) => sheet.cats.map((c) => c.name).join(' & ')

const catStatusLabel = (sheet: CatSheet) => getCatStatusLabel(sheet.cats[0]?.catStatus, t)

const catCoverImage = (sheet: CatSheet) => {
  const image = sheet.images?.[0]
  return image ? getCatImageUrl(image.url) : null
}
</script>

<template>
  <div class="flex w-full flex-col">
    <!-- BREADCRUMB -->
    <div class="w-full bg-[var(--scf-bg)] px-4 pt-6 sm:px-6 md:px-[60px]">
      <nav
        class="page-shell flex items-center gap-1.5 text-xs font-semibold text-[var(--scf-muted)]"
      >
        <router-link :to="{ name: RouteNames.HOME }" class="hover:text-[var(--scf-ink)]">{{
          $t('footer.links.home')
        }}</router-link>
        <span>/</span>
        <span class="text-[var(--scf-ink)]">{{ $t('about.breadcrumb') }}</span>
      </nav>
    </div>

    <!-- HERO -->
    <section
      class="relative w-full overflow-hidden bg-[var(--scf-bg)] px-4 pb-14 pt-8 sm:px-6 md:px-[60px] md:pb-16"
    >
      <div
        class="pointer-events-none absolute -right-24 -top-28 h-[320px] w-[320px] rounded-full bg-[var(--scf-accent-soft)]"
      ></div>
      <div class="page-shell relative max-w-2xl space-y-5">
        <span class="eyebrow">{{ $t('about.eyebrowHero') }}</span>
        <h1 class="display-font text-4xl font-semibold leading-tight md:text-6xl">
          Sans Croquettes Fixes
        </h1>
        <p class="max-w-xl text-base leading-8 text-[var(--scf-text)] md:text-lg">
          {{ $t('about.heroText1') }}
        </p>
      </div>
    </section>

    <!-- MISSION PILLARS -->
    <section class="w-full bg-white px-4 py-16 sm:px-6 md:px-[60px]">
      <div class="page-shell space-y-8">
        <h2 class="display-font text-3xl font-semibold md:text-4xl">Nos actions au quotidien</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <article
            v-for="action in actions"
            :key="action.title"
            class="rounded-[20px] bg-[var(--scf-bg)] p-6"
          >
            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--scf-accent-soft)] text-lg text-[var(--scf-accent-dark)]"
            >
              <i :class="action.icon"></i>
            </div>
            <h3 class="display-font mt-4 text-base font-semibold">{{ action.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">{{ action.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- MISSIONS EN BREF -->
    <section class="w-full bg-[var(--scf-bg)] px-4 py-16 sm:px-6 md:px-[60px]">
      <div class="page-shell grid gap-10 lg:grid-cols-2 lg:items-center">
        <div class="space-y-4">
          <span class="eyebrow">{{ $t('about.missionsBrief.eyebrow') }}</span>
          <h2 class="display-font text-3xl font-semibold">{{ $t('about.missionsBrief.title') }}</h2>
          <p class="text-sm leading-7 text-[var(--scf-text)] md:text-base">
            {{ $t('about.missionsBrief.text1') }}
          </p>
          <p class="text-sm leading-7 text-[var(--scf-text)] md:text-base">
            {{ $t('about.missionsBrief.text2') }}
          </p>
        </div>
        <div class="flex flex-col gap-4">
          <article
            v-for="item in missionItems"
            :key="item.title"
            class="flex items-start gap-4 rounded-[20px] bg-white p-6"
          >
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--scf-accent-soft)] text-lg text-[var(--scf-accent-dark)]"
            >
              <i :class="item.icon"></i>
            </div>
            <div>
              <h3 class="display-font text-base font-semibold">{{ item.title }}</h3>
              <p class="mt-1 text-sm leading-6 text-[var(--scf-text)]">{{ item.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- SUCCESS STORIES -->
    <section class="w-full bg-white px-4 py-16 sm:px-6 md:px-[60px]">
      <div class="page-shell space-y-8">
        <div class="space-y-2">
          <span class="eyebrow">{{ $t('about.eyebrowCats') }}</span>
          <h2 class="display-font text-3xl font-semibold md:text-4xl">
            {{ $t('about.catsTitle') }}
          </h2>
        </div>
        <div v-if="loadingCats" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="i in 4"
            :key="i"
            class="animate-pulse overflow-hidden rounded-[20px] bg-[var(--scf-bg)]"
          >
            <div class="aspect-[4/3] bg-[var(--scf-accent-soft)]"></div>
            <div class="space-y-3 p-5">
              <div class="h-4 w-2/3 rounded bg-[var(--scf-accent-soft)]"></div>
              <div class="h-3 w-full rounded bg-white"></div>
            </div>
          </div>
        </div>

        <div v-else-if="catSheets.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <router-link
            v-for="catSheet in catSheets"
            :key="catSheet.documentId"
            :to="{ name: RouteNames.ADOPT_DETAIL, params: { documentId: catSheet.documentId } }"
            class="block overflow-hidden rounded-[20px] bg-[var(--scf-bg)] transition-transform hover:-translate-y-1"
          >
            <div class="aspect-[4/3] overflow-hidden bg-[var(--scf-accent-soft)]">
              <img
                v-if="catCoverImage(catSheet)"
                :src="catCoverImage(catSheet)!"
                :alt="catName(catSheet)"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full items-center justify-center text-[var(--scf-muted)]">
                <i class="pi pi-camera text-3xl"></i>
              </div>
            </div>
            <div class="space-y-2 p-5">
              <span
                v-if="catStatusLabel(catSheet)"
                class="inline-block rounded-full bg-[var(--scf-ink)] px-2.5 py-1 text-[10px] font-bold uppercase text-white"
              >
                {{ catStatusLabel(catSheet) }}
              </span>
              <h3 class="display-font text-lg font-semibold">{{ catName(catSheet) }}</h3>
              <p v-if="catSheet.description" class="text-sm leading-6 text-[var(--scf-text)]">
                {{ catSheet.description }}
              </p>
            </div>
          </router-link>
        </div>

        <div
          v-else
          class="flex flex-col items-center gap-3 rounded-[20px] bg-[var(--scf-bg)] px-6 py-14 text-center"
        >
          <i class="pi pi-heart text-4xl text-[var(--scf-muted)]"></i>
          <p class="text-sm text-[var(--scf-muted)]">{{ $t('home.noCatsAvailable') }}</p>
        </div>
      </div>
    </section>

    <!-- STORY -->
    <section class="w-full bg-[var(--scf-bg)] px-4 py-16 sm:px-6 md:px-[60px]">
      <div class="page-shell flex flex-col gap-10 md:flex-row md:items-center">
        <img
          :src="AnaisPhoto"
          :alt="$t('about.story.photoAlt')"
          class="aspect-square w-full shrink-0 rounded-[24px] object-cover md:w-72"
        />
        <div class="space-y-3">
          <span class="eyebrow">{{ $t('about.story.eyebrow') }}</span>
          <h2 class="display-font text-2xl font-semibold md:text-3xl">
            {{ $t('about.story.title') }}
          </h2>
          <p class="max-w-xl text-sm leading-7 text-[var(--scf-text)]">
            {{ $t('about.story.text1') }}
          </p>
          <p class="max-w-xl text-sm leading-7 text-[var(--scf-text)]">
            {{ $t('about.story.text2') }}
          </p>
        </div>
      </div>
    </section>

    <!-- DONATION CTA -->
    <section
      class="flex w-full flex-col items-center gap-4 bg-[var(--scf-accent)] px-4 py-8 text-center text-white sm:px-6 md:flex-row md:justify-between md:px-[60px] md:text-left"
    >
      <p class="flex-1 text-sm font-semibold leading-6 md:text-base">
        {{ $t('about.donationCta.text') }}
      </p>
      <Button
        as="a"
        :href="donationUrl"
        target="_blank"
        rel="noopener noreferrer"
        :label="$t('about.donationCta.cta')"
        icon="pi pi-gift"
        severity="contrast"
        rounded
      />
    </section>

    <!-- CONTACT -->
    <section class="w-full bg-white px-4 py-16 sm:px-6 md:px-[60px]">
      <div class="page-shell grid gap-5 md:grid-cols-2">
        <article class="rounded-[20px] bg-[var(--scf-bg)] p-8">
          <h3 class="display-font text-lg font-semibold">{{ $t('about.contact.help.title') }}</h3>
          <p class="mt-2 text-sm leading-7 text-[var(--scf-text)]">
            {{ $t('about.contact.help.text') }}
          </p>
        </article>
        <article class="rounded-[20px] bg-[var(--scf-bg)] p-8">
          <h3 class="display-font text-lg font-semibold">
            {{ $t('about.contact.mailOnly.title') }}
          </h3>
          <p class="mt-2 text-sm leading-7 text-[var(--scf-text)]">
            {{ $t('about.contact.mailOnly.text') }}
          </p>
        </article>
      </div>
    </section>
  </div>
</template>
