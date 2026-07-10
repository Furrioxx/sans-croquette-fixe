<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import CatSheetModal from '@/components/Modals/CatSheetModal.vue'
import CatGalleryModal from '@/components/Modals/CatGalleryModal.vue'
import { useCatSheetStore } from '@/stores/catSheets'
import type { CatSheet } from '@/models/CatSheet'

const catSheetStore = useCatSheetStore()
const loading = ref<boolean>(false)
const op = ref()
const editModalVisible = ref<boolean>(false)
const galleryModalVisible = ref<boolean>(false)
const selectedCatSheetId = ref<number | null>(null)
const selectedGalleryCatSheet = ref<CatSheet | null>(null)

const catSheets = computed(() => catSheetStore.catSheets)
const selectedCatSheet = computed(() => catSheetStore.selectedCatSheet)

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    loading.value = true
    await catSheetStore.fetchCatSheets()
  } catch (error) {
    console.error('Error fetching cat sheets:', error)
  } finally {
    loading.value = false
  }
}

const togglePopover = (event: any, catSheetId: number) => {
  op.value.toggle(event)
  selectedCatSheetId.value = catSheetId
}

const editCatSheet = () => {
  catSheetStore.selectedCatSheet =
    catSheets.value.find((s) => s.id === selectedCatSheetId.value) ?? null
  editModalVisible.value = true
}

const closeModal = (visible: boolean) => {
  editModalVisible.value = visible
  catSheetStore.selectedCatSheet = null
}

const openGallery = (catSheet: CatSheet) => {
  selectedGalleryCatSheet.value = catSheet
  galleryModalVisible.value = true
}

const closeGallery = (visible: boolean) => {
  galleryModalVisible.value = visible
  if (!visible) selectedGalleryCatSheet.value = null
}
</script>

<template>
  <CatSheetModal
    :catSheet="selectedCatSheet"
    :visible="editModalVisible"
    @update:visible="closeModal($event)"
    @update:datas="loadData"
  />

  <CatGalleryModal
    :catSheet="selectedGalleryCatSheet"
    :visible="galleryModalVisible"
    @update:visible="closeGallery($event)"
  />

  <Button
    class="mb-3"
    :label="$t('admin.cat.cat-create')"
    icon="pi pi-plus"
    iconPos="right"
    @click="editModalVisible = true"
  />

  <div class="admin-table-shell">
    <DataTable
      :value="catSheets"
      :loading="loading"
      tableStyle="min-width: 50rem"
      stripedRows
      :rowHover="true"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">{{ $t('admin.cat.cats') }}</span>
          <Button
            icon="pi pi-refresh"
            v-tooltip.top="$t('refresh')"
            rounded
            raised
            @click="loadData"
          />
        </div>
      </template>

    <Column :header="$t('admin.cat.name')">
      <template #body="slotProps">
        <div class="flex flex-col gap-1">
          <span v-for="cat in slotProps.data.cats" :key="cat.id" class="font-medium">
            {{ cat.name }}
          </span>
        </div>
      </template>
    </Column>

    <Column :header="$t('admin.cat.linkedVolunteer')">
      <template #body="slotProps">
        <div v-if="slotProps.data.linkedVolunteer" class="flex items-center gap-2">
          <i class="pi pi-user text-indigo-400 text-sm"></i>
          <span>{{ slotProps.data.linkedVolunteer.username }}</span>
        </div>
        <span v-else class="text-surface-400">—</span>
      </template>
    </Column>

    <Column :header="$t('admin.cat.tarification')">
      <template #body="slotProps">
        <span v-if="slotProps.data.tarification">{{ slotProps.data.tarification.label }}</span>
        <span v-else class="text-surface-400">—</span>
      </template>
    </Column>

    <Column :header="$t('admin.cat.isDuo')">
      <template #body="slotProps">
        <i class="pi pi-heart-fill text-pink-500 text-lg" v-if="slotProps.data.isDuo"></i>
        <i class="pi pi-minus text-surface-400" v-else></i>
      </template>
    </Column>

    <Column :header="$t('admin.cat.step-images')">
      <template #body="slotProps">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1">
            <i class="pi pi-image text-surface-400 text-sm"></i>
            <span class="text-sm font-medium">{{ slotProps.data.images?.length || 0 }}</span>
          </div>
          <Button
            icon="pi pi-images"
            rounded
            text
            severity="info"
            size="small"
            v-tooltip.top="$t('admin.cat.gallery-view')"
            :disabled="!slotProps.data.images?.length"
            @click="openGallery(slotProps.data)"
          />
        </div>
      </template>
    </Column>

      <Column :header="$t('actions')">
        <template #body="slotProps">
          <Button
            icon="pi pi-ellipsis-v"
            rounded
            text
            v-tooltip.top="$t('settings')"
            @click="togglePopover($event, slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
  </div>

  <Popover ref="op">
    <div class="flex flex-col gap-4">
      <li class="btn-bis text-gray-600 hover:text-gray-900" @click="editCatSheet">
        <i class="pi pi-pencil"></i>
        <span>{{ $t('update') }}</span>
      </li>
    </div>
  </Popover>
</template>
