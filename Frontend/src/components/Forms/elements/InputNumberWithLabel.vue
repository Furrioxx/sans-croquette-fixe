<script setup lang="ts">
const props = defineProps<{
  value: number
  name: string
  label: string
  min: number | null
  max: number | null
}>()
</script>

<template>
  <div class="flex items-center gap-4 mb-2">
    <label :for="props.name" class="font-semibold w-32">{{ props.label }}</label>
    <InputNumber
      :id="props.name"
      class="flex-auto"
      v-model="props.value"
      autocomplete="off"
      :min="props.min ?? undefined"
      :max="props.max ?? undefined"
    />
  </div>
</template>
