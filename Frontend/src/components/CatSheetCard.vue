<script setup lang="ts">
import type { CatSheet } from '@/models/CatSheet'
import type { Cat } from '@/models/Cat'
import { CatFriendly } from '@/models/Enums/CatFriendlyEnum'
import { Genders } from '@/models/Enums/Genders'
import { RouteNames } from '@/router/routeNames'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatAge, getCatStatusLabel, isKitten } from '@/utils/catUtils'
import { getCatImageUrl } from '@/utils/catImageUrl'

const { t } = useI18n()

type MismatchDetail = {
  expected: string
  actual: string
}

const props = defineProps<{
  catSheet: CatSheet
  mismatchDetails?: MismatchDetail[]
}>()

const images = computed(() => props.catSheet.images ?? [])
const cats = computed(() => props.catSheet.cats ?? [])
const primaryCat = computed(() => cats.value[0])

const coverImage = computed(() => {
  const first = images.value[0]
  return first ? getCatImageUrl(first.url) : null
})

const catNames = computed(() => cats.value.map((c) => c.name).join(' & '))

const statusLabel = computed(() => getCatStatusLabel(primaryCat.value?.catStatus, t))

const genderLabel = (cat: Cat) =>
  cat.gender === Genders.MALE ? t('adopt.male') : t('adopt.female')

const age = (cat: Cat) => formatAge(cat.birthDate, t)

const kittenLabel = (cat: Cat) => (isKitten(cat) ? t('adopt.kitten') : t('adopt.not-kitten'))

const subtitleLine = computed(() => {
  if (!primaryCat.value) return ''
  return `${genderLabel(primaryCat.value)} · ${kittenLabel(primaryCat.value)}`
})

const infoLines = computed(() => {
  const cat = primaryCat.value
  if (!cat) return []
  const lines: { icon: string; label: string }[] = []

  const healthParts = [
    cat.vaccinated ? t('adopt.vaccinated') : null,
    cat.sterilized ? t('adopt.sterilized') : null,
    cat.identified ? t('adopt.identified') : null,
    cat.decontaminate ? t('adopt.decontaminated') : null,
  ].filter(Boolean)
  if (healthParts.length) lines.push({ icon: 'pi pi-shield', label: healthParts.join(', ') })

  if (cat.catFriendly === CatFriendly.YES)
    lines.push({ icon: 'pi pi-heart', label: t('adopt.cat-friendly') })
  if (cat.dogFriendly === CatFriendly.YES)
    lines.push({ icon: 'pi pi-heart', label: t('adopt.dog-friendly') })
  if (cat.childFriendly === CatFriendly.YES)
    lines.push({ icon: 'pi pi-star', label: t('adopt.child-friendly') })

  lines.push({ icon: 'pi pi-calendar', label: age(cat) })

  return lines
})
</script>

<template>
  <article
    data-cy="cat-sheet-card"
    class="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white transition-transform duration-300 hover:-translate-y-1"
  >
    <div class="relative aspect-[4/3] overflow-hidden bg-[var(--scf-bg)]">
      <img
        v-if="coverImage"
        :src="coverImage"
        :alt="catNames"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        v-else
        class="flex h-full w-full flex-col items-center justify-center gap-2 text-[var(--scf-muted)]"
      >
        <i class="pi pi-camera text-4xl"></i>
        <span class="text-sm">{{ $t('no-photo') }}</span>
      </div>

      <div class="absolute left-3 top-3 flex flex-wrap gap-1.5">
        <span
          v-if="statusLabel"
          class="rounded-full bg-[var(--scf-accent)] px-3 py-1 text-xs font-bold text-white"
        >
          {{ statusLabel }}
        </span>
        <span
          v-if="catSheet.isDuo"
          class="rounded-full bg-[var(--scf-ink)] px-3 py-1 text-xs font-bold text-white"
        >
          {{ $t('adopt.duo') }}
        </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-6">
      <div>
        <span class="text-xs font-bold uppercase tracking-[0.06em] text-[var(--scf-accent-dark)]">
          {{ subtitleLine }}
        </span>
        <h3 class="display-font mt-1 text-xl font-bold text-[var(--scf-ink)]">{{ catNames }}</h3>
      </div>

      <p v-if="catSheet.description" class="text-sm leading-6 text-[var(--scf-text)]">
        {{ catSheet.description }}
      </p>

      <div
        v-if="catSheet.tarification"
        class="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--scf-bg)] px-3 py-1 text-xs font-semibold text-[var(--scf-ink)]"
      >
        <i class="pi pi-tag text-[var(--scf-accent-dark)]"></i>
        {{ catSheet.tarification.label }} — {{ catSheet.tarification.price }} €
      </div>

      <div class="flex flex-col gap-1.5 text-xs font-semibold text-[var(--scf-text)]">
        <span v-for="line in infoLines" :key="line.label" class="inline-flex items-center gap-2">
          <i :class="line.icon" class="text-[var(--scf-accent-dark)]"></i>
          {{ line.label }}
        </span>
      </div>

      <div
        v-if="props.mismatchDetails?.length"
        class="rounded-[18px] border border-[var(--scf-line)] bg-[var(--scf-bg)] px-3 py-3"
      >
        <p class="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--scf-muted)]">
          {{ $t('adoptGuide.closeMismatchTitleLong') }}
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="detail in props.mismatchDetails"
            :key="`${detail.expected}-${detail.actual}`"
            class="inline-flex flex-wrap items-center gap-1 rounded-full border border-[var(--scf-line)] bg-white px-3 py-1 text-[11px] font-semibold text-[var(--scf-muted)]"
          >
            <span class="line-through decoration-[1.5px] decoration-[var(--scf-muted)]">
              {{ detail.expected }}
            </span>
            <span aria-hidden="true">→</span>
            <span class="text-[var(--scf-ink)]">{{ detail.actual }}</span>
          </span>
        </div>
      </div>

      <div class="mt-auto pt-2">
        <Button
          as="router-link"
          :to="{ name: RouteNames.ADOPT_DETAIL, params: { documentId: catSheet.documentId } }"
          :label="$t('adopt.see-sheet')"
          icon="pi pi-arrow-right"
          iconPos="right"
          rounded
          data-cy="cat-sheet-see-more"
          class="w-full !bg-[var(--scf-accent)] !border-[var(--scf-accent)] hover:!bg-[var(--scf-accent-dark)] hover:!border-[var(--scf-accent-dark)]"
        />
      </div>
    </div>
  </article>
</template>
