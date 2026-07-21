<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import CatSheetModal from '@/components/Modals/CatSheetModal.vue'
import CatGalleryModal from '@/components/Modals/CatGalleryModal.vue'
import { useCatSheetStore } from '@/stores/catSheets'
import type { CatSheet } from '@/models/CatSheet'
import confirmationDialogService from '@/services/confirmationDialogService'
import notificationService from '@/services/notificationService'
import { useI18n } from 'vue-i18n'

const catSheetStore = useCatSheetStore()
const { t } = useI18n()
const loading = ref<boolean>(false)
const op = ref()
const editModalVisible = ref<boolean>(false)
const galleryModalVisible = ref<boolean>(false)
const selectedCatSheetId = ref<number | null>(null)
const selectedGalleryCatSheet = ref<CatSheet | null>(null)
const showArchived = ref(false)

const catSheets = computed(() => catSheetStore.catSheets)
const activeCatSheets = computed(() => catSheets.value.filter((sheet) => !sheet.isArchived))
const archivedCatSheets = computed(() => catSheets.value.filter((sheet) => sheet.isArchived))
const displayedCatSheets = computed(() =>
  showArchived.value ? archivedCatSheets.value : activeCatSheets.value,
)
const selectedCatSheet = computed(() => catSheetStore.selectedCatSheet)
const actionCatSheet = computed(
  () => catSheets.value.find((sheet) => sheet.id === selectedCatSheetId.value) ?? null,
)

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
  op.value.hide()
  catSheetStore.selectedCatSheet = actionCatSheet.value
  editModalVisible.value = true
}

const toggleCatSheetArchive = () => {
  op.value.hide()
  const catSheet = actionCatSheet.value
  if (!catSheet) return

  const willArchive = !catSheet.isArchived
  const names = catSheet.cats.map((cat) => cat.name).join(' & ')
  confirmationDialogService.showConfirmValidation(
    t(willArchive ? 'admin.cat.archive-title' : 'admin.cat.restore-title'),
    t(willArchive ? 'admin.cat.archive-confirmation' : 'admin.cat.restore-confirmation', {
      names,
    }),
    async () => {
      try {
        loading.value = true
        await catSheetStore.setCatSheetArchived(catSheet.documentId, willArchive)
        notificationService.showSuccess(
          t('success'),
          t(willArchive ? 'admin.cat.archive-success' : 'admin.cat.restore-success'),
        )
      } catch (error) {
        console.error('Error updating cat sheet archive state:', error)
        const message =
          (error as any)?.response?.data?.error?.message ||
          t(willArchive ? 'admin.cat.archive-error' : 'admin.cat.restore-error')
        notificationService.showError(t('error'), message)
      } finally {
        loading.value = false
      }
    },
    () => undefined,
  )
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

  <div class="mb-3 flex w-fit items-center gap-1 rounded-xl bg-surface-100 p-1">
    <button
      type="button"
      class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
      :class="
        !showArchived
          ? 'bg-white text-surface-900 shadow-sm'
          : 'text-surface-500 hover:text-surface-800'
      "
      @click="showArchived = false"
    >
      <i class="pi pi-list"></i>
      <span>{{ $t('admin.cat.active-tab') }}</span>
      <span class="rounded-full bg-surface-200 px-2 py-0.5 text-xs">{{ activeCatSheets.length }}</span>
    </button>
    <button
      type="button"
      class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
      :class="
        showArchived
          ? 'bg-white text-surface-900 shadow-sm'
          : 'text-surface-500 hover:text-surface-800'
      "
      @click="showArchived = true"
    >
      <i class="pi pi-history"></i>
      <span>{{ $t('admin.cat.history-tab') }}</span>
      <span class="rounded-full bg-surface-200 px-2 py-0.5 text-xs">{{ archivedCatSheets.length }}</span>
    </button>
  </div>

  <div class="admin-table-shell">
    <DataTable
      :value="displayedCatSheets"
      :loading="loading"
      tableStyle="min-width: 50rem"
      stripedRows
      :rowHover="true"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div class="text-xl font-bold">
              {{ $t(showArchived ? 'admin.cat.history-title' : 'admin.cat.cats') }}
            </div>
            <p v-if="showArchived" class="mt-1 text-sm font-normal text-surface-500">
              {{ $t('admin.cat.history-helper') }}
            </p>
          </div>
          <Button
            icon="pi pi-refresh"
            v-tooltip.top="$t('refresh')"
            rounded
            raised
            @click="loadData"
          />
        </div>
      </template>

      <template #empty>
        <div class="py-8 text-center text-surface-500">
          {{ $t(showArchived ? 'admin.cat.history-empty' : 'admin.cat.active-empty') }}
        </div>
      </template>

    <Column :header="$t('admin.cat.name')">
      <template #body="slotProps">
        <div class="flex flex-col gap-1">
          <span v-for="cat in slotProps.data.cats" :key="cat.id" class="font-medium">
            {{ cat.name }}
          </span>
          <Tag
            v-if="slotProps.data.isArchived"
            :value="$t('admin.cat.archive-status')"
            severity="secondary"
            rounded
            class="mt-1 w-fit"
          />
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
    <div class="flex min-w-40 flex-col gap-1">
      <button type="button" class="btn-bis text-gray-600 hover:text-gray-900" @click="editCatSheet">
        <i class="pi pi-pencil"></i>
        <span>{{ $t('update') }}</span>
      </button>
      <button
        v-if="actionCatSheet"
        type="button"
        class="btn-bis"
        :class="
          actionCatSheet.isArchived
            ? 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
            : 'text-amber-700 hover:bg-amber-50 hover:text-amber-800'
        "
        @click="toggleCatSheetArchive"
      >
        <i :class="actionCatSheet.isArchived ? 'pi pi-replay' : 'pi pi-inbox'"></i>
        <span>
          {{
            $t(
              actionCatSheet.isArchived
                ? 'admin.cat.restore-action'
                : 'admin.cat.archive-action',
            )
          }}
        </span>
      </button>
    </div>
  </Popover>
</template>
