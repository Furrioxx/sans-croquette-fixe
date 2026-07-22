<script setup lang="ts">
import type { DashboardSummary } from '@/models/Dashboard'
import { DashboardService } from '@/services/dashboardService'
import notificationService from '@/services/notificationService'
import { computed, onMounted, ref } from 'vue'

type StatTone = 'rose' | 'amber' | 'sky' | 'emerald' | 'slate' | 'violet'

interface StatCard {
  label: string
  value: number
  detail: string
  icon: string
  tone: StatTone
}

interface ProgressStat {
  label: string
  value: number
  total: number
  detail: string
  tone: StatTone
}

const dashboard = ref<DashboardSummary | null>(null)
const loading = ref(false)
const loadError = ref(false)

const percent = (value: number, total: number) => {
  if (total <= 0) return 0
  return Math.min(100, Math.round((value / total) * 100))
}

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

const adoptionWorkload = computed(() => {
  if (!dashboard.value) return 0
  return dashboard.value.adoptionRequests.pending + dashboard.value.adoptionRequests.inReview
})

const overviewStats = computed<StatCard[]>(() => {
  if (!dashboard.value) return []

  const stats: StatCard[] = [
    {
      label: "Demandes d'adoption",
      value: dashboard.value.adoptionRequests.total,
      detail: `${adoptionWorkload.value} dossier(s) a traiter`,
      icon: 'pi pi-inbox',
      tone: 'rose',
    },
    {
      label: 'Articles de blog',
      value: dashboard.value.contentHealth?.totalBlogPosts ?? 0,
      detail: `${dashboard.value.contentHealth?.publishedBlogPosts ?? 0} publie(s)`,
      icon: 'pi pi-file-edit',
      tone: 'amber',
    },
    {
      label: 'Chats enregistres',
      value: dashboard.value.cats.total,
      detail: `${dashboard.value.cats.adoptable} adoptable(s)`,
      icon: 'pi pi-heart',
      tone: 'emerald',
    },
    {
      label: 'Conversations',
      value: dashboard.value.conversations.total,
      detail: `${dashboard.value.conversations.activeLast7Days} active(s) sur 7 jours`,
      icon: 'pi pi-comments',
      tone: 'sky',
    },
  ]

  if (dashboard.value.team) {
    stats.push({
      label: 'Benevoles actifs',
      value: dashboard.value.team.activeVolunteers,
      detail: `${dashboard.value.team.blockedUsers} compte(s) bloque(s)`,
      icon: 'pi pi-users',
      tone: 'violet',
    })
  }

  return stats
})

const progressStats = computed<ProgressStat[]>(() => {
  if (!dashboard.value) return []

  const contentHealth = dashboard.value.contentHealth

  return [
    {
      label: 'Demandes en attente',
      value: dashboard.value.adoptionRequests.pending,
      total: dashboard.value.adoptionRequests.total,
      detail: `${dashboard.value.adoptionRequests.overdue} en retard`,
      tone: 'rose',
    },
    {
      label: 'Demandes en revue',
      value: dashboard.value.adoptionRequests.inReview,
      total: dashboard.value.adoptionRequests.total,
      detail: `${adoptionWorkload.value} demande(s) actives`,
      tone: 'amber',
    },
    {
      label: 'Articles publies',
      value: contentHealth?.publishedBlogPosts ?? 0,
      total: contentHealth?.totalBlogPosts ?? 0,
      detail: `${contentHealth?.draftBlogPosts ?? 0} brouillon(s)`,
      tone: 'sky',
    },
    {
      label: 'Chats adoptables',
      value: dashboard.value.cats.adoptable,
      total: dashboard.value.cats.total,
      detail: `${dashboard.value.cats.adopted} adopte(s)`,
      tone: 'emerald',
    },
  ]
})

const contentChecks = computed<StatCard[]>(() => {
  if (!dashboard.value?.contentHealth) return []

  return [
    {
      label: 'Articles en brouillon',
      value: dashboard.value.contentHealth.draftBlogPosts,
      detail: 'A finaliser avant publication',
      icon: 'pi pi-pencil',
      tone: 'amber',
    },
    {
      label: 'Fiches sans media',
      value: dashboard.value.contentHealth.catSheetsWithoutMedia,
      detail: 'A completer pour les adoptions',
      icon: 'pi pi-image',
      tone: 'slate',
    },
    {
      label: 'Fiches sans suppleant',
      value: dashboard.value.contentHealth.catSheetsWithoutBackup,
      detail: 'A securiser cote suivi',
      icon: 'pi pi-user-minus',
      tone: 'violet',
    },
  ]
})

