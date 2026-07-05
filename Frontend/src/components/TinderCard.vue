<template>
  <article
    class="absolute inset-0 bg-white dark:bg-surface-800 rounded-2xl shadow-lg overflow-hidden border border-surface-100 dark:border-surface-700 select-none touch-none"
    :style="cardStyle"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="endDrag"
    @pointercancel="endDrag"
  >
    <div class="relative h-full flex flex-col">
      <div class="relative flex-1 overflow-hidden bg-surface-100 dark:bg-surface-700">
        <img
          v-if="coverImage"
          :src="coverImage"
          :alt="catNames"
          class="w-full h-full object-cover pointer-events-none"
          draggable="false"
        />
        <div
          v-else
          class="w-full h-full flex flex-col items-center justify-center gap-2 text-surface-300 dark:text-surface-500"
        >
          <i class="pi pi-camera text-5xl"></i>
          <span class="text-sm">{{ $t('no-photo') }}</span>
        </div>

        <div
          class="absolute inset-0 flex items-center justify-center border-8 border-green-400 rounded-2xl"
          :style="{ opacity: likeOverlayOpacity }"
        >
          <span class="text-4xl font-extrabold text-green-500 rotate-[-15deg] tracking-wider">{{
            $t('discover.like-stamp')
          }}</span>
        </div>
        <div
          class="absolute inset-0 flex items-center justify-center border-8 border-red-400 rounded-2xl"
          :style="{ opacity: passOverlayOpacity }"
        >
          <span class="text-4xl font-extrabold text-red-500 rotate-[15deg] tracking-wider">{{
            $t('discover.pass-stamp')
          }}</span>
        </div>

        <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span
            v-if="statusLabel"
            class="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm text-surface-700 dark:text-surface-200"
            >{{ statusLabel }}</span
          >
          <span
            v-if="catSheet.isDuo"
            class="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100/90 text-purple-700"
            >{{ $t('adopt.duo') }}</span
          >
        </div>

        <div
          class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-10"
        >
          <h3 class="text-2xl font-bold text-white leading-tight">{{ catNames }}</h3>
          <div class="flex items-center gap-1.5 mt-1 text-white/80 text-sm">
            <i :class="genderIcon" class="text-xs"></i>
            <span>{{ age }}</span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { CatSheet } from '@/models/CatSheet'
import { CatStatus } from '@/models/Enums/CatStatusEnum'
import { Genders } from '@/models/Enums/Genders'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = withDefaults(defineProps<{ catSheet: CatSheet; interactive?: boolean }>(), {
  interactive: true,
})

const emit = defineEmits<{ like: []; pass: [] }>()

const SWIPE_THRESHOLD = 120

const getImageUrl = (url: string) => {
  const baseUrl = (import.meta.env.VITE_APP_API_BASE_URL as string)?.replace(/\/api\/?$/, '') || ''
  return url.startsWith('http') ? url : `${baseUrl}${url}`
}

const images = computed(() => props.catSheet.images ?? [])
const cats = computed(() => props.catSheet.cats ?? [])
const primaryCat = computed(() => cats.value[0])

const coverImage = computed(() => {
  const first = images.value[0]
  return first ? getImageUrl(first.url) : null
})

const catNames = computed(() => cats.value.map((c) => c.name).join(' & '))

const statusLabel = computed(() => {
  const s = primaryCat.value?.catStatus
  if (s === CatStatus.EN_REFUGE) return t('adopt.status-refuge')
  if (s === CatStatus.EN_FAMILLE_ACCUEIL) return t('adopt.status-accueil')
  return null
})

const genderIcon = computed(() => {
  const g = primaryCat.value?.gender
  if (g === Genders.MALE) return 'pi pi-mars'
  if (g === Genders.FEMALE) return 'pi pi-venus'
  return 'pi pi-question'
})

const age = computed(() => {
  const bd = primaryCat.value?.birthDate
  if (!bd) return t('adopt.age-unknown')
  const months = Math.floor((Date.now() - new Date(bd).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  if (months < 12) return t('adopt.age-months', { n: months })
  return t('adopt.age-years', { n: Math.floor(months / 12) })
})

const dragging = ref(false)
const dragX = ref(0)
const dragY = ref(0)
const flingDirection = ref<'like' | 'pass' | null>(null)
let pointerId: number | null = null
let startX = 0
let startY = 0

const cardStyle = computed(() => {
  if (flingDirection.value) {
    const flingX = flingDirection.value === 'like' ? 700 : -700
    return {
      transform: `translate(${flingX}px, ${dragY.value}px) rotate(${flingX / 20}deg)`,
      transition: 'transform 0.35s ease-out, opacity 0.35s ease-out',
      opacity: 0,
    }
  }
  return {
    transform: `translate(${dragX.value}px, ${dragY.value}px) rotate(${dragX.value / 20}deg)`,
    transition: dragging.value ? 'none' : 'transform 0.25s ease',
  }
})

const likeOverlayOpacity = computed(() => Math.min(Math.max(dragX.value / SWIPE_THRESHOLD, 0), 1))
const passOverlayOpacity = computed(() => Math.min(Math.max(-dragX.value / SWIPE_THRESHOLD, 0), 1))

const onPointerDown = (event: PointerEvent) => {
  if (!props.interactive) return
  pointerId = event.pointerId
  startX = event.clientX
  startY = event.clientY
  dragging.value = true
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

const onPointerMove = (event: PointerEvent) => {
  if (!dragging.value || event.pointerId !== pointerId) return
  dragX.value = event.clientX - startX
  dragY.value = event.clientY - startY
}

const endDrag = (event: PointerEvent) => {
  if (!dragging.value || event.pointerId !== pointerId) return
  dragging.value = false
  pointerId = null

  if (dragX.value > SWIPE_THRESHOLD) triggerLike()
  else if (dragX.value < -SWIPE_THRESHOLD) triggerPass()
  else {
    dragX.value = 0
    dragY.value = 0
  }
}

const triggerLike = () => {
  if (flingDirection.value) return
  flingDirection.value = 'like'
  setTimeout(() => emit('like'), 300)
}

const triggerPass = () => {
  if (flingDirection.value) return
  flingDirection.value = 'pass'
  setTimeout(() => emit('pass'), 300)
}

defineExpose({ triggerLike, triggerPass })
</script>
