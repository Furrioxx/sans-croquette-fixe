<script setup lang="ts">
import { onMounted, ref } from 'vue'

const value = ref<string>()
let timeout: ReturnType<typeof setTimeout> | null = null

const props = defineProps({
  placeholder: {
    type: String,
    required: false,
    default: 'Search...',
  },
  value: {
    type: String,
    required: false,
    default: '',
  },
})

const emits = defineEmits<{
  'update:value': [query: string]
}>()

onMounted(() => {
  value.value = props.value
})

const search = (): void => {
  if (timeout) clearTimeout(timeout)

  timeout = setTimeout(() => {
    emits('update:value', value.value ?? '')
  }, 500)
}
</script>

<template>
  <div class="card flex justify-center">
    <InputText v-model="value" :placeholder="placeholder" @input="search()"/>
  </div>
</template>