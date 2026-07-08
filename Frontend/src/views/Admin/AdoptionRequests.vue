<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import notificationService from '@/services/notificationService'
import AdoptionRequestForm from '@/components/Forms/AdoptionRequestForm.vue'
import type { AdoptionRequest, AdoptionRequestFormValues } from '@/models/AdoptionRequest'
import {
  createAdoptionRequestFormFromRequest,
  createEmptyAdoptionRequestForm,
} from '@/models/AdoptionRequest'
import { AdoptionRequestService } from '@/services/adoptionRequestService'

const { t } = useI18n()

const loading = ref(false)
const dialogVisible = ref(false)
const requests = ref<AdoptionRequest[]>([])
const search = ref('')
const statusFilter = ref<string | null>(null)
const selectedRequest = ref<AdoptionRequest | null>(null)
const saving = ref(false)
const editing = ref(false)
const errors = ref<Record<string, string>>({})
const form = reactive<AdoptionRequestFormValues>(createEmptyAdoptionRequestForm())

const statusOptions = [
  { label: t('adoptionRequest.filters.all'), value: null },
  { label: t('adoptionRequest.status.pending'), value: 'pending' },
  { label: t('adoptionRequest.status.in_review'), value: 'in_review' },
  { label: t('adoptionRequest.status.approved'), value: 'approved' },
  { label: t('adoptionRequest.status.rejected'), value: 'rejected' },
]

const filteredRequests = computed(() => {
  const q = search.value.trim().toLowerCase()

  return requests.value.filter((request) => {
    const matchesStatus = !statusFilter.value || request.processingStatus === statusFilter.value
    const matchesSearch =
      !q ||
      request.animalName.toLowerCase().includes(q) ||
      request.firstName.toLowerCase().includes(q) ||
      request.lastName.toLowerCase().includes(q) ||
      request.email.toLowerCase().includes(q) ||
      request.catSheet?.cats?.some((cat) => cat.name.toLowerCase().includes(q))

    return matchesStatus && matchesSearch
  })
})

const pendingCount = computed(
  () => requests.value.filter((request) => request.processingStatus === 'pending').length,
)

const inReviewCount = computed(
  () => requests.value.filter((request) => request.processingStatus === 'in_review').length,
)

const formatDate = (value: string | null) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('fr-FR')
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

const hydrateForm = (request: AdoptionRequest) => {
  Object.assign(form, createAdoptionRequestFormFromRequest(request))
}

const resetForm = () => {
  Object.assign(form, createEmptyAdoptionRequestForm())
  errors.value = {}
  selectedRequest.value = null
  editing.value = false
}

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

const openRequestDialog = (request: AdoptionRequest) => {
  selectedRequest.value = request
  hydrateForm(request)
  dialogVisible.value = true
  editing.value = false
}

const closeDialog = () => {
  dialogVisible.value = false
  resetForm()
}

