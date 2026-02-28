<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    name: string
    label: string
    tooltip?: string
    disabled?: boolean
    type?: string
    valid?: boolean
    errorMessage?: string
  }>(),
  {
    type: 'text',
  },
)

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
    <InputText
      :id="props.name"
      class="flex-auto"
      v-tooltip.top="props.tooltip"
      :model-value="props.modelValue"
      @update:model-value="handleUpdate"
      :disabled="props.disabled"
      autocomplete="off"
      :type="props.type"
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
