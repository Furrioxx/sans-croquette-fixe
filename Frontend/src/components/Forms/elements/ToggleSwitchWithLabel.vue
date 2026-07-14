<script setup lang="ts">
const model = defineModel<boolean>({ default: false })

const props = defineProps<{
  name: string
  label: string
  required?: boolean
}>()
</script>

<template>
  <div class="form-field-row mb-4">
    <label :for="props.name" class="form-field-label"
      >{{ props.label }}<span v-if="props.required" class="form-field-required">*</span></label
    >
    <ToggleSwitch :inputId="props.name" v-model="model" />
  </div>
</template>
