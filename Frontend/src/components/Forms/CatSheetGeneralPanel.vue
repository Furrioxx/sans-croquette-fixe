<script setup lang="ts">
import type { User } from '@/models/User'
import type { FormError } from '@/models/FormError'
import { StringUtils } from '@/utils/stringUtils'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ToggleSwitchWithLabel from './elements/ToggleSwitchWithLabel.vue'
import SelectWithLabel from './elements/SelectWithLabel.vue'

const { t } = useI18n()

const props = defineProps<{
  isDuo: boolean
  linkedVolunteer: number | null
  volunteers: User[]
}>()

const emit = defineEmits<{
  'update:isDuo': [value: boolean]
  'update:linkedVolunteer': [value: number | null]
}>()

const errors = ref<FormError[]>([])

const validate = (): boolean => {
  errors.value = []
  errors.value.push(
    StringUtils.checkRequiredValidity(
      'linkedVolunteer',
      props.linkedVolunteer?.toString(),
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
</template>
