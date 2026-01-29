<script setup lang="ts">
import LoginFormComponent from '@/components/Forms/Auth/LoginFormComponent.vue';
import { useManager } from '@/router/manager';

const title = useManager().getCurrentRouteTitle()
</script>

<template>
  <div class="margin-base">
    <h1 class="font-semibold text-4xl tracking-tight mb-6">{{ title }}</h1>
    <LoginFormComponent />
  </div>
</template>