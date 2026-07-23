<script setup lang="ts">
import { SelectContent as SelectContentPrimitive, SelectPortal, SelectViewport } from 'reka-ui'

import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  class?: string
}>(), {
  class: undefined,
})
</script>

<template>
  <SelectPortal>
    <SelectContentPrimitive v-bind="$attrs" position="popper" :side-offset="6" :class="cn('relative z-50 max-h-[var(--reka-select-content-available-height)] min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-1 shadow-[var(--shadow-panel)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95', $props.class)">
      <SelectViewport class="max-h-72 p-1"><slot /></SelectViewport>
    </SelectContentPrimitive>
  </SelectPortal>
</template>
