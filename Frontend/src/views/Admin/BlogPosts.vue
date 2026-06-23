<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useBlogPostStore } from '@/stores/blogPosts'
import BlogPostModal from '@/components/Modals/BlogPostModal.vue'
import { useAuthStore } from '@/stores/authentication'
import { Roles } from '@/router/Roles'
import confirmationDialogService from '@/services/confirmationDialogService'
import notificationService from '@/services/notificationService'

const PAGE_SIZE = 10

const blogPostStore = useBlogPostStore()
const authStore = useAuthStore()

const loading = ref(false)
const search = ref('')
const status = ref<'all' | 'published' | 'draft'>('all')
const currentPage = ref(1)
const editModalVisible = ref(false)

const blogPosts = computed(() => blogPostStore.blogPosts)
const selectedBlogPost = computed(() => blogPostStore.selectedBlogPost)
const totalRecords = computed(() => blogPostStore.total)
const isAdmin = computed(() => authStore.getUserRole === Roles.ADMIN)

const loadData = async () => {
  try {
    loading.value = true
    await blogPostStore.fetchBlogPosts({
      page: currentPage.value,
      pageSize: PAGE_SIZE,
      search: search.value.trim() || undefined,
      status: status.value,
    })
  } catch (error) {
    console.error('Error fetching blog posts', error)
    notificationService.showError('Erreur', 'Impossible de charger les articles.')
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

watch([search, status], () => {
  currentPage.value = 1
  loadData()
})

watch(currentPage, loadData)

const openCreateModal = () => {
  blogPostStore.selectedBlogPost = null
  editModalVisible.value = true
}

const editBlogPost = async (documentId: string) => {
  try {
    await blogPostStore.fetchBlogPostById(documentId)
    editModalVisible.value = true
  } catch (error) {
    console.error('Error fetching blog post', error)
    notificationService.showError('Erreur', 'Impossible de charger l’article.')
  }
}

const closeModal = (visible: boolean) => {
  editModalVisible.value = visible
  if (!visible) {
    blogPostStore.selectedBlogPost = null
  }
}

const confirmDelete = (documentId: string) => {
  confirmationDialogService.showConfirmDelete(
    'Suppression',
    'Voulez-vous vraiment supprimer cet article ?',
    async () => {
      try {
        await blogPostStore.deleteBlogPost(documentId)
        notificationService.showSuccess('Succès', 'Article supprimé.')
        await loadData()
      } catch (error) {
        console.error('Error deleting blog post', error)
        notificationService.showError('Erreur', 'Impossible de supprimer l’article.')
      }
    },
    () => {},
  )
}

const onPageChange = (event: { page: number }) => {
  currentPage.value = event.page + 1
}

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}
</script>

<template>
  <BlogPostModal
    :blogPost="selectedBlogPost"
    :visible="editModalVisible"
    @update:visible="closeModal"
    @update:datas="loadData"
  />

  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">{{ $t('blog.admin.title') }}</h1>
        <p class="text-sm text-surface-500">{{ $t('blog.admin.subtitle') }}</p>
      </div>

      <Button
        :label="$t('blog.admin.create')"
        icon="pi pi-plus"
        iconPos="right"
        @click="openCreateModal"
      />
    </div>

    <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]">
      <SearchInputTextComponent
        :placeholder="$t('blog.search')"
        :value="search"
        @update:value="search = $event"
      />

      <Select
        v-model="status"
        :options="[
          { label: $t('blog.filters.all'), value: 'all' },
          { label: $t('blog.filters.published'), value: 'published' },
          { label: $t('blog.filters.draft'), value: 'draft' },
        ]"
        optionLabel="label"
        optionValue="value"
      />
    </div>

    <DataTable
      :value="blogPosts"
      :loading="loading"
      tableStyle="min-width: 50rem"
      stripedRows
      :rowHover="true"
    >
      <Column :header="$t('blog.fields.title')">
        <template #body="slotProps">
          <div class="flex flex-col gap-1">
            <span class="font-medium">{{ slotProps.data.title }}</span>
            <span class="line-clamp-2 text-sm text-surface-500">
              {{ slotProps.data.excerpt || slotProps.data.content }}
            </span>
          </div>
        </template>
      </Column>

      <Column :header="$t('blog.fields.author')">
        <template #body="slotProps">
          {{ slotProps.data.author?.username || '—' }}
        </template>
      </Column>

      <Column :header="$t('blog.fields.status')">
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.isPublished ? $t('blog.published') : $t('blog.draft')"
            :severity="slotProps.data.isPublished ? 'success' : 'warn'"
          />
        </template>
      </Column>

      <Column :header="$t('blog.fields.date')">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.createdAt) }}
        </template>
      </Column>

      <Column :header="$t('actions')">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <Button
              icon="pi pi-pencil"
              rounded
              text
              @click="editBlogPost(slotProps.data.documentId)"
            />
            <Button
              v-if="isAdmin"
              icon="pi pi-trash"
              rounded
              text
              severity="danger"
              @click="confirmDelete(slotProps.data.documentId)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Paginator
      v-if="totalRecords > PAGE_SIZE"
      :rows="PAGE_SIZE"
      :totalRecords="totalRecords"
      :first="(currentPage - 1) * PAGE_SIZE"
      @page="onPageChange"
    />
  </div>
</template>
