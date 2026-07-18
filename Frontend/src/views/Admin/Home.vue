<script setup lang="ts">
import type {
  DashboardPriority,
  DashboardRecentRequest,
  DashboardSummary,
} from '@/models/Dashboard'
import type { AdoptionProcessingStatus } from '@/models/AdoptionRequest'
import { RouteNames } from '@/router/routeNames'
import { DashboardService } from '@/services/dashboardService'
import notificationService from '@/services/notificationService'
import { useAuthStore } from '@/stores/authentication'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const authStore = useAuthStore()

const dashboard = ref<DashboardSummary | null>(null)
const loading = ref(true)
const refreshing = ref(false)
const loadError = ref(false)

const requestWorkload = computed(() =>
  dashboard.value
    ? dashboard.value.adoptionRequests.pending + dashboard.value.adoptionRequests.inReview
    : 0,
)

const maxTrendValue = computed(() =>
  Math.max(1, ...(dashboard.value?.requestTrend.map((point) => point.submitted) ?? [0])),
)

const trendTotal = computed(
  () => dashboard.value?.requestTrend.reduce((sum, point) => sum + point.submitted, 0) ?? 0,
)

const kpis = computed(() => {
  if (!dashboard.value) return []

  const absenceValue = dashboard.value.capabilities.canManageAbsences
    ? dashboard.value.absences.pendingApproval
    : dashboard.value.absences.upcomingMine
  const absenceTitle = dashboard.value.capabilities.canManageAbsences
    ? t('admin.dashboard.kpis.absencesToReview')
    : t('admin.dashboard.kpis.upcomingAbsences')

  return [
    {
      title:
        dashboard.value.scope === 'global'
          ? t('admin.dashboard.kpis.adoptableCats')
          : t('admin.dashboard.kpis.followedCats'),
      value: dashboard.value.cats.adoptable,
      detail: t('admin.dashboard.kpis.catsTotal', { count: dashboard.value.cats.total }),
      icon: 'pi pi-heart',
      tone: 'coral',
      routeName: dashboard.value.capabilities.canViewTeamStats ? RouteNames.DASHBOARD_CATS : null,
    },
    {
      title: t('admin.dashboard.kpis.requestsToProcess'),
      value: requestWorkload.value,
      detail: dashboard.value.adoptionRequests.overdue
        ? t('admin.dashboard.kpis.overdueRequests', {
            count: dashboard.value.adoptionRequests.overdue,
          })
        : t('admin.dashboard.kpis.noOverdueRequest'),
      icon: 'pi pi-inbox',
      tone: 'amber',
      routeName: RouteNames.DASHBOARD_ADOPTION_REQUESTS,
    },
    {
      title: t('admin.dashboard.kpis.activeConversations'),
      value: dashboard.value.conversations.activeLast7Days,
      detail: t('admin.dashboard.kpis.conversationsTotal', {
        count: dashboard.value.conversations.total,
      }),
      icon: 'pi pi-comments',
      tone: 'blue',
      routeName: RouteNames.DASHBOARD_CONVERSATIONS,
    },
    {
      title: absenceTitle,
      value: absenceValue,
      detail: t('admin.dashboard.kpis.activeAbsences', {
        count: dashboard.value.absences.activeToday,
      }),
      icon: 'pi pi-calendar-times',
      tone: 'green',
      routeName: RouteNames.DASHBOARD_ABSENCES,
    },
  ]
})

const catBreakdown = computed(() => {
  if (!dashboard.value) return []
  return [
    {
      label: t('admin.dashboard.cats.refuge'),
      value: dashboard.value.cats.refuge,
      color: 'bg-rose-400',
    },
    {
      label: t('admin.dashboard.cats.foster'),
      value: dashboard.value.cats.foster,
      color: 'bg-amber-400',
    },
    {
      label: t('admin.dashboard.cats.inCare'),
      value: dashboard.value.cats.inCare,
      color: 'bg-sky-400',
    },
    {
      label: t('admin.dashboard.cats.adopted'),
      value: dashboard.value.cats.adopted,
      color: 'bg-emerald-500',
    },
  ]
})

