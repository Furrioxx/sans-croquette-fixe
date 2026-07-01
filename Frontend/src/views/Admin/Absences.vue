<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAbsenceStore } from '@/stores/absences'
import { useAuthStore } from '@/stores/authentication'
import { Roles } from '@/router/Roles'
import type { Absence, AbsenceDelegationStatus, AbsenceStatus } from '@/models/Absence'
import { UserService } from '@/services/userService'
import type { User } from '@/models/User'
import notificationService from '@/services/notificationService'
import { useI18n } from 'vue-i18n'
import { AbsenceDelegationService } from '@/services/absenceDelegationService'
import confirmationDialogService from '@/services/confirmationDialogService'

const absenceStore = useAbsenceStore()
const authStore = useAuthStore()
const { t } = useI18n()

type AdminAbsenceTarget = 'volunteer' | 'self'

const dialogVisible = ref(false)
const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)
const reason = ref('')
const selectedVolunteerId = ref<number | null>(null)
const selectedDelegateVolunteerId = ref<number | null>(null)
const volunteers = ref<User[]>([])
const op = ref()
const selectedAbsenceDocumentId = ref<string | null>(null)
const adminAbsenceTarget = ref<AdminAbsenceTarget>('volunteer')
const delegationStatus = ref<AbsenceDelegationStatus | null>(null)
const editingAbsence = ref<Absence | null>(null)

const isAdmin = computed(() => authStore.getUserRole === Roles.ADMIN)
const canManageAbsences = computed(
  () => isAdmin.value || delegationStatus.value?.canManageAbsences === true,
)
const isDelegatedManager = computed(() => delegationStatus.value?.isDelegatedManager === true)
const activeOwnedDelegations = computed(() => delegationStatus.value?.activeOwnedDelegations ?? [])
const absences = computed(() => absenceStore.absences)
const loading = computed(() => absenceStore.loading)
const isEditingAdminAbsence = computed(() => editingAbsence.value !== null)
const absenceTitle = computed(() =>
  canManageAbsences.value ? t('admin.absence-list-title-admin') : t('admin.absence-list-title'),
)
const absenceDescription = computed(() => {
  if (isAdmin.value) {
    return t('admin.absence-admin-description')
  }

  if (isDelegatedManager.value) {
    return t('admin.absence-delegate-description')
  }

  return t('admin.absence-user-description')
})
const showVolunteerFields = computed(
  () => isAdmin.value && adminAbsenceTarget.value === 'volunteer',
)
const showAdminDelegateField = computed(() => isAdmin.value && adminAbsenceTarget.value === 'self')

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
  loadDelegationStatus()
  if (isAdmin.value) {
    loadVolunteers()
  }
})

const loadData = async () => {
  try {
    await absenceStore.fetchAbsences()
  } catch {
    notificationService.showError(t('error'), t('serverResponseProblem'))
  }
}

const loadDelegationStatus = async () => {
  try {
    const response = await AbsenceDelegationService.getStatus()
    delegationStatus.value = response.data.data
  } catch {
    delegationStatus.value = null
  }
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
  editingAbsence.value = null
  resetForm()
  dialogVisible.value = true
}

const resetForm = () => {
  startDate.value = null
  endDate.value = null
  reason.value = ''
  selectedVolunteerId.value = null
  selectedDelegateVolunteerId.value = null
  adminAbsenceTarget.value = 'volunteer'
}

const hideDialog = () => {
  dialogVisible.value = false
  editingAbsence.value = null
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

  if (showVolunteerFields.value && !selectedVolunteerId.value) {
    notificationService.showAlert(t('warning'), t('requiredInputError'))
    return false
  }

  if (showAdminDelegateField.value && !selectedDelegateVolunteerId.value) {
    notificationService.showAlert(t('warning'), t('admin.absence-required-delegate'))
    return false
  }

  return true
}

