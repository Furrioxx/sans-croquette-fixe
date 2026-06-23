<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAbsenceStore } from '@/stores/absences'
import { useAuthStore } from '@/stores/authentication'
import { Roles } from '@/router/Roles'
import type { AbsenceStatus } from '@/models/Absence'
import { UserService } from '@/services/userService'
import type { User } from '@/models/User'
import notificationService from '@/services/notificationService'
import { useI18n } from 'vue-i18n'

const absenceStore = useAbsenceStore()
const authStore = useAuthStore()
const { t } = useI18n()

const dialogVisible = ref(false)
const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)
const reason = ref('')
const selectedVolunteerId = ref<number | null>(null)
const volunteers = ref<User[]>([])
const op = ref()
const selectedAbsenceDocumentId = ref<string | null>(null)

const isAdmin = computed(() => authStore.getUserRole === Roles.ADMIN)
const absences = computed(() => absenceStore.absences)
const loading = computed(() => absenceStore.loading)

const pendingCount = computed(
  () => absences.value.filter((absence) => absence.absence_status === 'pending').length,
)
const approvedCount = computed(
  () => absences.value.filter((absence) => absence.absence_status === 'approved').length,
)
const rejectedCount = computed(
  () => absences.value.filter((absence) => absence.absence_status === 'rejected').length,
)

onMounted(() => {
  loadData()
  if (isAdmin.value) {
    loadVolunteers()
  }
})

const loadData = async () => {
  await absenceStore.fetchAbsences()
}

const loadVolunteers = async () => {
  try {
    const response = await UserService.GetVolunteers()
    volunteers.value = response.data.data
  } catch {
    volunteers.value = []
    notificationService.showError(t('error'), t('admin.absence-create-error'))
  }
}

const openDialog = () => {
  dialogVisible.value = true
}

const resetForm = () => {
  startDate.value = null
  endDate.value = null
  reason.value = ''
  selectedVolunteerId.value = null
}

const hideDialog = () => {
  dialogVisible.value = false
  resetForm()
}

const validateAbsenceForm = () => {
  if (!startDate.value) {
    notificationService.showAlert(t('warning'), t('admin.absence-required-start-date'))
    return false
  }

  if (!endDate.value) {
    notificationService.showAlert(t('warning'), t('admin.absence-required-end-date'))
    return false
  }

  if (endDate.value < startDate.value) {
    notificationService.showAlert(t('warning'), t('admin.absence-invalid-range'))
    return false
  }

  if (isAdmin.value && !selectedVolunteerId.value) {
    notificationService.showAlert(t('warning'), t('requiredInputError'))
    return false
  }

  return true
}

const submitAbsence = async () => {
  if (!validateAbsenceForm()) {
    return
  }

  try {
    await absenceStore.createAbsence({
      startDate: startDate.value!.toISOString(),
      endDate: endDate.value!.toISOString(),
      reason: reason.value || null,
      user: isAdmin.value ? selectedVolunteerId.value! : undefined,
    })

    notificationService.showSuccess(t('success'), t('admin.absence-create-success'))
    hideDialog()
  } catch (error: any) {
    const message = error?.response?.data?.error?.message

    if (message === 'This volunteer already has an absence during this period') {
      notificationService.showError(t('error'), t('admin.absence-overlap-error'))
      return
    }

    notificationService.showError(t('error'), t('admin.absence-create-error'))
  }
}

const translateStatus = (status: AbsenceStatus) => {
  switch (status) {
    case 'approved':
      return 'admin.absence-status-approved'
    case 'rejected':
      return 'admin.absence-status-rejected'
    case 'pending':
    default:
      return 'admin.absence-status-pending'
  }
}

const formatDate = (value: string | null) => {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleString('fr-FR')
}

const approveAbsence = async (documentId: string) => {
  await absenceStore.updateAbsenceStatus(documentId, 'approved')
}

const rejectAbsence = async (documentId: string) => {
  await absenceStore.updateAbsenceStatus(documentId, 'rejected')
}

const openActionsMenu = (event: Event, documentId: string) => {
  selectedAbsenceDocumentId.value = documentId
  op.value.toggle(event)
}

