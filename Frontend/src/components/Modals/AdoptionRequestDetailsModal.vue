<script setup lang="ts">
import AdoptionRequestForm from '@/components/Forms/AdoptionRequestForm.vue'
import {
  createAdoptionRequestFormFromRequest,
  createEmptyAdoptionRequestForm,
  type AdoptionRequest,
  type AdoptionRequestFormValues,
} from '@/models/AdoptionRequest'
import { DateUtils } from '@/utils/dateUtils'
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  visible: boolean
  request: AdoptionRequest | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const { t } = useI18n()
const form = reactive<AdoptionRequestFormValues>(createEmptyAdoptionRequestForm())

const statusSeverity = computed(() => {
  switch (props.request?.processingStatus) {
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
})

const statusLabel = computed(() => {
  switch (props.request?.processingStatus) {
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
})

const animalLabel = computed(
  () => props.request?.catSheet?.cats?.map((cat) => cat.name).join(' & ') || props.request?.animalName || '',
)

watch(
  () => props.request,
  (request) => {
    Object.assign(form, request ? createAdoptionRequestFormFromRequest(request) : createEmptyAdoptionRequestForm())
  },
  { immediate: true },
)

const close = () => {
  emit('update:visible', false)
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="$t('adoptionRequest.user.detailTitle')"
    :style="{ width: '70rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <template #header>
      <div class="flex w-full flex-col gap-1 pr-4">
        <span class="text-lg font-semibold text-surface-900 dark:text-surface-50">
          {{ $t('adoptionRequest.user.detailTitle') }}
        </span>
        <span v-if="request" class="text-sm text-surface-500 dark:text-surface-400">
          {{ animalLabel }}
        </span>
      </div>
    </template>

    <div
      v-if="request"
      class="mb-4 flex flex-col gap-3 rounded-xl bg-surface-50 p-4 text-sm text-surface-600 dark:bg-surface-900 dark:text-surface-300"
    >
      <div class="flex items-center justify-between gap-4">
        <span>{{ $t('adoptionRequest.user.currentStatus') }}</span>
        <Tag rounded :value="statusLabel" :severity="statusSeverity" />
      </div>
      <span>{{ $t('adoptionRequest.user.lastUpdate', { date: DateUtils.formatDate(request.updatedAt) }) }}</span>
    </div>

    <AdoptionRequestForm v-model="form" :disabled="true" :showStatus="true" />

    <template #footer>
      <Button :label="$t('cancel')" text @click="close" />
    </template>
  </Dialog>
</template>