const adminInsights = computed(() => {
  if (!dashboard.value?.team || !dashboard.value.contentHealth) return []
  return [
    {
      label: t('admin.dashboard.insights.activeVolunteers'),
      value: dashboard.value.team.activeVolunteers,
      icon: 'pi pi-users',
    },
    {
      label: t('admin.dashboard.insights.adopters'),
      value: dashboard.value.team.adopters,
      icon: 'pi pi-user-plus',
    },
    {
      label: t('admin.dashboard.insights.blockedUsers'),
      value: dashboard.value.team.blockedUsers,
      icon: 'pi pi-ban',
    },
    {
      label: t('admin.dashboard.insights.draftPosts'),
      value: dashboard.value.contentHealth.draftBlogPosts,
      icon: 'pi pi-file-edit',
    },
    {
      label: t('admin.dashboard.insights.withoutMedia'),
      value: dashboard.value.contentHealth.catSheetsWithoutMedia,
      icon: 'pi pi-image',
    },
    {
      label: t('admin.dashboard.insights.withoutBackup'),
      value: dashboard.value.contentHealth.catSheetsWithoutBackup,
      icon: 'pi pi-user-minus',
    },
  ]
})

const loadDashboard = async () => {
  const isRefresh = dashboard.value !== null
  if (isRefresh) refreshing.value = true
  else loading.value = true

  try {
    const response = await DashboardService.getSummary()
    dashboard.value = response.data.data
    loadError.value = false
  } catch {
    if (isRefresh) {
      notificationService.showError(t('error'), t('admin.dashboard.refreshError'))
    } else {
      loadError.value = true
    }
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

const formatShortDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(
    new Date(`${value}T12:00:00`),
  )

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(value),
  )

const getCatLabel = (item: { catNames: string[]; fallbackAnimalName: string }) =>
  item.catNames.length ? item.catNames.join(' & ') : item.fallbackAnimalName

const getStatusLabel = (status: AdoptionProcessingStatus) => t(`adoptionRequest.status.${status}`)

const getStatusSeverity = (status: AdoptionProcessingStatus) => {
  if (status === 'approved') return 'success'
  if (status === 'rejected') return 'danger'
  if (status === 'in_review') return 'info'
  return 'warn'
}

const getPriorityTitle = (priority: DashboardPriority) => {
  if (priority.type === 'absence') {
    return t('admin.dashboard.priorities.absenceTitle', {
      name: priority.volunteerName ?? t('admin.dashboard.priorities.unknownVolunteer'),
    })
  }
  return getCatLabel(priority)
}

const getPriorityDetail = (priority: DashboardPriority) => {
  if (priority.type === 'absence') {
    return t('admin.dashboard.priorities.absenceDate', { date: formatDate(priority.startDate) })
  }
  if (priority.overdue) {
    return t('admin.dashboard.priorities.overdueSince', { date: formatDate(priority.createdAt) })
  }
  return t('admin.dashboard.priorities.requestSince', { date: formatDate(priority.createdAt) })
}

const getPriorityRoute = (priority: DashboardPriority) =>
  priority.type === 'absence'
    ? RouteNames.DASHBOARD_ABSENCES
    : RouteNames.DASHBOARD_ADOPTION_REQUESTS

const getRequestVolunteer = (request: DashboardRecentRequest) =>
  request.linkedVolunteerName ?? t('admin.dashboard.requests.unassigned')

onMounted(loadDashboard)
</script>

<template>
  <div class="dashboard-page">
    <template v-if="loading">
      <section class="dashboard-hero dashboard-skeleton h-48"></section>
      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="index in 4" :key="index" class="dashboard-panel h-40 animate-pulse"></div>
      </section>
      <section class="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div class="dashboard-panel h-80 animate-pulse"></div>
        <div class="dashboard-panel h-80 animate-pulse"></div>
      </section>
    </template>

    <section
      v-else-if="loadError"
      class="dashboard-panel flex min-h-80 flex-col items-center justify-center text-center"
    >
      <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <i class="pi pi-exclamation-triangle text-2xl"></i>
      </div>
      <h1 class="mt-5 text-xl font-bold text-gray-900">
        {{ $t('admin.dashboard.loadErrorTitle') }}
      </h1>
      <p class="mt-2 max-w-md text-sm leading-6 text-gray-500">
        {{ $t('admin.dashboard.loadErrorText') }}
      </p>
      <Button
        class="mt-6"
        :label="$t('retry')"
        icon="pi pi-refresh"
        :loading="loading"
        @click="loadDashboard"
      />
    </section>

    <template v-else-if="dashboard">
      <section class="dashboard-hero">
        <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div class="mb-4 flex flex-wrap items-center gap-2">
              <span class="dashboard-scope">
                <i class="pi pi-circle-fill text-[0.45rem]"></i>
                {{
                  dashboard.scope === 'global'
                    ? $t('admin.dashboard.globalScope')
                    : $t('admin.dashboard.assignedScope')
                }}
              </span>
            </div>
            <p class="text-sm font-semibold uppercase tracking-[0.16em] text-white/65">
              {{ $t('admin.dashboard.eyebrow') }}
            </p>
            <h1 class="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {{
                $t('admin.dashboard.greeting', {
                  name: authStore.getUsername || $t('admin.dashboard.team'),
                })
              }}
            </h1>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              {{ $t('admin.dashboard.subtitle') }}
            </p>
          </div>
          <div
            class="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end"
          >
            <span class="text-xs text-white/60">
              {{ $t('admin.dashboard.updatedAt', { date: formatDateTime(dashboard.generatedAt) }) }}
            </span>
            <Button
              :label="$t('refresh')"
              icon="pi pi-refresh"
              outlined
              :loading="refreshing"
              class="dashboard-refresh"
              @click="loadDashboard"
            />
          </div>
        </div>
      </section>

      <section
        class="grid gap-4 sm:grid-cols-2"
        :class="kpis.length === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'"
      >
        <component
          v-for="kpi in kpis"
          :key="kpi.title"
          :is="kpi.routeName ? 'router-link' : 'article'"
          v-bind="kpi.routeName ? { to: { name: kpi.routeName } } : {}"
          class="dashboard-kpi"
          :class="[{ group: kpi.routeName }, `dashboard-kpi--${kpi.tone}`]"
        >
          <div class="flex items-start justify-between gap-4">
            <span class="dashboard-kpi-icon"><i :class="kpi.icon"></i></span>
            <i
              v-if="kpi.routeName"
              class="pi pi-arrow-up-right text-xs text-gray-300 transition group-hover:text-gray-600"
            ></i>
          </div>
          <p class="mt-7 text-4xl font-bold tracking-tight text-gray-950">{{ kpi.value }}</p>
          <h2 class="mt-1 text-sm font-semibold text-gray-800">{{ kpi.title }}</h2>
          <p class="mt-2 text-xs leading-5 text-gray-500">{{ kpi.detail }}</p>
        </component>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
        <article class="dashboard-panel min-w-0">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="dashboard-section-label">{{ $t('admin.dashboard.trend.eyebrow') }}</p>
              <h2 class="dashboard-section-title">{{ $t('admin.dashboard.trend.title') }}</h2>
            </div>
            <div class="rounded-xl bg-gray-50 px-3 py-2 text-right">
              <p class="text-xl font-bold text-gray-900">{{ trendTotal }}</p>
              <p class="text-[0.7rem] text-gray-500">{{ $t('admin.dashboard.trend.total') }}</p>
            </div>
          </div>

          <div
            class="mt-8 overflow-x-auto pb-2"
            role="img"
            :aria-label="$t('admin.dashboard.trend.ariaLabel', { count: trendTotal })"
          >
            <div class="flex h-48 min-w-[42rem] items-end gap-1.5 border-b border-gray-200 px-1">
              <div
                v-for="(point, index) in dashboard.requestTrend"
                :key="point.date"
                class="group relative flex h-full min-w-3 flex-1 items-end"
                :title="
                  $t('admin.dashboard.trend.point', {
                    date: formatShortDate(point.date),
                    count: point.submitted,
                  })
                "
              >
                <div
                  class="w-full rounded-t-md bg-gradient-to-t from-rose-500 to-orange-300 transition-all group-hover:from-rose-600 group-hover:to-orange-400"
                  :class="point.submitted === 0 ? 'min-h-px opacity-20' : 'min-h-2'"
                  :style="{ height: `${Math.max(1, (point.submitted / maxTrendValue) * 100)}%` }"
                ></div>
                <span
                  v-if="index % 5 === 0 || index === dashboard.requestTrend.length - 1"
                  class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.65rem] text-gray-400"
                >
                  {{ formatShortDate(point.date) }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-10 border-t border-gray-100 pt-5">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <p class="dashboard-section-label">{{ $t('admin.dashboard.cats.eyebrow') }}</p>
                <h3 class="text-base font-bold text-gray-900">
                  {{ $t('admin.dashboard.cats.title') }}
                </h3>
              </div>
              <span class="text-sm font-semibold text-gray-500">{{ dashboard.cats.total }}</span>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <div
                v-for="item in catBreakdown"
                :key="item.label"
                class="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5"
              >
                <span class="h-2.5 w-2.5 rounded-full" :class="item.color"></span>
                <span class="min-w-0 flex-1 truncate text-xs font-medium text-gray-600">{{
                  item.label
                }}</span>
                <span class="text-sm font-bold text-gray-900">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </article>

        <article class="dashboard-panel">
          <p class="dashboard-section-label">{{ $t('admin.dashboard.priorities.eyebrow') }}</p>
          <h2 class="dashboard-section-title">{{ $t('admin.dashboard.priorities.title') }}</h2>
          <p class="mt-2 text-xs leading-5 text-gray-500">
            {{ $t('admin.dashboard.priorities.subtitle') }}
          </p>

          <div v-if="dashboard.priorities.length" class="mt-6 space-y-2">
            <router-link
              v-for="priority in dashboard.priorities"
              :key="`${priority.type}-${priority.documentId}`"
              :to="{ name: getPriorityRoute(priority) }"
              class="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-gray-200 hover:bg-gray-50"
            >
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                :class="
                  priority.type === 'absence'
                    ? 'bg-emerald-50 text-emerald-700'
                    : priority.overdue
                      ? 'bg-red-50 text-red-600'
                      : 'bg-amber-50 text-amber-700'
                "
              >
                <i
                  :class="priority.type === 'absence' ? 'pi pi-calendar-times' : 'pi pi-inbox'"
                ></i>
              </span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-semibold text-gray-900">{{
                  getPriorityTitle(priority)
                }}</span>
                <span class="mt-0.5 block truncate text-xs text-gray-500">{{
                  getPriorityDetail(priority)
                }}</span>
              </span>
              <i
                class="pi pi-chevron-right text-xs text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-600"
              ></i>
            </router-link>
          </div>

          <div
            v-else
            class="mt-8 flex flex-col items-center rounded-2xl bg-emerald-50/70 px-5 py-8 text-center"
          >
            <span
              class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm"
            >
              <i class="pi pi-check text-xl"></i>
            </span>
            <p class="mt-4 text-sm font-semibold text-emerald-950">
              {{ $t('admin.dashboard.priorities.emptyTitle') }}
            </p>
            <p class="mt-1 text-xs leading-5 text-emerald-800/70">
              {{ $t('admin.dashboard.priorities.emptyText') }}
            </p>
          </div>
        </article>
      </section>

      <section v-if="adminInsights.length" class="dashboard-panel">
        <div>
          <p class="dashboard-section-label">{{ $t('admin.dashboard.insights.eyebrow') }}</p>
          <h2 class="dashboard-section-title">{{ $t('admin.dashboard.insights.title') }}</h2>
        </div>
        <div
          class="mt-6 grid gap-px overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 sm:grid-cols-2 xl:grid-cols-3"
        >
          <div
            v-for="insight in adminInsights"
            :key="insight.label"
            class="flex items-center gap-4 bg-white p-4"
          >
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500"
            >
              <i :class="insight.icon"></i>
            </span>
            <span class="min-w-0">
              <span class="block text-xl font-bold text-gray-950">{{ insight.value }}</span>
              <span class="block truncate text-xs text-gray-500">{{ insight.label }}</span>
            </span>
          </div>
        </div>
      </section>

      <section class="dashboard-panel">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="dashboard-section-label">{{ $t('admin.dashboard.requests.eyebrow') }}</p>
            <h2 class="dashboard-section-title">{{ $t('admin.dashboard.requests.title') }}</h2>
            <p class="mt-2 text-xs leading-5 text-gray-500">
              {{ $t('admin.dashboard.requests.subtitle') }}
            </p>
          </div>
          <Button
            as="router-link"
            :to="{ name: RouteNames.DASHBOARD_ADOPTION_REQUESTS }"
            :label="$t('admin.dashboard.requests.viewAll')"
            icon="pi pi-arrow-right"
            icon-pos="right"
            text
            size="small"
          />
        </div>

        <div v-if="dashboard.recentRequests.length" class="mt-6 divide-y divide-gray-100">
          <article
            v-for="request in dashboard.recentRequests"
            :key="request.documentId"
            class="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-6"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-gray-900">{{ getCatLabel(request) }}</p>
              <p class="mt-1 truncate text-xs text-gray-500">
                {{
                  $t('admin.dashboard.requests.responsible', { name: getRequestVolunteer(request) })
                }}
              </p>
            </div>
            <p class="text-xs text-gray-500">{{ formatDate(request.createdAt) }}</p>
            <Tag
              :value="getStatusLabel(request.status)"
              :severity="getStatusSeverity(request.status)"
              rounded
            />
          </article>
        </div>
        <div
          v-else
          class="mt-6 rounded-2xl border border-dashed border-gray-200 px-5 py-10 text-center text-sm text-gray-500"
        >
          {{ $t('admin.dashboard.requests.empty') }}
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-hero {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  padding: 1.5rem;
  background:
    radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.18), transparent 28%),
    linear-gradient(125deg, #202a39 0%, #39465a 58%, #9d554b 135%);
  box-shadow: 0 20px 50px rgba(31, 41, 55, 0.14);
}

