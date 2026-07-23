<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
  <Toaster position="top-right" :close-button="true" :toast-options="{ class: 'flowboard-sonner' }" />
</template>
