<script setup lang="ts">
import { useManager } from '@/router/manager'
import RegisterFormComponenet from '@/components/Forms/Auth/RegisterFormComponent.vue'
import { RouteNames } from '@/router/routeNames'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FriendlyCatImage from '@/assets/home/image-abandon.jpg'

const title = useManager().getCurrentRouteTitle()
const { t } = useI18n()
const router = useRouter()

const steps = [
  t('auth.register-highlights.profile'),
  t('auth.register-highlights.requests'),
  t('auth.register-highlights.follow'),
]
</script>

<template>
  <section class="auth-page-shell px-6 py-10 md:px-[60px] md:py-14">
    <div class="page-shell">
      <div class="auth-layout">
        <div class="auth-form-panel auth-layout-form section-card">
          <div class="space-y-2">
            <p class="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--scf-accent-dark)]">
              {{ $t('auth.register-card-kicker') }}
            </p>
            <h2 class="display-font text-3xl font-semibold md:text-4xl">
              {{ $t('auth.register-card-title') }}
            </h2>
            <p class="text-sm leading-6 text-[var(--scf-muted)] md:text-base">
              {{ $t('auth.register-card-text') }}
            </p>
          </div>

          <RegisterFormComponenet />
        </div>

        <aside class="auth-story-panel auth-layout-story section-card cat-accent-secondary">
          <div class="space-y-5">
            <span class="eyebrow">{{ $t('auth.register-eyebrow') }}</span>
            <div class="space-y-4">
              <h1 class="display-font text-4xl font-semibold md:text-6xl">{{ title }}</h1>
              <p class="max-w-xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
                {{ $t('auth.register-hero-text') }}
              </p>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <article
              v-for="step in steps"
              :key="step"
              class="rounded-[24px] border border-white/70 bg-white/70 p-4 text-sm font-semibold leading-6 text-[var(--scf-text)]"
            >
              {{ step }}
            </article>
          </div>

          <div class="auth-photo-card">
            <img :src="FriendlyCatImage" :alt="$t('auth.register-photo-alt')" class="cat-photo" />
            <div class="auth-photo-caption">
              <p class="display-font text-xl font-semibold text-white">
                {{ $t('auth.register-photo-title') }}
              </p>
              <p class="text-sm leading-6 text-white/85">{{ $t('auth.register-photo-text') }}</p>
            </div>
          </div>

          <div class="auth-side-actions">
            <Button
              :label="$t('discover.nav-link')"
              icon="pi pi-heart"
              rounded
              @click="router.push({ name: RouteNames.DISCOVER })"
            />
            <Button
              :label="$t('home.knowAssociation')"
              icon="pi pi-arrow-right"
              iconPos="right"
              severity="secondary"
              outlined
              rounded
              @click="router.push({ name: RouteNames.ABOUT_US })"
            />
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
