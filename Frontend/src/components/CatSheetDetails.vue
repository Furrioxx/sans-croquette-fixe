<script setup lang="ts">
import type { CatSheet } from '@/models/CatSheet'
import { CatFriendly } from '@/models/Enums/CatFriendlyEnum'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    catSheet: CatSheet
    truncateDescription?: boolean
  }>(),
  {
    truncateDescription: true,
  },
)

const primaryCat = computed(() => (props.catSheet.cats ?? [])[0])

const description = computed(() => {
  const d = props.catSheet.description
  if (!d) return null
  if (!props.truncateDescription || d.length <= 130) return d
  return d.slice(0, 127) + '…'
})

const healthChips = computed(() => {
  const cat = primaryCat.value
  if (!cat) return []
  return [
    { key: 'vaccinated', label: t('adopt.vaccinated'), show: cat.vaccinated },
    { key: 'sterilized', label: t('adopt.sterilized'), show: cat.sterilized },
    { key: 'identified', label: t('adopt.identified'), show: cat.identified },
    { key: 'decontaminated', label: t('adopt.decontaminated'), show: cat.decontaminate },
  ].filter((c) => c.show)
})

const compatRow = computed(() => {
  const cat = primaryCat.value
  if (!cat) return []
  return [
    { icon: 'pi pi-heart', label: t('adopt.cat-friendly'), value: cat.catFriendly },
    { icon: 'pi pi-cloud', label: t('adopt.dog-friendly'), value: cat.dogFriendly },
    { icon: 'pi pi-star', label: t('adopt.child-friendly'), value: cat.childFriendly },
  ]
})

const friendlyLabel = (value: CatFriendly) => {
  if (value === CatFriendly.YES) return { text: t('adopt.friendly-yes'), cls: 'text-green-600' }
  if (value === CatFriendly.NO) return { text: t('adopt.friendly-no'), cls: 'text-red-500' }
  return { text: t('adopt.friendly-unknown'), cls: 'text-surface-400' }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p v-if="description" class="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
      {{ description }}
    </p>

    <div v-if="healthChips.length" class="flex flex-wrap gap-1.5">
      <span
        v-for="chip in healthChips"
        :key="chip.key"
        class="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
        >{{ chip.label }}</span
      >
    </div>

    <div class="grid grid-cols-3 gap-2 pt-1 border-t border-surface-100 dark:border-surface-700">
      <div v-for="compat in compatRow" :key="compat.label" class="flex flex-col items-center gap-0.5">
        <span class="text-xs text-surface-400 dark:text-surface-500">{{ compat.label }}</span>
        <span :class="['text-xs font-semibold', friendlyLabel(compat.value).cls]">
          {{ friendlyLabel(compat.value).text }}
        </span>
      </div>
    </div>
  </div>
</template>
