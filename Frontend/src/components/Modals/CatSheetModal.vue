<script setup lang="ts">
import type { Cat } from '@/models/Cat'
import { useCatMoodStore } from '@/stores/catMoods'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const catMoodStore = useCatMoodStore()
const emit = defineEmits(['update:visible', 'update:datas'])
const props = defineProps<{
  cat: Cat | null
  visible: boolean
}>()

const moods = computed(() => catMoodStore.catMoods)
const header = computed(() => (props.cat ? props.cat.mood : t('admin.cat.cat-create')))

onMounted(() => {
  loadData()
})

const loadData = async () => {
  await catMoodStore.fectchCatMoods()
}
</script>

<template>
  <Dialog
    v-model:visible="props.visible"
    modal
    header="Edit Profile"
    @update:visible="emit('update:visible', false)"
    :style="{ width: '30rem' }"
  >
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
        <span class="font-bold whitespace-nowrap">{{ header }}</span>
      </div>
    </template>
    <span class="text-surface-500 dark:text-surface-400 block mb-4">{{
      $t('admin.cat.cat-edit-helper')
    }}</span>
    <div class="flex items-center gap-4 mb-2">
      <label for="role" class="font-semibold w-32">{{ $t('admin.cat.mood') }}</label>
      <Select
        id="role"
        :options="moods"
        optionValue="id"
        optionLabel="name"
        placeholder="Select a cat mood"
        class="flex-auto"
      />
    </div>
  </Dialog>
</template>
