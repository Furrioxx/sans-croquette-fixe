<script setup lang="ts">
const props = defineProps<{
  options: Object[]
  optionValue: string
  name: string
  label: string
  optionLabel: string
  value: any
  filter: boolean
}>()
</script>

<template>
  <div class="flex items-center gap-4 mb-2">
    <label :for="props.name" class="font-semibold w-32">{{ props.label }}</label>
    <MultiSelect
      :inputId="props.name"
      :options="props.options"
      v-model="props.value"
      :optionValue="props.optionValue"
      :optionLabel="props.optionLabel"
      class="flex-auto"
      :filter="props.filter"
    />
  </div>
</template>
