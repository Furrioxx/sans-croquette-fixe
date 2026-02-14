<script setup lang="ts">
import type { UserLogin } from '@/models/User'
import { RouteNames } from '@/router/routeNames'
import { useAuthStore } from '@/stores/authentication'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const userLogin = reactive<UserLogin>({
  email: '',
  password: ''
})
const loading = ref<boolean>(false)
const errorMessage = ref<string>()
const error = ref<boolean>(false)

const onSubmit = async () => {
  try {
    loading.value = true
    await authStore.login(userLogin)
  } catch (err: Error | any) {
    errorMessage.value = t('auth.loginFail')
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
    <InputText v-model="userLogin.email" type="email" :placeholder="$t('auth.email')" required />
    <InputText
      v-model="userLogin.password"
      type="password"
      :placeholder="$t('auth.password')"
      required
    />
    <Message v-if="error" severity="error" variant="simple">{{ errorMessage }}</Message>
    <Button :label="$t('login')" :loading="loading" type="submit" />
  </form>
  <div class="flex gap-1">
    <p>{{ $t('auth.noAccount') }}</p>
    <span
      class="cursor-pointer text-indigo-400"
      @click="router.push({ name: RouteNames.REGISTER })"
      >{{ $t('register') }}</span
    >
  </div>
</template>