const resetAbsenceStatus = async () => {
  if (!selectedAbsenceDocumentId.value) {
    return
  }

  await absenceStore.updateAbsenceStatus(selectedAbsenceDocumentId.value, 'pending')
  op.value.hide()
  selectedAbsenceDocumentId.value = null
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <section class="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-2">
          <p class="text-sm font-medium uppercase tracking-wide text-primary-600">
            {{ $t('admin.absences') }}
          </p>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ isAdmin ? $t('admin.absence-list-title-admin') : $t('admin.absence-list-title') }}
          </h1>
          <p class="max-w-2xl text-sm text-gray-500">
            {{
              isAdmin
                ? $t('admin.absence-admin-description')
                : $t('admin.absence-user-description')
            }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <Button
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            v-tooltip.top="$t('refresh')"
            @click="loadData"
          />
          <Button
            :label="$t('admin.absence-create')"
            icon="pi pi-plus"
            iconPos="right"
            @click="openDialog"
          />
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p class="text-sm font-medium text-amber-700">{{ $t('admin.absence-status-pending') }}</p>
          <p class="mt-2 text-3xl font-bold text-amber-900">{{ pendingCount }}</p>
        </div>

        <div class="rounded-xl border border-green-200 bg-green-50 p-4">
          <p class="text-sm font-medium text-green-700">{{ $t('admin.absence-status-approved') }}</p>
          <p class="mt-2 text-3xl font-bold text-green-900">{{ approvedCount }}</p>
        </div>

        <div class="rounded-xl border border-red-200 bg-red-50 p-4">
          <p class="text-sm font-medium text-red-700">{{ $t('admin.absence-status-rejected') }}</p>
          <p class="mt-2 text-3xl font-bold text-red-900">{{ rejectedCount }}</p>
        </div>
      </div>
    </section>

    <Card>
      <template #title>
        <div class="flex items-center justify-between gap-3">
          <span>{{ $t('admin.absences') }}</span>
          <Tag :value="`${absences.length} ${$t('admin.absence-count')}`" severity="contrast" />
        </div>
      </template>

      <template #content>
        <DataTable
          :value="absences"
          :loading="loading"
          paginator
          :rows="8"
          responsiveLayout="scroll"
          tableStyle="min-width: 60rem"
        >
          <template #empty>
            <div class="py-6 text-center text-gray-500">
              {{ $t('admin.absence-empty') }}
            </div>
          </template>

          <Column v-if="isAdmin" field="user.username" :header="$t('auth.username')">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i class="pi pi-user text-sm text-gray-400"></i>
                <span>{{ slotProps.data.user?.username || '-' }}</span>
              </div>
            </template>
          </Column>

          <Column field="startDate" :header="$t('admin.absence-start-date')">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.startDate) }}
            </template>
          </Column>

          <Column field="endDate" :header="$t('admin.absence-end-date')">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.endDate) }}
            </template>
          </Column>

          <Column field="reason" :header="$t('admin.absence-reason')">
            <template #body="slotProps">
              <span class="text-sm text-gray-700">
                {{ slotProps.data.reason || $t('admin.absence-no-reason') }}
              </span>
            </template>
          </Column>

          <Column field="absence_status" :header="$t('admin.absence-status')">
            <template #body="slotProps">
              <Tag
                rounded
                :value="$t(translateStatus(slotProps.data.absence_status))"
                :severity="absenceStore.getStatusSeverity(slotProps.data.absence_status)"
              />
            </template>
          </Column>

          <Column v-if="isAdmin" :header="$t('settings')">
            <template #body="slotProps">
              <div
                v-if="slotProps.data.absence_status === 'approved'"
                class="flex justify-start"
              >
                <Button
                  icon="pi pi-ellipsis-v"
                  size="small"
                  text
                  rounded
                  v-tooltip.top="$t('settings')"
                  @click="openActionsMenu($event, slotProps.data.documentId)"
                />
              </div>

              <div v-else class="flex gap-2">
                <Button
                  icon="pi pi-check"
                  size="small"
                  severity="success"
                  outlined
                  v-tooltip.top="$t('accept')"
                  @click="approveAbsence(slotProps.data.documentId)"
                />
                <Button
                  icon="pi pi-times"
                  size="small"
                  severity="danger"
                  outlined
                  v-tooltip.top="$t('refuse')"
                  @click="rejectAbsence(slotProps.data.documentId)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Popover ref="op">
      <div class="flex flex-col gap-2">
        <button
          type="button"
          class="btn-bis text-gray-600 hover:text-gray-900"
          @click="resetAbsenceStatus"
        >
          <i class="pi pi-undo"></i>
          <span>{{ $t('admin.absence-reset-status') }}</span>
        </button>
      </div>
    </Popover>

    <Dialog
      v-model:visible="dialogVisible"
      modal
      :header="$t('admin.absence-create')"
      :style="{ width: '32rem' }"
    >
      <div class="flex flex-col gap-4">
        <div class="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          {{ $t('admin.absence-form-helper') }}
        </div>

        <div v-if="isAdmin" class="flex flex-col gap-2">
          <label class="font-semibold text-gray-800">{{ $t('admin.absence-volunteer') }}</label>
          <Select
            v-model="selectedVolunteerId"
            :options="volunteers"
            optionLabel="username"
            optionValue="id"
            class="w-full"
            :placeholder="$t('admin.absence-volunteer-placeholder')"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-semibold text-gray-800">{{ $t('admin.absence-start-date') }}</label>
          <DatePicker
            v-model="startDate"
            showTime
            hourFormat="24"
            :showIcon="true"
            :maxDate="endDate || undefined"
            inputClass="w-full"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-semibold text-gray-800">{{ $t('admin.absence-end-date') }}</label>
          <DatePicker
            v-model="endDate"
            showTime
            hourFormat="24"
            :showIcon="true"
            :minDate="startDate || undefined"
            inputClass="w-full"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-semibold text-gray-800">{{ $t('admin.absence-reason') }}</label>
          <Textarea v-model="reason" rows="4" autoResize class="w-full" />
        </div>
      </div>

      <template #footer>
        <Button :label="$t('cancel')" text @click="hideDialog" />
        <Button :label="$t('save')" icon="pi pi-check" @click="submitAbsence" />
      </template>
    </Dialog>
  </div>
</template>
