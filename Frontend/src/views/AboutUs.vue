<script setup lang="ts">
import { useManager } from '@/router/manager'
import { RouteNames } from '@/router/routeNames'
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
const donationUrl = 'https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1'

const actions = [
  {
    icon: IconPriseEnCharge,
    title: 'Prise en charge des chats',
    text: 'Accueil des chats abandonnés, malades, errants ou sans solution, avec stabilisation, soins et orientation vers une adoption responsable.',
  },
  {
    icon: IconDistribution,
    title: 'Distribution alimentaire',
    text: 'Aide chaque vendredi à Lyon pour les personnes en difficulté, afin de préserver le lien avec leur animal et d’éviter des abandons subis.',
  },
  {
    icon: IconSterilisation,
    title: 'Prévention et stérilisation',
    text: 'Actions de prévention, relais terrain et accompagnement pour limiter l’errance féline et les situations qui dégénèrent.',
  },
  {
    icon: IconAccompagnement,
    title: 'Accompagnement des adoptants',
    text: 'Conseils, écoute et suivi pour aider chaque foyer à adopter un chat à Lyon dans des conditions réalistes et durables.',
  },
]

const commitments = [
  'Association de protection animale basée à Lyon.',
  'Intervention locale dans la métropole lyonnaise et les alentours.',
  'Approche concrète : aider vite, expliquer clairement, accompagner dans la durée.',
]

const timeline = [
  {
    year: '2023',
    title: 'Création de Sans Croquettes Fixes',
    text: 'L’association naît d’un constat simple : trop de foyers fragilisés, trop de chats sans solution, et un besoin d’aide de proximité plus humain.',
  },
  {
    year: 'Chaque semaine',
    title: 'Distribution du vendredi à Lyon',
    text: 'Une permanence alimentaire permet d’aider des gardiens d’animaux en difficulté et de prévenir des ruptures brutales.',
  },
  {
    year: 'Au quotidien',
    title: 'Prises en charge et accompagnement',
    text: 'Soins, orientation, accueil temporaire, adoption et soutien des familles qui veulent bien faire mais ont besoin d’un cadre.',
  },
]

