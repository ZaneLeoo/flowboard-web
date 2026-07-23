<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  percent: number
  size?: number
  strokeWidth?: number
}>(), {
  size: 76,
  strokeWidth: 6,
})

const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const clampedPercent = computed(() => Math.min(100, Math.max(0, props.percent)))
const dashOffset = computed(() => circumference.value * (1 - clampedPercent.value / 100))
</script>

<template>
  <span
    class="relative inline-grid shrink-0 place-items-center"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="img"
    :aria-label="`完成度 ${Math.round(clampedPercent)}%`"
  >
    <svg :width="size" :height="size" class="-rotate-90" aria-hidden="true">
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        stroke="#ececee"
        :stroke-width="strokeWidth"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        stroke="var(--accent-primary)"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        class="transition-[stroke-dashoffset] duration-500 ease-out"
      />
    </svg>
    <span class="absolute text-sm font-bold text-[var(--text-primary)]">{{ Math.round(clampedPercent) }}%</span>
  </span>
</template>
