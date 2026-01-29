<script setup lang="ts">
import { useManager } from '@/router/manager';
import RegisterFormComponenet from '@/components/Forms/Auth/RegisterFormComponent.vue';

const title = useManager().getCurrentRouteTitle()
</script>

<template>
  <div class="margin-base">
    <h1 class="font-semibold text-4xl tracking-tight mb-6">{{ title }}</h1>
    <RegisterFormComponenet />
  </div>
</template>