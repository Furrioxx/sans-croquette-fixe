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
  if (value === CatFriendly.YES) return { text: t('adopt.friendly-yes'), cls: 'text-[var(--scf-success)]' }
  if (value === CatFriendly.NO) return { text: t('adopt.friendly-no'), cls: 'text-[var(--scf-danger)]' }
  return { text: t('adopt.friendly-unknown'), cls: 'text-[var(--scf-muted)]' }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      v-if="catSheet.tarification"
      class="flex items-center justify-between rounded-xl bg-[var(--scf-bg)] px-3 py-2"
    >
      <span class="text-sm font-medium text-[var(--scf-text)]">{{
        catSheet.tarification.label
      }}</span>
      <span class="text-sm font-bold text-[var(--scf-accent-dark)]"
        >{{ catSheet.tarification.price }} €</span
      >
    </div>

    <p v-if="description" class="text-sm leading-relaxed text-[var(--scf-text)]">
      {{ description }}
    </p>

    <div v-if="healthChips.length" class="flex flex-wrap gap-1.5">
      <span
        v-for="chip in healthChips"
        :key="chip.key"
        class="rounded-full bg-[var(--scf-accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--scf-accent-dark)]"
        >{{ chip.label }}</span
      >
    </div>

    <div class="compat-grid border-t border-[var(--scf-line)] pt-3">
      <div
        v-for="compat in compatRow"
        :key="compat.label"
        class="flex flex-col items-center gap-0.5"
      >
        <span class="text-xs text-[var(--scf-muted)]">{{ compat.label }}</span>
        <span :class="['text-xs font-semibold', friendlyLabel(compat.value).cls]">
          {{ friendlyLabel(compat.value).text }}
        </span>
      </div>
    </div>
  </div>
</template>
