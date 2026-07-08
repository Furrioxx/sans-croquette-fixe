<script setup lang="ts">
import type { User } from '@/models/User'
import type { Tarification } from '@/models/Tarification'
import type { FormError } from '@/models/FormError'
import { StringUtils } from '@/utils/stringUtils'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ToggleSwitchWithLabel from './elements/ToggleSwitchWithLabel.vue'
import SelectWithLabel from './elements/SelectWithLabel.vue'

const { t } = useI18n()

const props = defineProps<{
  isDuo: boolean
  linkedVolunteer: number | null
  backupVolunteer: number | null
  volunteers: User[]
  tarification: number | null
  tarifications: Tarification[]
  description: string | null
}>()

const emit = defineEmits<{
  'update:isDuo': [value: boolean]
  'update:linkedVolunteer': [value: number | null]
  'update:backupVolunteer': [value: number | null]
  'update:tarification': [value: number | null]
  'update:description': [value: string | null]
}>()

const errors = ref<FormError[]>([])

const filteredVolunteers = computed(() =>
  props.volunteers.filter((v) => v.id !== props.linkedVolunteer),
)

watch(
  () => props.linkedVolunteer,
  (newVal) => {
    if (newVal !== null && newVal === props.backupVolunteer) {
      emit('update:backupVolunteer', null)
    }
  },
)

const validate = (): boolean => {
  errors.value = []
  errors.value.push(
    StringUtils.checkRequiredValidity(
      'linkedVolunteer',
      props.linkedVolunteer?.toString(),
      t('requiredInputError'),
    ),
  )
  errors.value.push(
    StringUtils.checkRequiredValidity(
      'tarification',
      props.tarification?.toString(),
      t('requiredInputError'),
    ),
  )
  return errors.value.filter((x) => x.valid === false).length === 0
}

defineExpose({ validate })
</script>

<template>
  <ToggleSwitchWithLabel
    name="isDuo"
    :modelValue="isDuo"
    @update:modelValue="emit('update:isDuo', $event)"
    :label="$t('admin.cat.isDuo')"
  />
  <SelectWithLabel
    name="linkedVolunteer"
    :options="volunteers"
    optionLabel="username"
    optionValue="id"
    :modelValue="linkedVolunteer"
    @update:modelValue="emit('update:linkedVolunteer', $event ? Number($event) : null)"
    :label="$t('admin.cat.linkedVolunteer')"
    required
    :valid="StringUtils.getFieldError(errors, 'linkedVolunteer')?.valid"
    :errorMessage="StringUtils.getFieldError(errors, 'linkedVolunteer')?.message"
  />
  <SelectWithLabel
    name="backupVolunteer"
    :options="filteredVolunteers"
    optionLabel="username"
    optionValue="id"
    :modelValue="backupVolunteer"
    @update:modelValue="emit('update:backupVolunteer', $event ? Number($event) : null)"
    :label="$t('admin.cat.backupVolunteer')"
  />
  <SelectWithLabel
    name="tarification"
    :options="tarifications"
    optionLabel="label"
    optionValue="id"
    :modelValue="tarification"
    @update:modelValue="emit('update:tarification', $event ? Number($event) : null)"
    :label="$t('admin.cat.tarification')"
    :placeholder="$t('admin.cat.tarification-placeholder')"
    required
    :valid="StringUtils.getFieldError(errors, 'tarification')?.valid"
    :errorMessage="StringUtils.getFieldError(errors, 'tarification')?.message"
  />
  <div class="flex flex-col gap-1 mt-2">
    <label for="description" class="font-semibold text-sm">{{ $t('admin.cat.description') }}</label>
    <Textarea
      id="description"
      :value="description ?? ''"
      @input="emit('update:description', ($event.target as HTMLTextAreaElement).value || null)"
      rows="4"
      class="w-full"
    />
  </div>
</template>
