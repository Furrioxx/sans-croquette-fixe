<script setup lang="ts">
import type { CatSheet } from '@/models/CatSheet'
import { RouteNames } from '@/router/routeNames'
import { CatSheetService } from '@/services/catSheetService'
import CatSheetDetailSolo from '@/components/CatSheetDetailSolo.vue'
import CatSheetDetailDuo from '@/components/CatSheetDetailDuo.vue'
import CatChatPanel from '@/components/Chat/CatChatPanel.vue'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const catSheet = ref<CatSheet | null>(null)
const loading = ref(true)
const notFound = ref(false)
const chatPanel = ref<{ openChat: () => Promise<void> } | null>(null)
const catNames = computed(() => catSheet.value?.cats.map((cat) => cat.name).join(' & ') ?? '')

const askQuestion = () => {
  void chatPanel.value?.openChat()
}

watch(
  () => route.params.documentId as string,
  async (documentId) => {
    loading.value = true
    notFound.value = false
    catSheet.value = null
    window.scrollTo({ top: 0 })
    try {
      const res = await CatSheetService.GetPublicCatSheet(documentId)
      catSheet.value = res.data.data
    } catch {
      notFound.value = true
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex w-full flex-col">
    <template v-if="loading">
      <div class="w-full animate-pulse bg-[var(--scf-bg)] px-4 py-10 sm:px-6 md:px-[60px]">
        <div class="page-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div class="aspect-[4/3] rounded-[26px] bg-[var(--scf-accent-soft)]"></div>
          <div class="space-y-4 rounded-[26px] bg-white p-6 sm:p-9">
            <div class="h-6 w-2/3 rounded bg-[var(--scf-bg)]"></div>
            <div class="h-4 rounded bg-[var(--scf-bg)]"></div>
            <div class="h-4 w-5/6 rounded bg-[var(--scf-bg)]"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="notFound || !catSheet">
      <div class="flex min-h-[60vh] w-full flex-col items-center justify-center gap-5 bg-[var(--scf-bg)] px-4 text-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--scf-accent-soft)]">
          <i class="pi pi-exclamation-circle text-3xl text-[var(--scf-accent-dark)]"></i>
        </div>
        <h1 class="display-font text-2xl font-bold text-[var(--scf-ink)]">{{ $t('adopt.detail-not-found') }}</h1>
        <p class="text-[var(--scf-muted)]">{{ $t('adopt.detail-not-found-sub') }}</p>
        <Button
          :label="$t('adopt.detail-back')"
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          rounded
          @click="router.push({ name: RouteNames.ADOPT })"
        />
      </div>
    </template>

    <template v-else>
      <CatSheetDetailDuo
        v-if="catSheet.isDuo"
        :catSheet="catSheet"
        @ask-question="askQuestion"
      />
      <CatSheetDetailSolo v-else :catSheet="catSheet" @ask-question="askQuestion" />
      <CatChatPanel
        ref="chatPanel"
        :cat-sheet-document-id="catSheet.documentId"
        :cat-names="catNames"
      />
    </template>
  </div>
</template>
