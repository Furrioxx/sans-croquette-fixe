<script setup lang="ts">
import { featuredCats } from '@/content/catGallery'
import { useManager } from '@/router/manager'

const title = useManager().getCurrentRouteTitle()

const donations = [
  {
    amount: '15 EUR',
    title: 'Petit coup de pouce',
    text: 'Contribue à la nourriture, à la litière et aux besoins de base d’un accueil temporaire.',
  },
  {
    amount: '45 EUR',
    title: 'Soin courant',
    text: 'Participe à une consultation, à des premiers traitements ou à une identification.',
  },
  {
    amount: '90 EUR',
    title: 'Urgence mieux absorbée',
    text: 'Aide à lisser un acte vétérinaire plus lourd et à garder une marge d’action.',
  },
]
</script>

<template>
  <div class="page-shell space-y-8 pb-16">
    <section
      class="hero-panel section-card rounded-[2.5rem] bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 px-6 py-8 md:px-10 md:py-12"
    >
      <div class="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div class="space-y-5">
          <span class="eyebrow">Don et soutien</span>
          <h1 class="display-font text-4xl font-semibold leading-tight md:text-6xl">{{ title }}</h1>
          <p class="max-w-2xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
            Un don utile finance les soins, les prises en charge et les urgences qui rendent possible
            l’adoption de chat à Lyon et dans les alentours. Ici, le message doit être simple :
            l’argent sert directement à protéger des chats et à préparer leur accueil.
          </p>
          <a
            href="https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-2xl bg-[var(--scf-ink)] px-5 py-3 font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <i class="pi pi-heart-fill"></i>
            Faire un don sur HelloAsso
          </a>
        </div>

        <article class="section-card overflow-hidden rounded-[2rem] bg-white/80 p-4">
          <div class="grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div class="overflow-hidden rounded-[1.5rem]">
              <img :src="featuredCats[2].imageUrl" :alt="featuredCats[2].name" class="cat-photo aspect-[4/5]" />
            </div>
            <div class="space-y-3">
              <span class="eyebrow">Impact visible</span>
              <h2 class="display-font text-3xl font-semibold">{{ featuredCats[2].name }}</h2>
              <p class="text-sm leading-6 text-[var(--scf-text)]">
                Un don ne finance pas seulement un besoin technique. Il permet de garder un chat en
                sécurité pendant le temps nécessaire pour trouver la bonne famille à Lyon ou dans la
                région lyonnaise.
              </p>
              <a
                :href="featuredCats[2].creditUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-xs text-[var(--scf-muted)] underline-offset-4 hover:underline"
              >
                <i class="pi pi-external-link text-[0.7rem]"></i>
                {{ featuredCats[2].creditLabel }} ({{ featuredCats[2].licenseLabel }})
              </a>
            </div>
          </div>
        </article>
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
        <span class="eyebrow">Où va l’aide</span>
        <div class="mt-4 grid gap-4 md:grid-cols-3">
          <article class="rounded-[1.5rem] border border-[var(--scf-line)] bg-white/80 p-4">
            <h3 class="display-font text-xl font-semibold">Soins vétérinaires</h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">
              Consultations, traitements, stérilisation, examens et suivis avant adoption.
            </p>
          </article>
          <article class="rounded-[1.5rem] border border-[var(--scf-line)] bg-white/80 p-4">
            <h3 class="display-font text-xl font-semibold">Matériel et nourriture</h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">
              Litière, alimentation, caisses, produits d’hygiène et petits équipements utiles.
            </p>
          </article>
          <article class="rounded-[1.5rem] border border-[var(--scf-line)] bg-white/80 p-4">
            <h3 class="display-font text-xl font-semibold">Urgences de terrain</h3>
            <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">
              Souplesse financière pour agir vite lorsqu’une situation se dégrade.
            </p>
          </article>
        </div>
      </article>

      <article
        class="section-card rounded-[2rem] bg-[linear-gradient(135deg,rgba(201,109,68,0.95),rgba(147,80,54,0.95))] p-6 text-white md:p-8"
      >
        <span class="eyebrow !bg-white/12 !text-orange-100">Dons matériels</span>
        <h2 class="display-font mt-4 text-3xl font-semibold !text-white">Autre façon d’aider</h2>
        <p class="mt-3 text-sm leading-7 text-orange-50/90 md:text-base">
          Nourriture non périmée, litière, accessoires propres, produits de soin et petits objets du
          quotidien peuvent aussi soulager les familles d’accueil.
        </p>
        <p class="mt-4 text-sm font-medium text-white">
          Contact:
          <a class="underline decoration-white/40 underline-offset-4" href="mailto:dons@sanscroquettesfixes.fr">
            dons@sanscroquettesfixes.fr
          </a>
        </p>
      </article>
    </section>
  </div>
</template>