.dashboard-hero::after {
  content: '';
  position: absolute;
  right: -4rem;
  bottom: -7rem;
  width: 18rem;
  height: 18rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
}

.dashboard-scope {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
  padding: 0.4rem 0.75rem;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.7rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.dashboard-refresh {
  border-color: rgba(255, 255, 255, 0.28) !important;
  color: white !important;
}

.dashboard-refresh:deep(.p-button-label),
.dashboard-refresh:deep(.p-button-icon) {
  color: white;
}

.dashboard-panel,
.dashboard-kpi {
  border: 1px solid rgb(243 244 246);
  border-radius: 1.25rem;
  background: white;
  padding: 1.25rem;
  box-shadow: 0 8px 30px rgba(31, 41, 55, 0.05);
}

.dashboard-kpi {
  position: relative;
  overflow: hidden;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.dashboard-kpi:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 36px rgba(31, 41, 55, 0.09);
}

.dashboard-kpi::after {
  content: '';
  position: absolute;
  inset: auto -2rem -3rem auto;
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  opacity: 0.5;
}

.dashboard-kpi-icon {
  display: flex;
  width: 2.75rem;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.9rem;
}

.dashboard-kpi--coral .dashboard-kpi-icon,
.dashboard-kpi--coral::after {
  background: #fff0ed;
  color: #bd574b;
}

.dashboard-kpi--amber .dashboard-kpi-icon,
.dashboard-kpi--amber::after {
  background: #fff7df;
  color: #a86813;
}

.dashboard-kpi--blue .dashboard-kpi-icon,
.dashboard-kpi--blue::after {
  background: #edf6ff;
  color: #3b73a3;
}

.dashboard-kpi--green .dashboard-kpi-icon,
.dashboard-kpi--green::after {
  background: #eaf8f0;
  color: #2f7d55;
}

.dashboard-section-label {
  color: #9d554b;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.dashboard-section-title {
  margin-top: 0.3rem;
  color: #111827;
  font-size: 1.15rem;
  font-weight: 700;
}

.dashboard-skeleton {
  animation: pulse 1.8s ease-in-out infinite;
  background: #e5e7eb;
  box-shadow: none;
}

@media (min-width: 640px) {
  .dashboard-hero {
    padding: 2rem;
  }

  .dashboard-panel,
  .dashboard-kpi {
    padding: 1.5rem;
  }
}
</style>
