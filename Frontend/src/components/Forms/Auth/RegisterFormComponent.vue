<script setup lang="ts">
import type { UserPost } from '@/models/User'
import { useAuthStore } from '@/stores/authentication'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router/routeNames'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const userPost = reactive<UserPost>({
  username: '',
  email: '',
  password: '',
})
const loading = ref<boolean>(false)
const errorMessage = ref<string>()
const error = ref<boolean>(false)

const onSubmit = async () => {
  try {
    loading.value = true
    await authStore.register(userPost)
    
  } catch (err: Error | any) {
    errorMessage.value = t('auth.registerFail')
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
    <InputText v-model="userPost.email" type="email" :placeholder="$t('auth.email')" required />
    <InputText v-model="userPost.username" type="text" :placeholder="$t('auth.username')" required />
    <InputText
      v-model="userPost.password"
      type="password"
      :placeholder="$t('auth.password')"
      required
    />
    <Message v-if="error" severity="error" variant="simple">{{ errorMessage }}</Message>
    <Button :label="$t('register')" :loading="loading" type="submit" />
  </form>
  <div class="flex gap-1">
    <p>{{ $t('auth.alreadyAccount') }}</p>
    <span class="cursor-pointer text-indigo-400" @click="router.push({ name: RouteNames.LOGIN })">{{
      $t('login')
    }}</span>
  </div>
</template>