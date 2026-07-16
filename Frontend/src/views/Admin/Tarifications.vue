<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTarificationStore } from '@/stores/tarifications'
import type { Tarification } from '@/models/Tarification'
import type { FormError } from '@/models/FormError'
import { StringUtils } from '@/utils/stringUtils'
import notificationService from '@/services/notificationService'
import InputTextWithLabel from '@/components/Forms/elements/InputTextWithLabel.vue'
import InputNumberWithLabel from '@/components/Forms/elements/InputNumberWithLabel.vue'

const tarificationStore = useTarificationStore()
const { t } = useI18n()

const dialogVisible = ref(false)
const editingTarification = ref<Tarification | null>(null)
const label = ref('')
const price = ref(0)
const errors = ref<FormError[]>([])
const op = ref()
const selectedTarificationId = ref<number | null>(null)

const tarifications = computed(() => tarificationStore.tarifications)
const loading = computed(() => tarificationStore.loading)
const isEditMode = computed(() => editingTarification.value !== null)

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    await tarificationStore.fetchTarifications()
  } catch {
    notificationService.showError(t('error'), t('serverResponseProblem'))
  }
}

const resetForm = () => {
  label.value = ''
  price.value = 0
  errors.value = []
}

const openCreateDialog = () => {
  editingTarification.value = null
  resetForm()
  dialogVisible.value = true
}

const openEditDialog = (tarification: Tarification) => {
  editingTarification.value = tarification
  label.value = tarification.label
  price.value = tarification.price
  errors.value = []
  dialogVisible.value = true
}

const hideDialog = () => {
  dialogVisible.value = false
  editingTarification.value = null
  resetForm()
}

const validate = (): boolean => {
  errors.value = [
    StringUtils.checkRequiredValidity('label', label.value, t('requiredInputError')),
    StringUtils.checkNumberValidity('price', price.value, t('requiredInputError'), 0),
  ]
  return errors.value.filter((x) => x.valid === false).length === 0
}

const save = async () => {
  if (!validate()) {
    return
  }

  try {
    const payload = { label: label.value, price: price.value }

    if (editingTarification.value) {
      await tarificationStore.updateTarification(editingTarification.value.documentId, payload)
    } else {
      await tarificationStore.createTarification(payload)
    }

    notificationService.showSuccess(t('success'), t('admin.tarification.save-success'))
    hideDialog()
  } catch {
    notificationService.showError(t('error'), t('serverResponseProblem'))
  }
}

const openActionsMenu = (event: Event, tarification: Tarification) => {
  selectedTarificationId.value = tarification.id
  op.value.toggle(event)
}

const editSelectedTarification = () => {
  const tarification = tarifications.value.find((t) => t.id === selectedTarificationId.value)
  if (tarification) {
    openEditDialog(tarification)
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card>
      <template #title>
        <div class="flex items-center justify-between gap-3">
          <span>{{ $t('admin.tarification.title') }}</span>
          <div class="flex gap-2">
            <Button
              icon="pi pi-refresh"
              severity="secondary"
              outlined
              v-tooltip.top="$t('refresh')"
              @click="loadData"
            />
            <Button
              :label="$t('admin.tarification.create')"
              icon="pi pi-plus"
              iconPos="right"
              @click="openCreateDialog"
            />
          </div>
        </div>
      </template>

      <template #content>
        <div class="admin-table-shell">
          <DataTable :value="tarifications" :loading="loading" tableStyle="min-width: 40rem" stripedRows>
          <template #empty>
            <div class="py-6 text-center text-gray-500">
              {{ $t('admin.tarification.empty') }}
            </div>
          </template>

          <Column field="label" :header="$t('admin.tarification.label')" />

          <Column field="price" :header="$t('admin.tarification.price')">
            <template #body="slotProps">
              {{ slotProps.data.price }} €
            </template>
          </Column>

          <Column :header="$t('actions')">
            <template #body="slotProps">
              <Button
                icon="pi pi-ellipsis-v"
                rounded
                text
                v-tooltip.top="$t('settings')"
                @click="openActionsMenu($event, slotProps.data)"
              />
            </template>
          </Column>
          </DataTable>
        </div>
      </template>
    </Card>

    <Popover ref="op">
      <div class="flex flex-col gap-4">
        <button
          type="button"
          class="btn-bis text-gray-600 hover:text-gray-900"
          @click="editSelectedTarification"
        >
          <i class="pi pi-pencil"></i>
          <span>{{ $t('update') }}</span>
        </button>
      </div>
    </Popover>

    <Dialog
      v-model:visible="dialogVisible"
      modal
      :header="$t(isEditMode ? 'admin.tarification.edit' : 'admin.tarification.create')"
      class="admin-dialog-xs"
    >
      <div class="flex flex-col gap-4">
        <InputTextWithLabel
          name="tarification-label"
          :label="$t('admin.tarification.label')"
          v-model="label"
          required
          :valid="StringUtils.getFieldError(errors, 'label')?.valid"
          :errorMessage="StringUtils.getFieldError(errors, 'label')?.message"
        />
        <InputNumberWithLabel
          name="tarification-price"
          :label="$t('admin.tarification.price')"
          v-model="price"
          :min="0"
          required
          :valid="StringUtils.getFieldError(errors, 'price')?.valid"
          :errorMessage="StringUtils.getFieldError(errors, 'price')?.message"
        />
      </div>

      <template #footer>
        <Button :label="$t('cancel')" text @click="hideDialog" />
        <Button :label="$t('save')" icon="pi pi-check" @click="save" />
      </template>
    </Dialog>
  </div>
</template>