const cats = [
  {
    name: 'Mambo',
    image: MamboImage,
    sourceUrl:
      'https://sanscroquettesfixes.fr/wp-content/uploads/elementor/thumbs/IMG_2834-scaled-qm4k5lzx05i8qkrc35kcrkcnvu3gfah96e8uyh5si0.jpg',
    text: 'Mambo représente ces chats pour lesquels il faut du temps, des soins et un foyer vraiment compatible.',
  },
  {
    name: 'Kiki',
    image: KikiImage,
    sourceUrl:
      'https://sanscroquettesfixes.fr/wp-content/uploads/elementor/thumbs/17cc1429-16f4-40e6-9284-ee0dcbd53cff-r9ae2xxuz9hxzh4dcjlreza2ioszu2jeg6mmvvk03s.jpeg',
    text: 'Kiki rappelle l’importance d’une association chat Lyon capable d’agir vite quand une situation se complique.',
  },
  {
    name: 'Puppy',
    image: PuppyImage,
    sourceUrl:
      'https://sanscroquettesfixes.fr/wp-content/uploads/elementor/thumbs/520243598_1324533869026764_8395821459482323091_n-scaled-r9a97atjwr22im91z4efzswafoiui691yu3bjhzcso.jpg',
    text: 'Chaque profil demande une lecture fine : énergie, santé, environnement, présence humaine et rythme du foyer.',
  },
  {
    name: 'Pépinette',
    image: PepinetteImage,
    sourceUrl:
      'https://sanscroquettesfixes.fr/wp-content/uploads/elementor/thumbs/DJI_20250508202836_0291_D-scaled-r9aeatt4b8ajdpo1ayb3bzn9x1xuenuc77n9tfv3wo.jpg',
    text: 'L’adoption responsable commence par une bonne rencontre, mais aussi par une préparation sérieuse du foyer.',
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
          <span class="eyebrow">Association de protection animale à Lyon</span>
          <div class="space-y-4">
            <h1 class="display-font title-wide text-4xl font-semibold md:text-6xl">{{ title }}</h1>
            <p class="max-w-2xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
              Sans Croquettes Fixes est une association de protection animale à Lyon qui agit pour
              aider les chats en détresse, soutenir les foyers fragilisés et faciliter l’adoption de
              chat à Lyon, Villeurbanne et dans les communes voisines.
            </p>
            <p class="max-w-2xl text-sm leading-7 text-[var(--scf-muted)] md:text-base">
              Notre rôle ne se limite pas à présenter des profils de chats. Nous intervenons aussi
              sur la prévention de l’abandon, la distribution alimentaire, les prises en charge
              urgentes et l’accompagnement des adoptants dans la durée.
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
                Notre présence locale
              </p>
              <p class="mt-3 text-sm leading-7 text-[var(--scf-text)] md:text-base">
                Être une association chat Lyon, c’est pouvoir répondre plus vite, mieux orienter les
                adoptants et garder une vraie proximité avec les situations de terrain.
              </p>
            </article>
            <article class="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-sm">
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--scf-accent-dark)]">
                Adoption responsable
              </p>
              <p class="mt-3 text-sm leading-7 text-[var(--scf-text)]">
                Profil du chat, rythme du foyer, contraintes réelles et suivi après accueil.
              </p>
            </article>
          </div>
        </div>

        <div class="grid gap-4 lg:pt-2">
          <article class="section-card overflow-hidden rounded-[2rem] bg-white/85 p-3">
            <div class="grid gap-3 sm:grid-cols-[0.78fr_1.22fr] sm:items-center">
              <img
                :src="AnaisPhoto"
                alt="Membre de l’association Sans Croquettes Fixes"
                class="cat-photo aspect-square rounded-[1.5rem]"
              />
              <div class="space-y-2 p-1">
                <p class="display-font text-2xl font-semibold">Une action de terrain, pas seulement un site</p>
                <p class="text-sm leading-6 text-[var(--scf-text)]">
                  Cette page doit montrer une association proche du réel : aide alimentaire, prises
                  en charge, prévention de l’abandon et adoption responsable.
                </p>
                <a
                  href="https://sanscroquettesfixes.fr/about-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-xs text-[var(--scf-muted)] underline-offset-4 hover:underline"
                >
                  <i class="pi pi-external-link text-[0.7rem]"></i>
                  Contenu inspiré de la page about-us actuelle
                </a>
              </div>
            </div>
          </article>

          <article class="section-card overflow-hidden rounded-[2rem] bg-white/85 p-3">
            <img
              :src="PuppyImage"
              alt="Chat pris en charge par l’association"
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
        <span class="eyebrow">Notre mission</span>
        <h2 class="display-font title-wide mt-4 text-3xl font-semibold md:text-4xl">
          Faciliter l’adoption de chat à Lyon et prévenir les abandons
        </h2>
        <p class="mt-3 text-sm leading-7 text-[var(--scf-text)] md:text-base">
          L’association intervient sur des situations très concrètes : chats errants, abandons,
          besoins de stérilisation, urgences vétérinaires, foyers en difficulté, besoin d’écoute ou
          d’orientation. L’objectif n’est pas seulement de sauver dans l’urgence, mais de préparer
          des adoptions de chat responsables à Lyon et dans la région lyonnaise.
        </p>
        <p class="mt-3 text-sm leading-7 text-[var(--scf-text)] md:text-base">
          Cette approche locale permet d’accompagner les adoptants avec plus de justesse : profil du
          chat, conditions d’accueil, rythme de vie, contraintes du foyer et capacité réelle à
          s’engager dans la durée.
        </p>
      </article>

      <article class="section-card rounded-[2rem] p-6 md:p-8">
        <span class="eyebrow">Comment l’association agit</span>
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
        <span class="eyebrow">Chats mis en avant</span>
        <h2 class="display-font text-3xl font-semibold md:text-4xl">
          Des prises en charge concrètes, des histoires réelles
        </h2>
        <p class="max-w-3xl text-sm leading-7 text-[var(--scf-text)] md:text-base">
          Les photos ci-dessous viennent du site actuel de l’association et rendent la page plus
          crédible qu’une vitrine générique. Elles rappellent qu’une association chat Lyon travaille
          avec des profils variés, des besoins différents et des adoptions à préparer avec sérieux.
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
              Source image : sanscroquettesfixes.fr
            </a>
          </div>
        </article>
      </div>
    </section>

    <section class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <article class="section-card rounded-[2rem] p-6 md:p-8">
        <span class="eyebrow">Pourquoi nous faire confiance</span>
        <h2 class="display-font title-wide mt-4 text-3xl font-semibold md:text-4xl">
          Une association chat Lyon ancrée localement et utile
        </h2>
        <p class="mt-3 text-sm leading-7 text-[var(--scf-text)] md:text-base">
          Les personnes qui cherchent à adopter un chat à Lyon veulent généralement trois choses :
          comprendre le sérieux de l’association, savoir comment se passe l’adoption et être
          rassurées sur l’accompagnement. Cette page répond précisément à ces attentes avec un
          discours simple, local et crédible.
        </p>
        <p class="mt-3 text-sm leading-7 text-[var(--scf-text)] md:text-base">
          Le référencement local est aussi renforcé naturellement grâce aux formulations autour de
          l’adoption de chat à Lyon, de la métropole lyonnaise, de l’aide alimentaire et du travail
          de terrain mené par l’association.
        </p>
      </article>

      <article
        class="section-card rounded-[2rem] bg-[linear-gradient(135deg,rgba(201,109,68,0.95),rgba(147,80,54,0.95))] p-6 text-white md:p-8"
      >
        <span class="eyebrow !bg-white/12 !text-[var(--scf-accent-soft)]">Passer à l’action</span>
        <h2 class="display-font mt-4 text-3xl font-semibold !text-white">Adopter, aider, relayer</h2>
        <p class="mt-3 text-sm leading-7 text-white/85 md:text-base">
          Vous pouvez adopter un chat, devenir famille d’accueil, soutenir l’association ou relayer
          son travail autour de Lyon. Plus la page est claire, plus elle aide les bons foyers à se
          projeter.
        </p>
        <div class="mt-5 flex flex-wrap gap-3">
          <Button
            label="Voir l’accueil"
            icon="pi pi-home"
            severity="secondary"
            outlined
            @click="router.push({ name: RouteNames.HOME })"
          />
          <Button
            label="Nous soutenir"
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
