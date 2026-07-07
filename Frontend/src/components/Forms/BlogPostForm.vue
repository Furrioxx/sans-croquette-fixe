<script setup lang="ts">
import type { BlogCategory } from '@/models/BlogCategory'
import type { BlogPostFormValues } from '@/models/BlogPost'
import type { FormError } from '@/models/FormError'
import { StringUtils } from '@/utils/stringUtils'
import InputTextWithLabel from './elements/InputTextWithLabel.vue'
import SelectWithLabel from './elements/SelectWithLabel.vue'
import TextareaWithLabel from './elements/TextareaWithLabel.vue'
import ToggleSwitchWithLabel from './elements/ToggleSwitchWithLabel.vue'

const model = defineModel<BlogPostFormValues>({ required: true })

defineProps<{
  categories: BlogCategory[]
  errors: FormError[]
  coverPreviewUrl: string | null
}>()

const emit = defineEmits<{
  openCoverPicker: []
  removeCover: []
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <InputTextWithLabel
      name="blog-title"
      :label="$t('blog.fields.title')"
      v-model="model.title"
      required
      :valid="StringUtils.getFieldError(errors, 'title')?.valid"
      :errorMessage="StringUtils.getFieldError(errors, 'title')?.message"
    />

    <SelectWithLabel
      name="blog-category"
      :label="$t('blog.fields.category')"
      :options="categories"
      optionLabel="name"
      optionValue="documentId"
      v-model="model.category"
    />

    <TextareaWithLabel
      name="blog-excerpt"
      :label="$t('blog.fields.excerpt')"
      v-model="model.excerpt"
      :rows="3"
    />

    <ToggleSwitchWithLabel
      name="blog-published"
      :label="$t('blog.fields.isPublished')"
      v-model="model.isPublished"
    />

    <ToggleSwitchWithLabel
      name="blog-featured"
      :label="$t('blog.fields.isFeatured')"
      v-model="model.isFeatured"
    />

    <TextareaWithLabel
      name="blog-content"
      :label="$t('blog.fields.content')"
      v-model="model.content"
      :rows="12"
      required
      :valid="StringUtils.getFieldError(errors, 'content')?.valid"
      :errorMessage="StringUtils.getFieldError(errors, 'content')?.message"
    />
    <div class="flex flex-col gap-3">
      <label class="font-semibold">{{ $t('blog.fields.cover') }}</label>

      <div
        class="flex min-h-44 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-surface-300 bg-surface-50 p-6 text-center"
      >
        <template v-if="coverPreviewUrl">
          <img
            :src="coverPreviewUrl"
            :alt="model.title"
            class="h-48 w-full rounded-xl border border-surface-200 object-cover"
          />
        </template>
        <template v-else>
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <i class="pi pi-image text-2xl text-primary-500"></i>
          </div>
          <div class="space-y-1">
            <p class="font-medium text-surface-700">{{ $t('blog.admin.cover-empty') }}</p>
            <p class="text-sm text-surface-500">{{ $t('blog.admin.cover-help') }}</p>
          </div>
        </template>

        <div class="flex flex-wrap justify-center gap-2">
          <Button
            :label="coverPreviewUrl ? $t('blog.admin.change-cover') : $t('blog.admin.add-cover')"
            icon="pi pi-upload"
            severity="secondary"
            outlined
            @click="emit('openCoverPicker')"
          />
          <Button
            v-if="coverPreviewUrl"
            :label="$t('blog.admin.remove-cover')"
            icon="pi pi-times"
            severity="secondary"
            outlined
            @click="emit('removeCover')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
