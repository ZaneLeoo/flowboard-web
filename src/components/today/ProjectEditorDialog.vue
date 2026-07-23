<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { reactive } from 'vue'

import type { ProjectColor, ProjectDraft } from '../../features/workspace/api'
import AppButton from '../ui/AppButton.vue'

defineProps<{
  open: boolean
  submitting?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [input: ProjectDraft]
}>()

const form = reactive({
  name: '',
  description: '',
  color: 'BLUE' as ProjectColor,
})

const colors: Array<{ value: ProjectColor; label: string; className: string }> = [
  { value: 'BLUE', label: '蓝', className: 'bg-[#4e8ff5]' },
  { value: 'VIOLET', label: '紫', className: 'bg-[#9a77ed]' },
  { value: 'GREEN', label: '绿', className: 'bg-[#48a66b]' },
  { value: 'AMBER', label: '琥珀', className: 'bg-[#e9a11d]' },
  { value: 'ROSE', label: '玫瑰', className: 'bg-[#df6e91]' },
]

function submit() {
  if (!form.name.trim()) return
  emit('submit', {
    name: form.name.trim(),
    description: form.description.trim() || null,
    color: form.color,
  })
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 grid place-items-end bg-[#16191f]/20 p-3 backdrop-blur-[2px] sm:place-items-center sm:p-6" @mousedown.self="$emit('close')">
      <section class="w-full max-w-md rounded-[1.5rem] border border-white/90 bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-float)] sm:p-7" role="dialog" aria-modal="true" aria-label="新建项目">
        <header class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold tracking-[0.08em] text-[var(--accent-primary)]">项目</p>
            <h2 class="mt-1 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">新建项目</h2>
          </div>
          <button class="grid size-9 place-items-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)]" type="button" aria-label="关闭" @click="$emit('close')">
            <Icon icon="solar:close-circle-linear" class="size-5" aria-hidden="true" />
          </button>
        </header>

        <form class="mt-6 grid gap-4" @submit.prevent="submit">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[var(--text-primary)]">项目名称</span>
            <input v-model="form.name" class="min-h-11 rounded-xl border border-[var(--border-subtle)] bg-white px-3.5 text-sm outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)]" maxlength="60" placeholder="例如：产品设计" autofocus>
          </label>
          <div class="grid gap-2">
            <span class="text-sm font-semibold text-[var(--text-primary)]">项目颜色</span>
            <div class="flex gap-2">
              <button v-for="color in colors" :key="color.value" class="grid size-9 place-items-center rounded-full border-2 transition-transform active:scale-95" :class="form.color === color.value ? 'border-[var(--text-primary)]' : 'border-transparent'" type="button" :aria-label="color.label" @click="form.color = color.value">
                <span class="size-5 rounded-full" :class="color.className" />
              </button>
            </div>
          </div>
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[var(--text-primary)]">说明 <span class="font-normal text-[var(--text-tertiary)]">（可选）</span></span>
            <textarea v-model="form.description" class="min-h-24 resize-y rounded-xl border border-[var(--border-subtle)] bg-white px-3.5 py-3 text-sm leading-6 outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)]" maxlength="1000" placeholder="给未来的自己留下一点背景" />
          </label>
          <footer class="mt-2 flex justify-end gap-3">
            <AppButton variant="ghost" :disabled="submitting" @click="$emit('close')">取消</AppButton>
            <AppButton type="submit" :loading="submitting">创建项目</AppButton>
          </footer>
        </form>
      </section>
    </div>
  </Teleport>
</template>