const submitAbsence = async () => {
  if (!validateAbsenceForm()) {
    return
  }

  try {
    const payload = {
      startDate: startDate.value!.toISOString(),
      endDate: endDate.value!.toISOString(),
      reason: reason.value || null,
      user: showVolunteerFields.value ? selectedVolunteerId.value! : undefined,
      delegateUserId: showAdminDelegateField.value ? selectedDelegateVolunteerId.value! : undefined,
    }

    if (editingAbsence.value) {
      await absenceStore.updateAbsence(editingAbsence.value.documentId, payload)
    } else {
      await absenceStore.createAbsence(payload)
    }

    notificationService.showSuccess(t('success'), t('admin.absence-create-success'))
    hideDialog()
    await loadDelegationStatus()
  } catch (error: any) {
    const message = error?.response?.data?.error?.message

    if (message === 'This volunteer already has an absence during this period') {
      notificationService.showError(t('error'), t('admin.absence-overlap-error'))
      return
    }

    if (message === 'Selected delegate must be an active volunteer') {
      notificationService.showError(t('error'), t('admin.absence-invalid-delegate'))
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

const canReviewAbsence = (absence: Absence) => {
  return canManageAbsences.value && !isAdminOwnedAbsence(absence)
}

const isAdminOwnedAbsence = (absence: Absence) => {
  return absence.user?.role?.name === 'Admin'
}

const canEditAdminOwnedAbsence = (absence: Absence) => {
  return isAdmin.value && isAdminOwnedAbsence(absence) && absence.user?.id === authStore.user?.id
}

const approveAbsence = async (documentId: string) => {
  try {
    await absenceStore.updateAbsenceStatus(documentId, 'approved')
  } catch {
    notificationService.showError(t('error'), t('serverResponseProblem'))
  }
}

const rejectAbsence = async (documentId: string) => {
  try {
    await absenceStore.updateAbsenceStatus(documentId, 'rejected')
  } catch {
    notificationService.showError(t('error'), t('serverResponseProblem'))
  }
}

const openActionsMenu = (event: Event, documentId: string) => {
  selectedAbsenceDocumentId.value = documentId
  op.value.toggle(event)
}

const resetAbsenceStatus = async () => {
  if (!selectedAbsenceDocumentId.value) {
    return
  }

  try {
    await absenceStore.updateAbsenceStatus(selectedAbsenceDocumentId.value, 'pending')
    op.value.hide()
    selectedAbsenceDocumentId.value = null
  } catch {
    notificationService.showError(t('error'), t('serverResponseProblem'))
  }
}

const deactivateDelegation = async (delegationId: number) => {
  try {
    await AbsenceDelegationService.deactivateDelegation(delegationId)
    notificationService.showSuccess(t('success'), t('admin.absence-delegation-deactivate-success'))
    await loadDelegationStatus()
  } catch {
    notificationService.showError(t('error'), t('admin.absence-delegation-deactivate-error'))
  }
}

const editAdminAbsence = (absence: Absence) => {
  editingAbsence.value = absence
  adminAbsenceTarget.value = 'self'
  startDate.value = absence.startDate ? new Date(absence.startDate) : null
  endDate.value = absence.endDate ? new Date(absence.endDate) : null
  reason.value = absence.reason || ''

  const delegation = activeOwnedDelegations.value.find(
    (item) => item.sourceAbsenceDocumentId === absence.documentId,
  )

  selectedDelegateVolunteerId.value = delegation?.delegateUser?.id ?? null
  dialogVisible.value = true
}

const deleteAdminAbsence = (absence: Absence) => {
  confirmationDialogService.showConfirmDelete(
    t('confirm'),
    t('admin.absence-delete-confirmation'),
    async () => {
      await absenceStore.deleteAbsence(absence.documentId)
      await loadDelegationStatus()
      notificationService.showSuccess(t('success'), t('admin.absence-delete-success'))
    },
    () => undefined,
  )
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
            {{ absenceTitle }}
          </h1>
          <p class="max-w-2xl text-sm text-gray-500">
            {{ absenceDescription }}
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
            :label="$t(editingAbsence ? 'update' : 'admin.absence-create')"
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

    <section
      v-if="isAdmin && activeOwnedDelegations.length"
      class="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
    >
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-xl font-bold text-gray-900">
            {{ $t('admin.absence-delegation-title') }}
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            {{ $t('admin.absence-delegation-description') }}
          </p>
        </div>
        <Tag :value="`${activeOwnedDelegations.length} ${$t('admin.absence-count')}`" severity="info" />
      </div>

      <div class="grid gap-4">
        <div
          v-for="delegation in activeOwnedDelegations"
          :key="delegation.id"
          class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 md:flex-row md:items-center md:justify-between"
        >
          <div class="space-y-1">
            <p class="text-sm font-semibold text-gray-900">
              {{ delegation.delegateUser?.username || '-' }}
            </p>
            <p class="text-sm text-gray-600">
              {{ $t('admin.absence-delegation-period') }}
              {{ formatDate(delegation.startDate) }}
              -
              {{ formatDate(delegation.endDate) }}
            </p>
          </div>

          <Button
            :label="$t('admin.absence-delegation-deactivate')"
            icon="pi pi-times"
            severity="danger"
            outlined
            @click="deactivateDelegation(delegation.id)"
          />
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

          <Column v-if="canManageAbsences" field="user.username" :header="$t('auth.username')">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i class="pi pi-user text-sm text-gray-400"></i>
                <span>{{ slotProps.data.user?.username || '-' }}</span>
                <Tag
                  v-if="isAdminOwnedAbsence(slotProps.data)"
                  :value="$t('auth.role') + ' admin'"
                  severity="secondary"
                  rounded
                />
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

          <Column v-if="canManageAbsences" :header="$t('settings')">
            <template #body="slotProps">
              <div
                v-if="canReviewAbsence(slotProps.data) && slotProps.data.absence_status === 'approved'"
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

              <div v-else-if="canReviewAbsence(slotProps.data)" class="flex gap-2">
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

              <div v-else-if="canEditAdminOwnedAbsence(slotProps.data)" class="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  size="small"
                  severity="info"
                  outlined
                  v-tooltip.top="$t('update')"
                  @click="editAdminAbsence(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  size="small"
                  severity="danger"
                  outlined
                  v-tooltip.top="$t('delete')"
                  @click="deleteAdminAbsence(slotProps.data)"
                />
              </div>

              <span v-else class="text-xs text-gray-400">
                {{ $t('admin.absence-no-review-needed') }}
              </span>
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
      :header="$t(editingAbsence ? 'update' : 'admin.absence-create')"
      :style="{ width: '32rem' }"
    >
      <div class="flex flex-col gap-4">
        <div class="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          {{ $t('admin.absence-form-helper') }}
        </div>

        <div v-if="isAdmin" class="flex flex-col gap-3 rounded-xl border border-gray-200 p-4">
          <label class="font-semibold text-gray-800">{{ $t('admin.absence-target-label') }}</label>
          <div class="grid gap-2 md:grid-cols-2">
            <button
              type="button"
              class="rounded-xl border px-4 py-3 text-left text-sm transition"
              :class="
                adminAbsenceTarget === 'volunteer'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              "
              :disabled="isEditingAdminAbsence"
              @click="adminAbsenceTarget = 'volunteer'"
            >
              {{ $t('admin.absence-target-volunteer') }}
            </button>
            <button
              type="button"
              class="rounded-xl border px-4 py-3 text-left text-sm transition"
              :class="
                adminAbsenceTarget === 'self'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              "
              @click="adminAbsenceTarget = 'self'"
            >
              {{ $t('admin.absence-target-self') }}
            </button>
          </div>
        </div>

        <div v-if="showVolunteerFields" class="flex flex-col gap-2">
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

        <div v-if="showAdminDelegateField" class="flex flex-col gap-2">
          <label class="font-semibold text-gray-800">{{ $t('admin.absence-delegate-label') }}</label>
          <Select
            v-model="selectedDelegateVolunteerId"
            :options="volunteers"
            optionLabel="username"
            optionValue="id"
            class="w-full"
            :placeholder="$t('admin.absence-delegate-placeholder')"
          />
          <p class="text-xs text-gray-500">{{ $t('admin.absence-delegate-helper') }}</p>
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
