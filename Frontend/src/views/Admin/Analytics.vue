<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { AnalyticsService } from '@/services/analyticsService'
import type { AnalyticsSummary } from '@/models/Analytics'

const loading = ref(false)
const error = ref(false)
const summary = ref<AnalyticsSummary | null>(null)

const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const percentFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'percent',
  maximumFractionDigits: 0,
})

const loadSummary = async () => {
  try {
    loading.value = true
    error.value = false
    const response = await AnalyticsService.GetSummary()
    summary.value = response.data.data
  } catch (err) {
    console.error('Error while loading analytics summary', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(loadSummary)

const adoptionRate = computed(() => {
  if (!summary.value?.cats.total) return 0
  return summary.value.cats.adopted / summary.value.cats.total
})

const averageDonation = computed(() => {
  if (!summary.value?.donations.count) return 0
  return summary.value.donations.amount / summary.value.donations.count
})

const requestRows = computed(() => {
  const byStatus = summary.value?.adoptionRequests.byStatus

  return [
    { label: 'En attente', value: byStatus?.pending ?? 0, color: 'bg-amber-500' },
    { label: 'En cours', value: byStatus?.in_review ?? 0, color: 'bg-sky-500' },
    { label: 'Approuvees', value: byStatus?.approved ?? 0, color: 'bg-emerald-500' },
    { label: 'Refusees', value: byStatus?.rejected ?? 0, color: 'bg-rose-500' },
  ]
})

const catStatusRows = computed(() => [
  { label: 'Adoptes', value: summary.value?.cats.adopted ?? 0, color: 'bg-emerald-500' },
  { label: 'En famille accueil', value: summary.value?.cats.fostered ?? 0, color: 'bg-sky-500' },
  { label: 'En refuge', value: summary.value?.cats.sheltered ?? 0, color: 'bg-orange-500' },
])

const getShare = (value: number, total: number) => {
  if (!total) return '0%'
  return `${Math.round((value / total) * 100)}%`
}

const cards = computed(() => [
  {
    label: 'Chats adoptes',
    value: summary.value?.cats.adopted ?? 0,
    detail: `${percentFormatter.format(adoptionRate.value)} du total chats`,
    icon: 'pi pi-heart-fill',
    tone: 'text-emerald-600 bg-emerald-50',
  },
  {
    label: 'Dons collectes',
    value: currencyFormatter.format(summary.value?.donations.amount ?? 0),
    detail: `${summary.value?.donations.count ?? 0} dons enregistres`,
    icon: 'pi pi-euro',
    tone: 'text-indigo-600 bg-indigo-50',
  },
  {
    label: 'Don moyen',
    value: currencyFormatter.format(averageDonation.value),
    detail: 'Sur les dons termines',
    icon: 'pi pi-chart-line',
    tone: 'text-cyan-600 bg-cyan-50',
  },
  {
    label: 'Posts blog',
    value: summary.value?.blogPosts.published ?? 0,
    detail: `${summary.value?.blogPosts.total ?? 0} posts au total`,
    icon: 'pi pi-pen-to-square',
    tone: 'text-violet-600 bg-violet-50',
  },
])
</script>

<template>
  <section class="flex flex-col gap-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-wide text-surface-500">Statistiques</p>
        <h1 class="text-2xl font-bold text-surface-900">Tableau de bord</h1>
      </div>
      <Button
        icon="pi pi-refresh"
        label="Actualiser"
        :loading="loading"
        outlined
        @click="loadSummary"
      />
    </div>

    <Message v-if="error" severity="error">
      Impossible de charger les statistiques pour le moment.
    </Message>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="card in cards"
        :key="card.label"
        class="rounded-lg border border-surface-200 bg-white p-5 shadow-sm"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-surface-500">{{ card.label }}</p>
            <p class="mt-2 text-3xl font-bold text-surface-950">{{ card.value }}</p>
            <p class="mt-1 text-sm text-surface-500">{{ card.detail }}</p>
          </div>
          <span :class="['flex h-11 w-11 items-center justify-center rounded-lg', card.tone]">
            <i :class="card.icon"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div class="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-surface-900">Demandes adoption</h2>
            <p class="text-sm text-surface-500">
              {{ summary?.adoptionRequests.total ?? 0 }} demandes publiees
            </p>
          </div>
          <i class="pi pi-inbox text-xl text-surface-400"></i>
        </div>

        <div class="mt-5 flex flex-col gap-4">
          <div v-for="row in requestRows" :key="row.label">
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="font-medium text-surface-700">{{ row.label }}</span>
              <span class="text-surface-500">{{ row.value }}</span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-surface-100">
              <div
                :class="['h-full rounded-full', row.color]"
                :style="{ width: getShare(row.value, summary?.adoptionRequests.total ?? 0) }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-surface-900">Situation des chats</h2>
            <p class="text-sm text-surface-500">{{ summary?.cats.total ?? 0 }} chats publies</p>
          </div>
          <i class="pi pi-list text-xl text-surface-400"></i>
        </div>

        <div class="mt-5 flex flex-col gap-4">
          <div v-for="row in catStatusRows" :key="row.label">
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="font-medium text-surface-700">{{ row.label }}</span>
              <span class="text-surface-500">{{ row.value }}</span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-surface-100">
              <div
                :class="['h-full rounded-full', row.color]"
                :style="{ width: getShare(row.value, summary?.cats.total ?? 0) }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
