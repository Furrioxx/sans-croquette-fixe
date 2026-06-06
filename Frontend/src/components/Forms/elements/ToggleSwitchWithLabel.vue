<script setup lang="ts">
const model = defineModel<boolean>({ default: false })

const props = defineProps<{
  name: string
  label: string
  required?: boolean
}>()
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <label :for="props.name" class="font-semibold w-32">{{ props.label }}<span v-if="props.required" class="text-red-500 ml-1">*</span></label>
    <ToggleSwitch :inputId="props.name" v-model="model" />
  </div>
</template>
