<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  name: string
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const handleUpdate = (value: boolean) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <label :for="props.name" class="font-semibold w-32">{{ props.label }}</label>
    <ToggleSwitch
      :inputId="props.name"
      @update:model-value="handleUpdate"
      :model-value="props.modelValue"
    />
  </div>
</template>