const validateForm = () => {
  const nextErrors: Record<string, string> = {}

  if (!form.animalName.trim()) nextErrors.animalName = t('requiredInputError')
  if (!form.firstName.trim()) nextErrors.firstName = t('requiredInputError')
  if (!form.lastName.trim()) nextErrors.lastName = t('requiredInputError')
  if (!form.birthDate) nextErrors.birthDate = t('requiredInputError')
  if (!form.email.trim()) nextErrors.email = t('requiredInputError')
  if (!form.processingStatus) nextErrors.processingStatus = t('requiredInputError')

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

const saveRequest = async () => {
  if (!selectedRequest.value) return
  if (!validateForm()) return

  try {
    saving.value = true
    await AdoptionRequestService.updateAdoptionRequest(selectedRequest.value.documentId, form)
    notificationService.showSuccess(t('success'), t('adoptionRequest.updateSuccess'))
    closeDialog()
    await loadRequests()
  } catch {
    notificationService.showError(t('error'), t('adoptionRequest.updateError'))
  } finally {
    saving.value = false
  }
}

const updateProcessingStatus = async (status: 'approved' | 'rejected') => {
  if (!selectedRequest.value) return

  try {
    saving.value = true
    form.processingStatus = status
    await AdoptionRequestService.updateAdoptionRequest(selectedRequest.value.documentId, form)
    notificationService.showSuccess(t('success'), t(`adoptionRequest.${status}Success`))
    closeDialog()
    await loadRequests()
  } catch {
    notificationService.showError(t('error'), t('adoptionRequest.updateError'))
  } finally {
    saving.value = false
  }
}

onMounted(loadRequests)
</script>

<template>
  <div class="flex flex-col gap-6">
    <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-2">
          <p class="text-sm font-medium uppercase tracking-wide text-primary-600">
            {{ $t('admin.adoptionRequests.nav') }}
          </p>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ $t('admin.adoptionRequests.title') }}
          </h1>
          <p class="max-w-2xl text-sm text-gray-500">
            {{ $t('admin.adoptionRequests.subtitle') }}
          </p>
        </div>

        <Button
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          v-tooltip.top="$t('refresh')"
          @click="loadRequests"
        />
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-surface-200 bg-surface-50 p-4">
          <p class="text-sm font-medium text-surface-600">{{ $t('admin.adoptionRequests.stats.total') }}</p>
          <p class="mt-2 text-3xl font-bold text-surface-900">{{ requests.length }}</p>
        </div>
        <div class="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p class="text-sm font-medium text-amber-700">{{ $t('adoptionRequest.status.pending') }}</p>
          <p class="mt-2 text-3xl font-bold text-amber-900">{{ pendingCount }}</p>
        </div>
        <div class="rounded-xl border border-sky-200 bg-sky-50 p-4">
          <p class="text-sm font-medium text-sky-700">{{ $t('adoptionRequest.status.in_review') }}</p>
          <p class="mt-2 text-3xl font-bold text-sky-900">{{ inReviewCount }}</p>
        </div>
      </div>
    </section>

    <Card>
      <template #title>
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <span>{{ $t('admin.adoptionRequests.listTitle') }}</span>
          <div class="flex flex-col gap-3 md:flex-row">
            <InputText v-model="search" :placeholder="$t('admin.adoptionRequests.searchPlaceholder')" />
            <Select
              v-model="statusFilter"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('admin.adoptionRequests.statusPlaceholder')"
              class="min-w-52"
            />
          </div>
        </div>
      </template>

      <template #content>
        <DataTable
          :value="filteredRequests"
          :loading="loading"
          paginator
          :rows="8"
          responsiveLayout="scroll"
          tableStyle="min-width: 72rem"
        >
          <template #empty>
            <div class="py-6 text-center text-gray-500">
              {{ $t('admin.adoptionRequests.empty') }}
            </div>
          </template>

          <Column field="animalName" :header="$t('admin.adoptionRequests.columns.animal')">
            <template #body="slotProps">
              <div class="flex flex-col">
                <span class="font-medium text-gray-900">{{ slotProps.data.animalName }}</span>
                <span class="text-xs text-gray-500">
                  {{ slotProps.data.catSheet?.cats?.map((cat: any) => cat.name).join(' & ') || '-' }}
                </span>
              </div>
            </template>
          </Column>

          <Column :header="$t('admin.adoptionRequests.columns.requester')">
            <template #body="slotProps">
              <div class="flex flex-col">
                <span>{{ slotProps.data.firstName }} {{ slotProps.data.lastName }}</span>
                <span class="text-xs text-gray-500">{{ slotProps.data.email }}</span>
              </div>
            </template>
          </Column>

          <Column :header="$t('admin.adoptionRequests.columns.contacts')">
            <template #body="slotProps">
              <div class="flex flex-col text-sm">
                <span>{{ $t('admin.adoptionRequests.mainVolunteer') }} {{ slotProps.data.catSheet?.linkedVolunteer?.username || '-' }}</span>
                <span class="text-gray-500">
                  {{ $t('admin.adoptionRequests.backupVolunteer') }} {{ slotProps.data.catSheet?.backupVolunteer?.username || '-' }}
                </span>
              </div>
            </template>
          </Column>

          <Column field="createdAt" :header="$t('admin.adoptionRequests.columns.submittedAt')">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.createdAt) }}
            </template>
          </Column>

          <Column field="processingStatus" :header="$t('admin.adoptionRequests.columns.status')">
            <template #body="slotProps">
              <Tag
                rounded
                :value="statusLabel(slotProps.data.processingStatus)"
                :severity="statusSeverity(slotProps.data.processingStatus)"
              />
            </template>
          </Column>

          <Column :header="$t('admin.adoptionRequests.columns.actions')">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-eye"
                  size="small"
                  severity="info"
                  outlined
                  @click="openRequestDialog(slotProps.data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog
      v-model:visible="dialogVisible"
      modal
      :header="$t('admin.adoptionRequests.dialog.title')"
      :style="{ width: '70rem' }"
    >
      <template #header>
        <div class="flex w-full items-center justify-between gap-4 pr-4">
          <div class="flex flex-col">
            <span class="text-lg font-semibold text-surface-900">{{ $t('admin.adoptionRequests.dialog.title') }}</span>
            <span v-if="selectedRequest" class="text-sm text-surface-500">
              {{ selectedRequest.firstName }} {{ selectedRequest.lastName }} · {{ selectedRequest.animalName }}
            </span>
          </div>
          <Button
            icon="pi pi-pencil"
            severity="secondary"
            outlined
            size="small"
            :label="editing ? $t('admin.adoptionRequests.dialog.editing') : $t('update')"
            @click="editing = !editing"
          />
        </div>
      </template>

      <div class="mb-4 flex items-center justify-between rounded-xl bg-surface-50 p-4">
        <div class="text-sm text-surface-600">
          <span class="font-medium text-surface-900">{{ $t('admin.adoptionRequests.dialog.currentStatus') }}</span>
          {{ selectedRequest ? statusLabel(selectedRequest.processingStatus) : '-' }}
        </div>
        <Tag
          v-if="selectedRequest"
          rounded
          :value="statusLabel(selectedRequest.processingStatus)"
          :severity="statusSeverity(selectedRequest.processingStatus)"
        />
      </div>

      <AdoptionRequestForm
        v-model="form"
        :errors="errors"
        :showStatus="editing"
        :disabled="!editing"
      />

      <template #footer>
        <Button :label="$t('cancel')" text @click="closeDialog" />
        <Button
          v-if="editing"
          :label="$t('save')"
          icon="pi pi-check"
          severity="secondary"
          :loading="saving"
          @click="saveRequest"
        />
        <Button
          :label="$t('refuse')"
          icon="pi pi-times"
          severity="danger"
          :loading="saving"
          @click="updateProcessingStatus('rejected')"
        />
        <Button
          :label="$t('accept')"
          icon="pi pi-check"
          :loading="saving"
          @click="updateProcessingStatus('approved')"
        />
      </template>
    </Dialog>
  </div>
</template>
