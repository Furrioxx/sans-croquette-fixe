<script setup lang="ts">
import { RouteNames } from '@/router/routeNames'
import Logo from '@/assets/Logo.png'
</script>

<template>
  <footer class="w-full bg-[var(--scf-ink)] px-4 py-12 text-white sm:px-6 md:px-10">
    <div class="page-shell flex flex-col gap-10 text-center md:flex-row md:items-start md:justify-between md:text-left">
      <div class="max-w-sm space-y-3">
        <div class="flex items-center justify-center gap-3 md:justify-start">
          <img :src="Logo" width="40" :alt="$t('nav.brand')" class="shrink-0" />
          <span class="display-font text-xl font-semibold !text-white">{{ $t('nav.brand') }}</span>
        </div>
        <p class="text-sm leading-6 text-white/70">{{ $t('footer.tagline') }}</p>
      </div>

      <div class="responsive-footer-links">
        <div class="flex flex-col gap-3 text-sm font-semibold">
          <span class="text-xs uppercase tracking-[0.18em] text-white/50">{{
            $t('footer.navigation')
          }}</span>
          <router-link :to="{ name: RouteNames.HOME }" class="text-white/85 hover:text-white">
            {{ $t('footer.links.home') }}
          </router-link>
          <router-link :to="{ name: RouteNames.ADOPT }" class="text-white/85 hover:text-white">
            {{ $t('footer.links.adopt') }}
          </router-link>
          <router-link
            :to="{ name: RouteNames.FOOD_DISTRIBUTION }"
            class="text-white/85 hover:text-white"
          >
            {{ $t('footer.links.distribution') }}
          </router-link>
          <router-link :to="{ name: RouteNames.ABOUT_US }" class="text-white/85 hover:text-white">
            {{ $t('footer.links.about') }}
          </router-link>
        </div>

        <div class="flex flex-col gap-3 text-sm font-semibold">
          <span class="text-xs uppercase tracking-[0.18em] text-white/50">{{
            $t('footer.follow')
          }}</span>
          <a href="https://www.facebook.com/sanscroquettesfixes" target="_blank">
            <span class="inline-flex items-center justify-center gap-2 text-white/85 md:justify-start">
              <i class="pi pi-facebook"></i>
              Facebook
            </span>
          </a>
          <a href="https://www.instagram.com/sanscroquettesfixes/" target="_blank">
            <span class="inline-flex items-center justify-center gap-2 text-white/85 md:justify-start">
              <i class="pi pi-instagram"></i>
              Instagram
            </span>
          </a>
        </div>
      </div>
    </div>

    <p class="page-shell mt-10 text-xs text-white/50">{{ $t('footer.legal') }}</p>
  </footer>
</template>
