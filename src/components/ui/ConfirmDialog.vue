<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

withDefaults(defineProps<{
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
}>(), {
  confirmLabel: '确认',
  loading: false,
})

defineEmits<{
  close: []
  confirm: []
}>()
</script>

<template>
  <Dialog :open="open" @update:open="open => !open && $emit('close')">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">{{ title }}</DialogTitle>
        <p class="text-sm leading-6 text-[var(--text-secondary)]">{{ description }}</p>
      </DialogHeader>
      <DialogFooter>
        <Button variant="ghost" :disabled="loading" @click="$emit('close')">取消</Button>
        <Button variant="destructive" :loading="loading" @click="$emit('confirm')">{{ confirmLabel }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
