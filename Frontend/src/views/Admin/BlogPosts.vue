<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useBlogPostStore } from '@/stores/blogPosts'
import BlogPostModal from '@/components/Modals/BlogPostModal.vue'
import { useAuthStore } from '@/stores/authentication'
import { Roles } from '@/router/Roles'
import confirmationDialogService from '@/services/confirmationDialogService'
import notificationService from '@/services/notificationService'
import { useBlogCategoryStore } from '@/stores/blogCategories'
import SearchInputTextComponent from '@/components/Inputs/SearchInputTextComponent.vue'

const PAGE_SIZE = 10

const blogPostStore = useBlogPostStore()
const blogCategoryStore = useBlogCategoryStore()
const authStore = useAuthStore()

const loading = ref(false)
const search = ref('')
const status = ref<'all' | 'published' | 'draft'>('all')
const categoryName = ref('')
const currentPage = ref(1)
const editModalVisible = ref(false)
const newCategoryName = ref('')
const categoryModalVisible = ref(false)

const blogPosts = computed(() => blogPostStore.blogPosts)
const selectedBlogPost = computed(() => blogPostStore.selectedBlogPost)
const totalRecords = computed(() => blogPostStore.total)
const isAdmin = computed(() => authStore.getUserRole === Roles.ADMIN)
const categories = computed(() => blogCategoryStore.categories)

const loadData = async () => {
  try {
    loading.value = true
    await blogPostStore.fetchBlogPosts({
      page: currentPage.value,
      pageSize: PAGE_SIZE,
      search: search.value.trim() || undefined,
      status: status.value,
      category: categoryName.value || undefined,
    })
  } catch (error) {
    console.error('Error fetching blog posts', error)
    notificationService.showError('Erreur', 'Impossible de charger les articles.')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadData(), blogCategoryStore.fetchCategories()])
})

watch([search, status, categoryName], () => {
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

const openCategoryModal = () => {
  newCategoryName.value = ''
  categoryModalVisible.value = true
}

const createCategory = async () => {
  const name = newCategoryName.value.trim()

  if (!name) {
    notificationService.showError('Erreur', 'Le nom de la catégorie est requis.')
    return
  }

  try {
    await blogCategoryStore.addCategory(name)
    categoryModalVisible.value = false
    notificationService.showSuccess('Succès', 'Catégorie créée.')
  } catch (error) {
    console.error('Error creating category', error)
    const message =
      (error as any)?.response?.data?.error?.message || 'Impossible de créer la catégorie.'
    notificationService.showError('Erreur', message)
  }
}

const deleteCategory = async (documentId: string) => {
  confirmationDialogService.showConfirmDelete(
    'Suppression',
    'Voulez-vous vraiment supprimer cette catégorie ?',
    async () => {
      try {
        await blogCategoryStore.deleteCategory(documentId)
        if (categoryName.value && !categories.value.find((category) => category.slug === categoryName.value)) {
          categoryName.value = ''
        }
        notificationService.showSuccess('Succès', 'Catégorie supprimée.')
      } catch (error) {
        console.error('Error deleting category', error)
        const message =
          (error as any)?.response?.data?.error?.message || 'Impossible de supprimer la catégorie.'
        notificationService.showError('Erreur', message)
      }
    },
    () => {},
  )
}

const formatDate = (value: string) => {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}
</script>

<template>
  <Dialog
    :visible="categoryModalVisible"
    modal
    :header="$t('blog.admin.create-category')"
    class="w-[95vw] max-w-lg"
    @update:visible="categoryModalVisible = $event"
  >
    <div class="flex flex-col gap-4">
      <label for="category-name" class="font-semibold">{{ $t('blog.fields.category') }}</label>
      <InputText id="category-name" v-model="newCategoryName" />
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button :label="$t('cancel')" severity="secondary" outlined @click="categoryModalVisible = false" />
        <Button :label="$t('save')" @click="createCategory" />
      </div>
    </template>
  </Dialog>

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

    <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem_14rem]">
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

      <Select
        v-model="categoryName"
        :options="[
          { label: $t('blog.filters.all-categories'), value: '' },
          ...categories.map((category) => ({ label: category.name, value: category.slug })),
        ]"
        optionLabel="label"
        optionValue="value"
      />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <Button
        :label="$t('blog.admin.create-category')"
        icon="pi pi-tag"
        severity="secondary"
        outlined
        @click="openCategoryModal"
      />

      <Tag
        v-for="category in categories"
        :key="category.id"
        :value="category.name"
        severity="secondary"
      >
        <template #default>
          <div class="flex items-center gap-2">
            <span>{{ category.name }}</span>
              <Button
                v-if="isAdmin"
                icon="pi pi-times"
                text
                rounded
                size="small"
                @click="deleteCategory(category.documentId)"
              />
          </div>
        </template>
      </Tag>
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
          <div class="flex flex-col gap-1">
            <span>{{ slotProps.data.author?.username || '—' }}</span>
            <span class="text-xs text-surface-400">{{ slotProps.data.author?.role?.name || '—' }}</span>
          </div>
        </template>
      </Column>

      <Column :header="$t('blog.fields.category')">
        <template #body="slotProps">
          {{ slotProps.data.category?.name || '—' }}
        </template>
      </Column>

      <Column :header="$t('blog.fields.status')">
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.publishedAt ? $t('blog.published') : $t('blog.draft')"
            :severity="slotProps.data.publishedAt ? 'success' : 'warn'"
          />
        </template>
      </Column>

      <Column :header="$t('blog.fields.date')">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.publishedAt || slotProps.data.createdAt) }}
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
