<script setup lang="ts">
withDefaults(defineProps<{
  showName?: boolean
  size?: 'sm' | 'md'
}>(), {
  showName: true,
  size: 'md',
})
</script>

<template>
  <span
    role="img"
    class="inline-flex items-center gap-2.5 text-[var(--text-primary)]"
    :class="size === 'sm' ? 'gap-2 text-base' : 'text-lg'"
    aria-label="FlowBoard"
  >
    <svg
      class="shrink-0"
      :class="size === 'sm' ? 'size-7' : 'size-8'"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path fill="var(--accent-primary)" d="M5 5.5 18.5 2v8L11 12.2v6.15l7.5-2.15V24L5 28z" />
      <path fill="var(--accent-primary-hover)" d="m18.5 10 8.5-2.25v8.05l-8.5 2.4zm0 8.6 8.5-2.4v8.05L18.5 26.6z" />
      <path fill="#8EB5FF" d="M11 12.2 18.5 10v8.2L11 20.35z" />
    </svg>
    <span v-if="showName" class="font-semibold tracking-[-0.04em]">FlowBoard</span>
  </span>
</template>
