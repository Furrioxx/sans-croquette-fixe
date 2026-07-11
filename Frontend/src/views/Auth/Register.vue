<script setup lang="ts">
import RegisterFormComponenet from '@/components/Forms/Auth/RegisterFormComponent.vue'
import FriendlyCatImage from '@/assets/home/image-abandon.jpg'
import { useManager } from '@/router/manager'
import { RouteNames } from '@/router/routeNames'
import { useRouter } from 'vue-router'

const title = useManager().getCurrentRouteTitle()
const router = useRouter()
</script>

<template>
  <div class="flex w-full flex-col">
    <section class="bg-[var(--scf-bg)] px-6 py-14 md:px-[60px] md:py-16">
      <div class="page-shell auth-main-grid">
        <aside class="auth-aside">
          <span class="eyebrow">{{ $t('auth.register-eyebrow') }}</span>
          <h2 class="display-font text-3xl font-semibold md:text-4xl">
            {{ title }}
          </h2>
          <p class="max-w-xl text-sm leading-7 text-[var(--scf-text)] md:text-base">
            {{ $t('auth.register-hero-text') }}
          </p>

          <div class="responsive-actions">
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

          <div class="auth-aside-media">
            <img :src="FriendlyCatImage" :alt="$t('auth.register-photo-alt')" class="cat-photo" />
          </div>
        </aside>

        <div class="auth-form-panel section-card auth-form-panel-home">
          <div class="space-y-3">
            <span class="eyebrow">{{ $t('auth.register-card-kicker') }}</span>
            <h2 class="display-font text-3xl font-semibold md:text-4xl">
              {{ $t('auth.register-card-title') }}
            </h2>
            <p class="text-sm leading-6 text-[var(--scf-muted)] md:text-base">
              {{ $t('auth.register-card-text') }}
            </p>
          </div>
          <RegisterFormComponenet />
        </div>
      </div>
    </section>
  </div>
</template>