const loadAnalytics = async () => {
  try {
    loading.value = true
    const response = await DashboardService.getSummary()
    dashboard.value = response.data.data
    loadError.value = false
  } catch (error) {
    console.error('Error while loading analytics', error)
    loadError.value = true
    notificationService.showError('Erreur', 'Impossible de charger les statistiques.')
  } finally {
    loading.value = false
  }
}

onMounted(loadAnalytics)
</script>

<template>
  <section class="analytics-page">
    <header class="analytics-header">
      <div>
        <p class="analytics-eyebrow">Statistiques</p>
        <h1 class="analytics-title">Indicateurs de l'association</h1>
        <p v-if="dashboard" class="analytics-subtitle">
          Derniere mise a jour : {{ formatDateTime(dashboard.generatedAt) }}
        </p>
      </div>
      <Button
        icon="pi pi-refresh"
        label="Actualiser"
        :loading="loading"
        severity="secondary"
        outlined
        @click="loadAnalytics"
      />
    </header>

    <div v-if="loading && !dashboard" class="analytics-grid">
      <article v-for="index in 5" :key="index" class="analytics-card analytics-card--loading"></article>
    </div>

    <article v-else-if="loadError && !dashboard" class="analytics-empty">
      <i class="pi pi-chart-bar"></i>
      <h2>Statistiques indisponibles</h2>
      <p>Les donnees ne peuvent pas etre recuperees pour le moment.</p>
    </article>

    <template v-else-if="dashboard">
      <div class="analytics-grid">
        <article
          v-for="stat in overviewStats"
          :key="stat.label"
          class="analytics-card"
          :class="`analytics-card--${stat.tone}`"
        >
          <span class="analytics-icon"><i :class="stat.icon"></i></span>
          <p class="analytics-value">{{ stat.value }}</p>
          <h2>{{ stat.label }}</h2>
          <p>{{ stat.detail }}</p>
        </article>
      </div>

      <div class="analytics-columns">
        <section class="analytics-panel">
          <div class="analytics-panel-header">
            <div>
              <p class="analytics-eyebrow">Repartition</p>
              <h2 class="analytics-panel-title">Volumes principaux</h2>
            </div>
          </div>

          <div class="analytics-progress-list">
            <article v-for="item in progressStats" :key="item.label" class="analytics-progress">
              <div class="analytics-progress-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }} / {{ item.total }}</strong>
              </div>
              <div class="analytics-progress-track">
                <span
                  class="analytics-progress-bar"
                  :class="`analytics-progress-bar--${item.tone}`"
                  :style="{ width: `${percent(item.value, item.total)}%` }"
                ></span>
              </div>
              <p>{{ item.detail }}</p>
            </article>
          </div>
        </section>

        <section class="analytics-panel">
          <div class="analytics-panel-header">
            <div>
              <p class="analytics-eyebrow">Contenu</p>
              <h2 class="analytics-panel-title">Points a surveiller</h2>
            </div>
          </div>

          <div v-if="contentChecks.length" class="analytics-check-list">
            <article
              v-for="check in contentChecks"
              :key="check.label"
              class="analytics-check"
              :class="`analytics-check--${check.tone}`"
            >
              <span><i :class="check.icon"></i></span>
              <div>
                <strong>{{ check.value }}</strong>
                <h3>{{ check.label }}</h3>
                <p>{{ check.detail }}</p>
              </div>
            </article>
          </div>

          <div v-else class="analytics-empty analytics-empty--compact">
            <i class="pi pi-lock"></i>
            <p>Ces indicateurs sont reserves aux administrateurs.</p>
          </div>
        </section>
      </div>
    </template>
  </section>
</template>

<style scoped>
.analytics-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.analytics-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
}

.analytics-eyebrow {
  color: #9d554b;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.analytics-title {
  margin-top: 0.25rem;
  color: #111827;
  font-size: 1.75rem;
  font-weight: 800;
}

.analytics-subtitle {
  margin-top: 0.35rem;
  color: #6b7280;
  font-size: 0.88rem;
}

.analytics-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
}

.analytics-card,
.analytics-panel,
.analytics-empty {
  border: 1px solid #f1f5f9;
  border-radius: 1rem;
  background: #ffffff;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
}

