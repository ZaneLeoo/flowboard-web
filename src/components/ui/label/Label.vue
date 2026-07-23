<script setup lang="ts">
import { Label as LabelPrimitive } from 'reka-ui'

import { cn } from '@/lib/utils'

withDefaults(defineProps<{
  class?: string
}>(), {
  class: undefined,
})
</script>

<template>
  <LabelPrimitive :class="cn('text-sm font-semibold leading-none text-[var(--text-primary)] peer-disabled:cursor-not-allowed peer-disabled:opacity-70', $props.class)">
    <slot />
  </LabelPrimitive>
</template>
