<script setup lang="ts">
import AdoptionRequestDetailsModal from '@/components/Modals/AdoptionRequestDetailsModal.vue'
import type { AdoptionRequest } from '@/models/AdoptionRequest'
import { RouteNames } from '@/router/routeNames'
import { AdoptionRequestService } from '@/services/adoptionRequestService'
import notificationService from '@/services/notificationService'
import { DateUtils } from '@/utils/dateUtils'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const loading = ref(false)
const dialogVisible = ref(false)
const requests = ref<AdoptionRequest[]>([])
const selectedRequest = ref<AdoptionRequest | null>(null)

const sortedRequests = computed(() =>
  [...requests.value].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  ),
)

const statusSeverity = (status: string) => {
  switch (status) {
    case 'approved':
      return 'success'
    case 'rejected':
      return 'danger'
    case 'in_review':
      return 'info'
    case 'pending':
    default:
      return 'warn'
  }
}

const statusLabel = (status: string) => {
  switch (status) {
    case 'approved':
      return t('adoptionRequest.status.approved')
    case 'rejected':
      return t('adoptionRequest.status.rejected')
    case 'in_review':
      return t('adoptionRequest.status.in_review')
    case 'pending':
    default:
      return t('adoptionRequest.status.pending')
  }
}

const getAnimalLabel = (request: AdoptionRequest) =>
  request.catSheet?.cats?.map((cat) => cat.name).join(' & ') || request.animalName

const loadRequests = async () => {
  try {
    loading.value = true
    const response = await AdoptionRequestService.getAdoptionRequests()
    requests.value = response.data.data
  } catch {
    notificationService.showError(t('error'), t('adoptionRequest.loadError'))
  } finally {
    loading.value = false
  }
}

const openRequestDialog = async (documentId: string) => {
  try {
    loading.value = true
    const response = await AdoptionRequestService.getAdoptionRequest(documentId)
    selectedRequest.value = response.data.data
    dialogVisible.value = true
  } catch {
    notificationService.showError(t('error'), t('adoptionRequest.user.detailError'))
  } finally {
    loading.value = false
  }
}

const closeDialog = () => {
  dialogVisible.value = false
  selectedRequest.value = null
}

onMounted(loadRequests)
</script>

<template>
  <div class="flex w-full flex-col">
    <!-- HERO -->
    <section class="relative w-full overflow-hidden bg-[var(--scf-bg)] px-4 pb-10 pt-14 sm:px-6 md:px-[60px] md:pb-14">
      <div
        class="pointer-events-none absolute -right-20 -top-32 h-[300px] w-[300px] rounded-full bg-[var(--scf-accent-soft)]"
      ></div>
      <div class="page-shell relative max-w-2xl space-y-5">
        <span class="eyebrow">{{ $t('adoptionRequest.user.navLink') }}</span>
        <h1 class="display-font text-4xl font-semibold leading-tight md:text-6xl">
          {{ $t('adoptionRequest.user.title') }}
        </h1>
        <p class="max-w-xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
          {{ $t('adoptionRequest.user.subtitle') }}
        </p>
      </div>
    </section>

    <!-- LIST -->
    <section class="w-full bg-[var(--scf-bg)] px-4 pb-16 sm:px-6 md:px-[60px]">
      <div class="page-shell">
        <div class="py-6">
          <Button
            as="router-link"
            :to="{ name: RouteNames.ADOPT }"
            :label="$t('adoptionRequest.user.backToAdopt')"
            icon="pi pi-arrow-left"
            rounded
            outlined
            severity="secondary"
            size="small"
            class="w-full !border-[var(--scf-line)] !text-[var(--scf-ink)] sm:w-auto"
          />
        </div>

        <section class="rounded-[26px] bg-white p-6">
          <p class="text-sm leading-relaxed text-[var(--scf-text)]">
            {{ $t('adoptionRequest.user.helper') }}
          </p>
        </section>

        <div v-if="loading" class="mt-6 space-y-4">
          <div v-for="index in 3" :key="index" class="rounded-[26px] bg-white p-6">
            <div class="animate-pulse space-y-4">
              <div class="h-5 w-1/3 rounded bg-[var(--scf-bg)]"></div>
              <div class="h-4 w-1/4 rounded bg-[var(--scf-bg)]"></div>
              <div class="h-10 w-32 rounded bg-[var(--scf-bg)]"></div>
            </div>
          </div>
        </div>

        <div
          v-else-if="sortedRequests.length === 0"
          class="mt-6 flex flex-col items-center justify-center gap-4 rounded-[26px] border border-dashed border-[var(--scf-line)] bg-white px-6 py-16 text-center"
        >
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--scf-accent-soft)]">
            <i class="pi pi-inbox text-3xl text-[var(--scf-accent-dark)]"></i>
          </div>
          <h2 class="display-font text-xl font-semibold text-[var(--scf-ink)]">
            {{ $t('adoptionRequest.user.emptyTitle') }}
          </h2>
          <p class="max-w-md text-sm text-[var(--scf-muted)]">
            {{ $t('adoptionRequest.user.emptySubtitle') }}
          </p>
        </div>

        <div v-else class="mt-6 space-y-4">
          <article
            v-for="request in sortedRequests"
            :key="request.documentId"
            class="rounded-[26px] bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div class="space-y-2">
                <h2 class="display-font text-xl font-semibold text-[var(--scf-ink)]">
                  {{ getAnimalLabel(request) }}
                </h2>
                <p class="text-sm text-[var(--scf-muted)]">
                  {{ $t('adoptionRequest.user.submittedAt', { date: DateUtils.formatDate(request.createdAt) }) }}
                </p>
                <p class="text-sm text-[var(--scf-muted)]">
                  {{ $t('adoptionRequest.user.requester', { name: `${request.firstName} ${request.lastName}` }) }}
                </p>
              </div>

              <div class="flex flex-col items-start gap-3 md:items-end">
                <Tag
                  rounded
                  :value="statusLabel(request.processingStatus)"
                  :severity="statusSeverity(request.processingStatus)"
                />
                <Button
                  :label="$t('adoptionRequest.user.openDetail')"
                  icon="pi pi-eye"
                  rounded
                  outlined
                  size="small"
                  class="w-full !border-[var(--scf-line)] !text-[var(--scf-ink)] sm:w-auto"
                  @click="openRequestDialog(request.documentId)"
                />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <AdoptionRequestDetailsModal
      :visible="dialogVisible"
      :request="selectedRequest"
      @update:visible="closeDialog"
    />
  </div>
</template>
