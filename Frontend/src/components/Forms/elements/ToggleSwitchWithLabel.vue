<script setup lang="ts">
const props = defineProps<{
  value: boolean
  name: string
  label: string
}>()
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <label :for="props.name" class="font-semibold w-32">{{ props.label }}</label>
    <ToggleSwitch :inputId="props.name" v-model="props.value" />
  </div>
</template>