.analytics-card {
  min-height: 11rem;
  padding: 1.1rem;
}

.analytics-card--loading {
  animation: pulse 1.5s ease-in-out infinite;
  background: #f3f4f6;
}

.analytics-icon {
  display: flex;
  width: 2.75rem;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.85rem;
  font-size: 1.15rem;
}

.analytics-value {
  margin-top: 1.35rem;
  color: #111827;
  font-size: 2rem;
  font-weight: 800;
}

.analytics-card h2 {
  margin-top: 0.15rem;
  color: #1f2937;
  font-size: 0.95rem;
  font-weight: 700;
}

.analytics-card p:last-child,
.analytics-progress p,
.analytics-check p {
  margin-top: 0.25rem;
  color: #6b7280;
  font-size: 0.78rem;
  line-height: 1.35rem;
}

.analytics-card--rose .analytics-icon,
.analytics-progress-bar--rose {
  background: #fff0ed;
  color: #bd574b;
}

.analytics-card--amber .analytics-icon,
.analytics-progress-bar--amber {
  background: #fff7df;
  color: #a86813;
}

.analytics-card--sky .analytics-icon,
.analytics-progress-bar--sky {
  background: #edf6ff;
  color: #3b73a3;
}

.analytics-card--emerald .analytics-icon,
.analytics-progress-bar--emerald {
  background: #eaf8f0;
  color: #2f7d55;
}

.analytics-card--violet .analytics-icon,
.analytics-progress-bar--violet {
  background: #f3f0ff;
  color: #6951b8;
}

.analytics-card--slate .analytics-icon,
.analytics-progress-bar--slate {
  background: #f1f5f9;
  color: #475569;
}

.analytics-columns {
  display: grid;
  gap: 1rem;
}

.analytics-panel {
  padding: 1.2rem;
}

.analytics-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.analytics-panel-title {
  margin-top: 0.25rem;
  color: #111827;
  font-size: 1.05rem;
  font-weight: 800;
}

.analytics-progress-list,
.analytics-check-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.25rem;
}

.analytics-progress-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: #1f2937;
  font-size: 0.88rem;
  font-weight: 700;
}

.analytics-progress-track {
  overflow: hidden;
  height: 0.6rem;
  margin-top: 0.55rem;
  border-radius: 999px;
  background: #f1f5f9;
}

.analytics-progress-bar {
  display: block;
  height: 100%;
  min-width: 0.25rem;
  border-radius: inherit;
}

.analytics-progress-bar--rose {
  background: #bd574b;
}

.analytics-progress-bar--amber {
  background: #d58a25;
}

.analytics-progress-bar--sky {
  background: #3b73a3;
}

.analytics-progress-bar--emerald {
  background: #2f7d55;
}

.analytics-progress-bar--violet {
  background: #6951b8;
}

.analytics-progress-bar--slate {
  background: #475569;
}

.analytics-check {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.9rem;
  align-items: center;
  border: 1px solid #f1f5f9;
  border-radius: 0.85rem;
  padding: 0.9rem;
}

.analytics-check > span {
  display: flex;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.8rem;
}

.analytics-check strong {
  color: #111827;
  font-size: 1.35rem;
}

.analytics-check h3 {
  color: #1f2937;
  font-size: 0.9rem;
  font-weight: 700;
}

.analytics-check--amber > span {
  background: #fff7df;
  color: #a86813;
}

.analytics-check--slate > span {
  background: #f1f5f9;
  color: #475569;
}

.analytics-check--violet > span {
  background: #f3f0ff;
  color: #6951b8;
}

.analytics-empty {
  display: flex;
  min-height: 14rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.analytics-empty i {
  color: #9d554b;
  font-size: 2rem;
}

.analytics-empty h2 {
  margin-top: 1rem;
  color: #111827;
  font-size: 1.15rem;
  font-weight: 800;
}

.analytics-empty p {
  margin-top: 0.35rem;
  color: #6b7280;
  font-size: 0.88rem;
}

.analytics-empty--compact {
  min-height: 10rem;
  box-shadow: none;
}

@media (min-width: 768px) {
  .analytics-header {
    flex-direction: row;
    align-items: flex-end;
  }
}

@media (min-width: 1024px) {
  .analytics-columns {
    grid-template-columns: minmax(0, 1.1fr) minmax(20rem, 0.9fr);
  }
}
</style>
