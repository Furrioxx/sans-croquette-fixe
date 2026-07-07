<script setup lang="ts">
import { featuredCats } from '@/content/catGallery'
import { useManager } from '@/router/manager'
import { RouteNames } from '@/router/routeNames'
import { useRouter } from 'vue-router'

const title = useManager().getCurrentRouteTitle()
const router = useRouter()
const donationUrl = 'https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1'

const highlights = [
  {
    value: '48h',
    label: "pour analyser un premier dossier d'adoption de chat a Lyon",
  },
  {
    value: 'Local',
    label: 'association chat Lyon ancree sur la metropole et les alentours',
  },
  {
    value: 'Humain',
    label: "adoption de chat accompagnee avant et apres l'accueil",
  },
]

const steps = [
  {
    title: 'Observer le bon profil',
    text: "Comparer les besoins, le rythme de vie et la sociabilite de chaque chat avant de lancer une demande d'adoption a Lyon ou autour de Lyon.",
  },
  {
    title: 'Constituer un dossier simple',
    text: "Creer un compte, presenter ton foyer et decrire des conditions d'accueil reelles pour adopter un chat a Lyon dans de bonnes conditions.",
  },
  {
    title: "Echanger avec l'association",
    text: "Valider ensemble l'adequation entre le chat, le lieu de vie, la disponibilite et la capacite d'engagement sur la duree.",
  },
]
</script>

<template>
  <div class="page-shell space-y-8 pb-16">
    <section
      class="hero-panel section-card overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-100 via-amber-50 to-emerald-100 px-6 py-8 md:px-10 md:py-12"
    >
      <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div class="max-w-3xl space-y-6">
          <span class="eyebrow">Adoption responsable</span>
          <div class="space-y-4">
            <h1 class="display-font text-4xl font-semibold leading-tight md:text-6xl">
              {{ title }}
            </h1>
            <p class="max-w-2xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
              Sans Croquettes Fixes est une association de protection animale qui facilite l'adoption
              de chat a Lyon, dans la metropole lyonnaise et dans les alentours. Le site aide a adopter
              un chat en comprenant son caractere, ses besoins et les conditions d'accueil qui lui
              correspondent vraiment.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <Button
              label="Voir les profils"
              icon="pi pi-heart-fill"
              @click="router.push({ name: RouteNames.REGISTER })"
            />
            <Button
              label="Connaitre l'association"
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
                <span class="eyebrow">En recherche d'accueil</span>
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
          <span class="eyebrow">Profils mis en avant</span>
          <h2 class="display-font text-3xl font-semibold md:text-4xl">
            Adopter un chat a Lyon avec des profils clairs
          </h2>
        </div>
        <Button
          label="Creer un compte"
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
                  {{ cat.role }} . {{ cat.age }} . adoption chat Lyon
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
        <span class="eyebrow">Methode</span>
        <h2 class="display-font title-wide mt-4 text-3xl font-semibold md:text-4xl">
          Comment adopter un chat a Lyon avec l'association
        </h2>
        <p class="mt-3 max-w-xl text-sm leading-7 text-[var(--scf-text)] md:text-base">
          Le parcours d'adoption doit etre lisible. La page explique le rythme, la logique et le
          niveau d'engagement attendu pour une adoption de chat responsable a Lyon, Villeurbanne,
          Bron, Caluire-et-Cuire et dans les communes voisines.
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
          <span class="eyebrow !bg-white/10 !text-orange-100">Soutenir l'association</span>
          <h2 class="display-font text-3xl font-semibold !text-white md:text-4xl">
            Une association chat a Lyon qui prepare des adoptions durables
          </h2>
          <p class="text-sm leading-7 text-orange-50/85 md:text-base">
            L'objectif est simple : rendre visible une association chat Lyon serieuse, rassurer les
            adoptants et mieux faire remonter le site sur les recherches autour de l'adoption de chat
            a Lyon et ses alentours.
          </p>
        </div>
        <Button
          as="a"
          :href="donationUrl"
          target="_blank"
          rel="noopener noreferrer"
          label="Faire un don"
          icon="pi pi-gift"
          severity="contrast"
        />
      </div>
    </section>
  </div>
</template>
