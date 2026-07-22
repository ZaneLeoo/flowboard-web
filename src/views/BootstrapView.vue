<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main class="min-h-svh bg-[var(--surface-canvas)] px-5 py-6 text-[var(--text-primary)] sm:px-8 sm:py-10">
    <section class="mx-auto flex min-h-[calc(100svh-3rem)] max-w-5xl flex-col justify-between rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 shadow-[var(--shadow-float)] sm:p-10">
      <header class="flex items-center justify-between">
        <span class="text-lg font-semibold tracking-[-0.03em]">{{ t('app.name') }}</span>
        <span class="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent-primary)]">
          {{ t('bootstrap.eyebrow') }}
        </span>
      </header>

      <div class="max-w-2xl py-16 sm:py-24">
        <p class="mb-5 text-sm font-medium text-[var(--accent-primary)]">{{ t('app.tagline') }}</p>
        <h1 class="max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl">
          {{ t('bootstrap.title') }}
        </h1>
        <p class="mt-6 max-w-lg text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
          {{ t('bootstrap.description') }}
        </p>
      </div>

      <ul class="grid gap-3 sm:grid-cols-3">
        <li v-for="item in ['design', 'delivery', 'api']" :key="item" class="rounded-2xl border border-[var(--border-subtle)] bg-white/70 p-4 text-sm font-medium text-[var(--text-secondary)]">
          {{ t(`bootstrap.${item}`) }}
        </li>
      </ul>
    </section>
  </main>
</template>
