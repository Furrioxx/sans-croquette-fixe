<script setup lang="ts">
import { useManager } from '@/router/manager'

const title = useManager().getCurrentRouteTitle()
</script>

<template>
  <div class="margin-base">
    <div>
      <h1 class="font-semibold text-4xl tracking-tight mb-6">{{ title }}</h1>
    </div>
  </div>
</template>
