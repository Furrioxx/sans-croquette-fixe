<script setup lang="ts">
const model = defineModel<any>()

const props = defineProps<{
  name: string
  label: string
  value?: unknown
  binary?: boolean
}>()
</script>

<template>
  <label :for="props.name" class="flex items-center gap-2 cursor-pointer group/cb">
    <Checkbox :inputId="props.name" v-model="model" :binary="props.binary" :value="props.value" />
    <span
      class="text-sm text-surface-700 dark:text-surface-300 group-hover/cb:text-primary-600 transition-colors"
      >{{ props.label }}</span
    >
  </label>
</template>
