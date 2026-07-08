<script setup lang="ts">
import AdoptionRequestForm from '@/components/Forms/AdoptionRequestForm.vue'
import {
  createAdoptionRequestFormFromRequest,
  createEmptyAdoptionRequestForm,
  type AdoptionRequest,
  type AdoptionRequestFormValues,
} from '@/models/AdoptionRequest'
import { RouteNames } from '@/router/routeNames'
import { AdoptionRequestService } from '@/services/adoptionRequestService'
import notificationService from '@/services/notificationService'
import { DateUtils } from '@/utils/dateUtils'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const loading = ref(false)
const dialogVisible = ref(false)
const requests = ref<AdoptionRequest[]>([])
const selectedRequest = ref<AdoptionRequest | null>(null)
const form = reactive<AdoptionRequestFormValues>(createEmptyAdoptionRequestForm())

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
    Object.assign(form, createAdoptionRequestFormFromRequest(response.data.data))
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
  Object.assign(form, createEmptyAdoptionRequestForm())
}

onMounted(loadRequests)
</script>

<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-900">
    <div
      class="bg-gradient-to-b from-primary-50 to-surface-50 px-4 pb-8 pt-12 text-center dark:from-primary-950/20 dark:to-surface-900"
    >
      <h1 class="text-4xl font-bold tracking-tight text-surface-800 dark:text-surface-50 sm:text-5xl">
        {{ $t('adoptionRequest.user.title') }}
      </h1>
      <p class="mt-3 text-lg text-surface-500 dark:text-surface-400">
        {{ $t('adoptionRequest.user.subtitle') }}
      </p>
    </div>

    <div class="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between py-5">
        <Button
          as="router-link"
          :to="{ name: RouteNames.ADOPT }"
          :label="$t('adoptionRequest.user.backToAdopt')"
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          size="small"
        />
      </div>

      <section class="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-700 dark:bg-surface-800">
        <p class="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
          {{ $t('adoptionRequest.user.helper') }}
        </p>
      </section>

      <div v-if="loading" class="mt-6 space-y-4">
        <div
          v-for="index in 3"
          :key="index"
          class="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-700 dark:bg-surface-800"
        >
          <div class="animate-pulse space-y-4">
            <div class="h-5 w-1/3 rounded bg-surface-200 dark:bg-surface-700"></div>
            <div class="h-4 w-1/4 rounded bg-surface-100 dark:bg-surface-600"></div>
            <div class="h-10 w-32 rounded bg-surface-100 dark:bg-surface-600"></div>
          </div>
        </div>
      </div>

      <div
        v-else-if="sortedRequests.length === 0"
        class="mt-6 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-surface-300 bg-white px-6 py-16 text-center dark:border-surface-700 dark:bg-surface-800"
      >
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20">
          <i class="pi pi-inbox text-3xl text-primary-300 dark:text-primary-600"></i>
        </div>
        <h2 class="text-xl font-semibold text-surface-700 dark:text-surface-200">
          {{ $t('adoptionRequest.user.emptyTitle') }}
        </h2>
        <p class="max-w-md text-sm text-surface-500 dark:text-surface-400">
          {{ $t('adoptionRequest.user.emptySubtitle') }}
        </p>
      </div>

      <div v-else class="mt-6 space-y-4">
        <article
          v-for="request in sortedRequests"
          :key="request.documentId"
          class="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-surface-700 dark:bg-surface-800"
        >
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div class="space-y-2">
              <h2 class="text-xl font-semibold text-surface-900 dark:text-surface-50">
                {{ getAnimalLabel(request) }}
              </h2>
              <p class="text-sm text-surface-500 dark:text-surface-400">
                {{ $t('adoptionRequest.user.submittedAt', { date: DateUtils.formatDate(request.createdAt) }) }}
              </p>
              <p class="text-sm text-surface-500 dark:text-surface-400">
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
                outlined
                size="small"
                @click="openRequestDialog(request.documentId)"
              />
            </div>
          </div>
        </article>
      </div>
    </div>

    <Dialog
      v-model:visible="dialogVisible"
      modal
      :header="$t('adoptionRequest.user.detailTitle')"
      :style="{ width: '70rem' }"
    >
      <template #header>
        <div class="flex w-full flex-col gap-1 pr-4">
          <span class="text-lg font-semibold text-surface-900 dark:text-surface-50">
            {{ $t('adoptionRequest.user.detailTitle') }}
          </span>
          <span v-if="selectedRequest" class="text-sm text-surface-500 dark:text-surface-400">
            {{ getAnimalLabel(selectedRequest) }}
          </span>
        </div>
      </template>

      <div
        v-if="selectedRequest"
        class="mb-4 flex flex-col gap-3 rounded-xl bg-surface-50 p-4 text-sm text-surface-600 dark:bg-surface-900 dark:text-surface-300"
      >
        <div class="flex items-center justify-between gap-4">
          <span>{{ $t('adoptionRequest.user.currentStatus') }}</span>
          <Tag
            rounded
            :value="statusLabel(selectedRequest.processingStatus)"
            :severity="statusSeverity(selectedRequest.processingStatus)"
          />
        </div>
        <span>{{ $t('adoptionRequest.user.lastUpdate', { date: DateUtils.formatDate(selectedRequest.updatedAt) }) }}</span>
      </div>

      <AdoptionRequestForm v-model="form" :disabled="true" :showStatus="true" />

      <template #footer>
        <Button :label="$t('cancel')" text @click="closeDialog" />
      </template>
    </Dialog>
  </div>
</template>
