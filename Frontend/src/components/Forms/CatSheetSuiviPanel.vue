<script setup lang="ts">
import DatePickerWithLabel from './elements/DatePickerWithLabel.vue'
import TextareaWithLabel from './elements/TextareaWithLabel.vue'

type CatSuivi = { trappingDate: string | null; medicalHistory: string | null }

const props = defineProps<{
  cat1: CatSuivi
  cat2: CatSuivi
  isDuo: boolean
}>()

const emit = defineEmits<{
  'update:cat1': [value: CatSuivi]
  'update:cat2': [value: CatSuivi]
}>()
</script>

<template>
  <span class="text-surface-500 dark:text-surface-400 block mb-4">
    {{ $t('admin.cat.suivi-helper') }}
  </span>

  <p class="font-semibold mb-3" v-if="isDuo">{{ $t('admin.cat.cat1-label') }}</p>
  <DatePickerWithLabel
    name="trappingDate1"
    :label="$t('admin.cat.trappingDate')"
    :modelValue="cat1.trappingDate"
    @update:modelValue="emit('update:cat1', { ...cat1, trappingDate: $event ?? null })"
  />
  <TextareaWithLabel
    name="medicalHistory1"
    :label="$t('admin.cat.medicalHistory')"
    :modelValue="cat1.medicalHistory"
    @update:modelValue="emit('update:cat1', { ...cat1, medicalHistory: $event })"
  />

  <template v-if="isDuo">
    <Divider />
    <p class="font-semibold mb-3">{{ $t('admin.cat.cat2-label') }}</p>
    <DatePickerWithLabel
      name="trappingDate2"
      :label="$t('admin.cat.trappingDate')"
      :modelValue="cat2.trappingDate"
      @update:modelValue="emit('update:cat2', { ...cat2, trappingDate: $event ?? null })"
    />
    <TextareaWithLabel
      name="medicalHistory2"
      :label="$t('admin.cat.medicalHistory')"
      :modelValue="cat2.medicalHistory"
      @update:modelValue="emit('update:cat2', { ...cat2, medicalHistory: $event })"
    />
  </template>
</template>
