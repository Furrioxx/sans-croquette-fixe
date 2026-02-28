<script setup lang="ts">
const props = defineProps<{
  options: Object[]
  optionValue: string
  name: string
  label: string
  optionLabel: string
  modelValue: any
  valid?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleUpdate = (value: string | undefined) => {
  emit('update:modelValue', value ?? '')
}
</script>

<template>
  <div class="flex items-center gap-4 mb-2">
    <label :for="props.name" class="font-semibold w-32">{{ props.label }}</label>
    <Select
      :inputId="props.name"
      :options="props.options"
      :model-value="props.modelValue"
      :optionValue="props.optionValue"
      :optionLabel="props.optionLabel"
      @update:model-value="handleUpdate"
      class="flex-auto"
    />
  </div>
  <Message
    v-if="props.valid === false && props.errorMessage"
    class="mb-2"
    severity="error"
    size="small"
    variant="simple"
    >{{ errorMessage }}</Message
  >
</template>
