<script setup lang="ts">
import { XIcon } from 'lucide-vue-next'
import { DialogClose, DialogContent as DialogContentPrimitive, DialogOverlay, DialogPortal } from 'reka-ui'

import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  class?: string
  showClose?: boolean
}>(), {
  class: undefined,
  showClose: true,
})
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="fixed inset-0 z-50 bg-[#17191f]/20 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
    <DialogContentPrimitive v-bind="$attrs" :class="cn('fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-[1.5rem] border border-white/90 bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-float)] outline-none duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:p-7', $props.class)">
      <slot />
      <DialogClose v-if="showClose" class="absolute right-4 top-4 grid size-9 place-items-center rounded-xl text-[var(--text-secondary)] outline-none transition-colors hover:bg-[var(--surface-muted)] focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]" aria-label="关闭">
        <XIcon class="size-4" />
      </DialogClose>
    </DialogContentPrimitive>
  </DialogPortal>
</template>
