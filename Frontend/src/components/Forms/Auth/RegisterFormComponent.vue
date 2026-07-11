<script setup lang="ts">
import type { UserPost } from '@/models/User'
import { RouteNames } from '@/router/routeNames'
import { useAuthStore } from '@/stores/authentication'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const userPost = reactive<UserPost>({
  username: '',
  email: '',
  password: '',
  newsletterOptIn: false,
})
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref<boolean>(false)
const errorMessage = ref<string>()
const error = ref<boolean>(false)

const passwordRules = computed(() => {
  const password = userPost.password ?? ''

  return {
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    match: password.length > 0 && password === confirmPassword.value,
  }
})

const isRegisterValid = computed(() => Object.values(passwordRules.value).every(Boolean))

const onSubmit = async () => {
  if (!isRegisterValid.value) {
    errorMessage.value = t('auth.passwordRulesError')
    error.value = true
    return
  }

  try {
    loading.value = true
    error.value = false
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
  <div class="auth-form-shell">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <div class="space-y-2">
        <label for="register-email" class="text-sm font-semibold text-[var(--scf-ink)]">
          {{ $t('auth.email') }}
        </label>
        <InputText
          id="register-email"
          v-model="userPost.email"
          type="email"
          :placeholder="$t('auth.email')"
          class="auth-input"
          required
        />
      </div>

      <div class="space-y-2">
        <label for="register-username" class="text-sm font-semibold text-[var(--scf-ink)]">
          {{ $t('auth.username') }}
        </label>
        <InputText
          id="register-username"
          v-model="userPost.username"
          type="text"
          :placeholder="$t('auth.username')"
          class="auth-input"
          required
        />
      </div>

      <div class="space-y-2">
        <label for="register-password" class="text-sm font-semibold text-[var(--scf-ink)]">
          {{ $t('auth.password') }}
        </label>
        <div class="auth-password-field">
          <InputText
            id="register-password"
            v-model="userPost.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('auth.password')"
            class="auth-input"
            required
          />
          <button
            type="button"
            class="auth-password-toggle"
            :aria-label="showPassword ? $t('auth.hidePassword') : $t('auth.showPassword')"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <label for="register-confirm-password" class="text-sm font-semibold text-[var(--scf-ink)]">
          {{ $t('auth.confirmPassword') }}
        </label>
        <div class="auth-password-field">
          <InputText
            id="register-confirm-password"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="$t('auth.confirmPassword')"
            class="auth-input"
            required
          />
          <button
            type="button"
            class="auth-password-toggle"
            :aria-label="showConfirmPassword ? $t('auth.hidePassword') : $t('auth.showPassword')"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>
      </div>

      <div class="auth-password-rules">
        <p class="auth-password-rule" :class="{ 'is-valid': passwordRules.uppercase }">
          <i class="pi" :class="passwordRules.uppercase ? 'pi-check-circle' : 'pi-times-circle'"></i>
          {{ $t('auth.passwordRules.uppercase') }}
        </p>
        <p class="auth-password-rule" :class="{ 'is-valid': passwordRules.number }">
          <i class="pi" :class="passwordRules.number ? 'pi-check-circle' : 'pi-times-circle'"></i>
          {{ $t('auth.passwordRules.number') }}
        </p>
        <p class="auth-password-rule" :class="{ 'is-valid': passwordRules.special }">
          <i class="pi" :class="passwordRules.special ? 'pi-check-circle' : 'pi-times-circle'"></i>
          {{ $t('auth.passwordRules.special') }}
        </p>
        <p class="auth-password-rule" :class="{ 'is-valid': passwordRules.match }">
          <i class="pi" :class="passwordRules.match ? 'pi-check-circle' : 'pi-times-circle'"></i>
          {{ $t('auth.passwordRules.match') }}
        </p>
      </div>

      <label class="auth-remember-row">
        <Checkbox v-model="userPost.newsletterOptIn" binary inputId="newsletter-optin" />
        <span>{{ $t('auth.newsletterOptIn') }}</span>
      </label>

      <Message v-if="error" severity="error" class="rounded-2xl">{{ errorMessage }}</Message>

      <Button :label="$t('register')" :loading="loading" type="submit" class="auth-submit-btn" />
    </form>

    <div class="auth-form-footer">
      <p>{{ $t('auth.alreadyAccount') }}</p>
      <button
        type="button"
        class="font-semibold text-[var(--scf-accent-dark)] underline decoration-transparent underline-offset-4 transition hover:decoration-current"
        @click="router.push({ name: RouteNames.LOGIN })"
      >
        {{ $t('login') }}
      </button>
    </div>
  </div>
</template>
