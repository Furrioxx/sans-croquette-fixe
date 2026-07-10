<script setup lang="ts">
import LoginFormComponent from '@/components/Forms/Auth/LoginFormComponent.vue'
import { RouteNames } from '@/router/routeNames'
import { useManager } from '@/router/manager'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FriendlyCatImage from '@/assets/home/les-felins-de-lombre-scaled.jpg'

const title = useManager().getCurrentRouteTitle()
const { t } = useI18n()
const router = useRouter()

const highlights = [
  t('auth.login-highlights.safe'),
  t('auth.login-highlights.follow'),
  t('auth.login-highlights.match'),
]
</script>

<template>
  <section class="auth-page-shell px-6 py-10 md:px-[60px] md:py-14">
    <div class="page-shell">
      <div class="auth-layout">
        <div class="auth-form-panel auth-layout-form section-card">
          <div class="space-y-2">
            <p class="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--scf-accent-dark)]">
              {{ $t('auth.login-card-kicker') }}
            </p>
            <h2 class="display-font text-3xl font-semibold md:text-4xl">
              {{ $t('auth.login-card-title') }}
            </h2>
            <p class="text-sm leading-6 text-[var(--scf-muted)] md:text-base">
              {{ $t('auth.login-card-text') }}
            </p>
          </div>

          <LoginFormComponent />
        </div>

        <aside class="auth-story-panel auth-layout-story section-card cat-accent-primary">
          <div class="space-y-5">
            <span class="eyebrow">{{ $t('auth.login-eyebrow') }}</span>
            <div class="space-y-4">
              <h1 class="display-font text-4xl font-semibold md:text-6xl">{{ title }}</h1>
              <p class="max-w-xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
                {{ $t('auth.login-hero-text') }}
              </p>
            </div>
          </div>

          <div class="auth-highlight-list">
            <article
              v-for="highlight in highlights"
              :key="highlight"
              class="auth-highlight-item stagger-rise"
            >
              <div class="auth-highlight-icon">
                <i class="pi pi-heart-fill"></i>
              </div>
              <p>{{ highlight }}</p>
            </article>
          </div>

          <div class="auth-photo-card">
            <img :src="FriendlyCatImage" :alt="$t('auth.login-photo-alt')" class="cat-photo" />
            <div class="auth-photo-caption">
              <p class="display-font text-xl font-semibold text-white">
                {{ $t('auth.login-photo-title') }}
              </p>
              <p class="text-sm leading-6 text-white/85">{{ $t('auth.login-photo-text') }}</p>
            </div>
          </div>

          <div class="auth-side-actions">
            <Button
              :label="$t('home.adoptCat')"
              icon="pi pi-heart-fill"
              rounded
              @click="router.push({ name: RouteNames.ADOPT })"
            />
            <Button
              :label="$t('nav.association')"
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
