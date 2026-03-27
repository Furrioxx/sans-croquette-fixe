<script setup lang="ts">
import type { User } from '@/models/User'
import ToggleSwitchWithLabel from './elements/ToggleSwitchWithLabel.vue'
import SelectWithLabel from './elements/SelectWithLabel.vue'

defineProps<{
  isDuo: boolean
  linkedVolunteer: number | null
  volunteers: User[]
}>()

const emit = defineEmits<{
  'update:isDuo': [value: boolean]
  'update:linkedVolunteer': [value: number | null]
}>()
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
    @update:modelValue="emit('update:linkedVolunteer', $event as number | null)"
    :label="$t('admin.cat.linkedVolunteer')"
  />
</template>
