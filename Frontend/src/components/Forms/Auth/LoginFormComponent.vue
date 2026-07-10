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
  identifier: '',
  password: '',
})
const loading = ref<boolean>(false)
const errorMessage = ref<string>()
const error = ref<boolean>(false)
const showPassword = ref(false)
const rememberMe = ref(false)

const onSubmit = async () => {
  try {
    loading.value = true
    error.value = false
    await authStore.login(userLogin, rememberMe.value)
  } catch (err: Error | any) {
    errorMessage.value = t('auth.loginFail')
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-form-shell">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <div class="space-y-2">
        <label for="login-email" class="text-sm font-semibold text-[var(--scf-ink)]">
          {{ $t('auth.email') }}
        </label>
        <InputText
          id="login-email"
          v-model="userLogin.identifier"
          type="email"
          :placeholder="$t('auth.email-placeholder')"
          class="auth-input"
          autocomplete="email"
          required
        />
      </div>

      <div class="space-y-2">
        <label for="login-password" class="text-sm font-semibold text-[var(--scf-ink)]">
          {{ $t('auth.password') }}
        </label>
        <div class="auth-password-field">
          <InputText
            id="login-password"
            v-model="userLogin.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('auth.password-placeholder')"
            class="auth-input pr-12"
            autocomplete="current-password"
            required
          />
          <button
            type="button"
            class="auth-password-toggle"
            :aria-label="showPassword ? $t('auth.hide-password') : $t('auth.show-password')"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>
      </div>

      <label class="flex items-center gap-2 text-sm font-medium text-[var(--scf-text)]">
        <input v-model="rememberMe" type="checkbox" class="auth-checkbox" />
        <span>{{ $t('auth.rememberMe') }}</span>
      </label>

      <Message v-if="error" severity="error" class="rounded-2xl">{{ errorMessage }}</Message>

      <Button
        :label="$t('login')"
        :loading="loading"
        type="submit"
        icon="pi pi-arrow-right"
        iconPos="right"
        class="auth-submit-btn"
      />
    </form>

    <div class="auth-form-footer">
      <p>{{ $t('auth.noAccount') }}</p>
      <button
        type="button"
        class="font-semibold text-[var(--scf-accent-dark)] underline decoration-transparent underline-offset-4 transition hover:decoration-current"
        @click="router.push({ name: RouteNames.REGISTER })"
      >
        {{ $t('register') }}
      </button>
    </div>
  </div>
</template>
