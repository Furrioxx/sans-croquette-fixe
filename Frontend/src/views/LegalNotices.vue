<script setup lang="ts">
import { RouteNames } from '@/router/routeNames'
import { useManager } from '@/router/manager'

const title = useManager().getCurrentRouteTitle()

const legalEmail = 'contact@sanscroquettesfixes.fr'
const legalMailto = `mailto:${legalEmail}?subject=${encodeURIComponent('Demande depuis les mentions légales')}`

const noticeSections = [
  {
    title: 'Éditeur du site',
    items: [
      'Association Sans Croquettes Fixes, association loi 1901 à but non lucratif.',
      'SIRET : 818 195 307 00017.',
      'Responsable éditoriale : Anaïs Hillion.',
    ],
  },
  {
    title: 'Coordonnées',
    items: [
      'Adresse : 22 chemin de Boutary, 69300 Caluire-et-Cuire.',
      "Cette adresse correspond à une boîte postale et non à un refuge ; les animaux n'y sont pas accueillis.",
      'Téléphone : 06 18 25 72 38.',
      `Email : ${legalEmail}.`,
    ],
  },
  {
    title: 'Hébergement',
    items: [
      'Hébergeur : IONOS 1&1.',
      'Site officiel : www.sanscroquettesfixes.fr.',
    ],
  },
  {
    title: "Informations et contenus",
    items: [
      "L'association s'efforce de publier des informations aussi fiables que possible, mais certaines données peuvent évoluer ou comporter des omissions.",
      "Les textes, visuels et éléments publiés sur le site restent protégés et ne peuvent pas être réutilisés sans autorisation.",
    ],
  },
  {
    title: 'Données personnelles',
    items: [
      "Certaines données peuvent être transmises via les formulaires du site pour traiter les demandes adressées à l'association.",
      `Pour toute question relative à ces données, vous pouvez écrire à ${legalEmail}.`,
    ],
  },
]
</script>

<template>
  <div class="flex w-full flex-col">
    <div class="w-full bg-[var(--scf-bg)] px-4 pt-6 sm:px-6 md:px-[60px]">
      <nav
        class="page-shell flex items-center gap-1.5 text-xs font-semibold text-[var(--scf-muted)]"
      >
        <router-link :to="{ name: RouteNames.HOME }" class="hover:text-[var(--scf-ink)]">
          {{ $t('footer.links.home') }}
        </router-link>
        <span>/</span>
        <span class="text-[var(--scf-ink)]">{{ title }}</span>
      </nav>
    </div>

    <section
      class="relative w-full overflow-hidden bg-[var(--scf-bg)] px-4 pb-14 pt-8 sm:px-6 md:px-[60px] md:pb-16"
    >
      <div
        class="pointer-events-none absolute -right-24 -top-28 h-[320px] w-[320px] rounded-full bg-[var(--scf-accent-soft)]"
      ></div>
      <div class="page-shell relative max-w-3xl space-y-5">
        <span
          class="inline-flex rounded-full border border-[var(--scf-line)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--scf-accent-dark)]"
        >
          Informations légales
        </span>
        <h1 class="display-font text-4xl font-semibold leading-tight md:text-6xl">
          {{ title }}
        </h1>
        <p class="max-w-2xl text-base leading-8 text-[var(--scf-text)] md:text-lg">
          Cette page reprend les informations d’identification, de contact et d’hébergement
          publiées sur les mentions légales officielles de Sans Croquettes Fixes.
        </p>
      </div>
    </section>

    <section class="w-full bg-white px-4 py-16 sm:px-6 md:px-[60px]">
      <div class="page-shell grid gap-5 md:grid-cols-2">
        <article
          v-for="section in noticeSections"
          :key="section.title"
          class="rounded-[24px] bg-[var(--scf-bg)] p-6 sm:p-7"
        >
          <h2 class="display-font text-2xl font-semibold text-[var(--scf-ink)]">
            {{ section.title }}
          </h2>
          <ul class="mt-4 space-y-3 text-sm leading-7 text-[var(--scf-text)]">
            <li v-for="item in section.items" :key="item">
              {{ item }}
            </li>
          </ul>
        </article>
      </div>

      <div
        class="page-shell mt-6 rounded-[24px] border border-[var(--scf-line)] bg-[var(--scf-accent-soft)] p-6 sm:p-7"
      >
        <h2 class="display-font text-2xl font-semibold text-[var(--scf-ink)]">
          Contact juridique
        </h2>
        <p class="mt-3 max-w-3xl text-sm leading-7 text-[var(--scf-text)]">
          Pour une demande liée au site ou à ses mentions légales, utilisez l’adresse de contact
          publiée par l’association.
        </p>
        <a
          :href="legalMailto"
          class="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--scf-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(230,120,84,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[var(--scf-accent-dark)] sm:mt-7 sm:w-auto"
        >
          {{ legalEmail }}
        </a>
      </div>
    </section>
  </div>
</template>
