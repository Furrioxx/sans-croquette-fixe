<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import notificationService from './services/notificationService.js'
import { useConfirm } from 'primevue/useconfirm'
import confirmationPopupService from './services/confirmationPopupService.js'
import confirmationDialogService from './services/confirmationDialogService.js'

const confirm = useConfirm()
notificationService.init(useToast())
confirmationPopupService.init(confirm)
confirmationDialogService.init(confirm)
</script>

<template>
  <RouterView />
</template>

<style>
.margin-base {
  margin: 0 20em;
}

.margin-base-light {
  margin: 0 1em;
}
.p-progressspinner-circle {
  stroke: #fc7676 !important;
}
@media (max-width: 768px) {
  .margin-base {
    margin: 0 0.5em;
  }

  .margin-base-light {
    margin: 0 1em;
  }
}

/* Tablettes portrait et petits écrans */
@media (min-width: 769px) and (max-width: 1024px) {
  .margin-base {
    margin: 0 1em;
  }

  .margin-base-light {
    margin: 0 1em;
  }
}
</style>
