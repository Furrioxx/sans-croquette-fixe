<script setup lang="ts">
import { computed } from 'vue'
import { RouteNames } from '@/router/routeNames'
import { Roles } from '@/router/Roles'
import { useAuthStore } from '@/stores/authentication'

const authStore = useAuthStore()

const shortcuts = computed(() =>
  [
    {
      label: 'Demandes adoption',
      description: 'Suivre les dossiers entrants et leur statut.',
      icon: 'pi pi-inbox',
      routeName: RouteNames.DASHBOARD_ADOPTION_REQUESTS,
      roles: [Roles.ADMIN, Roles.VOLUNTEER],
    },
    {
      label: 'Absences',
      description: 'Consulter les disponibilites des benevoles.',
      icon: 'pi pi-calendar-times',
      routeName: RouteNames.DASHBOARD_ABSENCES,
      roles: [Roles.ADMIN, Roles.VOLUNTEER],
    },
    {
      label: 'Blog',
      description: 'Gerer les actualites publiees sur le site.',
      icon: 'pi pi-pen-to-square',
      routeName: RouteNames.DASHBOARD_BLOG,
      roles: [Roles.ADMIN, Roles.VOLUNTEER],
    },
    {
      label: 'Fiches chats',
      description: 'Creer et modifier les fiches adoption.',
      icon: 'pi pi-list',
      routeName: RouteNames.DASHBOARD_CATS,
      roles: [Roles.ADMIN],
    },
    {
      label: 'Statistiques',
      description: 'Voir les indicateurs principaux de l association.',
      icon: 'pi pi-chart-line',
      routeName: RouteNames.DASHBOARD_ANALYTICS,
      roles: [Roles.ADMIN],
    },
  ].filter((item) => authStore.getUserRole && item.roles.includes(authStore.getUserRole)),
)
</script>

<template>
  <section class="flex flex-col gap-6">
    <div>
      <p class="text-sm font-semibold uppercase tracking-wide text-surface-500">Vue d'ensemble</p>
      <h1 class="text-2xl font-bold text-surface-900">Raccourcis administration</h1>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <router-link
        v-for="shortcut in shortcuts"
        :key="shortcut.routeName"
        :to="{ name: shortcut.routeName }"
        class="group rounded-lg border border-surface-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
      >
        <div class="flex items-start gap-4">
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600"
          >
            <i :class="shortcut.icon"></i>
          </span>
          <div>
            <h2 class="font-semibold text-surface-900 group-hover:text-primary-600">
              {{ shortcut.label }}
            </h2>
            <p class="mt-1 text-sm leading-6 text-surface-500">
              {{ shortcut.description }}
            </p>
          </div>
        </div>
      </router-link>
    </div>
  </section>
</template>
