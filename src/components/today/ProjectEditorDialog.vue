<script setup lang="ts">
import { reactive } from 'vue'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ProjectColor, ProjectDraft } from '@/features/workspace/api'

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
  <Dialog :open="open" @update:open="open => !open && $emit('close')">
    <DialogContent>
      <DialogHeader>
        <p class="text-xs font-semibold tracking-[0.08em] text-[var(--accent-primary)]">项目</p>
        <DialogTitle class="text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">新建项目</DialogTitle>
      </DialogHeader>

      <form class="grid gap-4" @submit.prevent="submit">
        <div class="grid gap-2">
          <Label for="project-name">项目名称</Label>
          <Input id="project-name" v-model="form.name" maxlength="60" placeholder="例如：产品设计" autofocus />
        </div>
        <div class="grid gap-2">
          <Label>项目颜色</Label>
          <div class="flex gap-2">
            <Button v-for="color in colors" :key="color.value" variant="ghost" size="icon-sm" class="rounded-full border-2 !p-0" :class="form.color === color.value ? 'border-[var(--text-primary)]' : 'border-transparent'" type="button" :aria-label="color.label" @click="form.color = color.value">
              <span class="size-5 rounded-full" :class="color.className" />
            </Button>
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="project-description">说明 <span class="font-normal text-[var(--text-tertiary)]">（可选）</span></Label>
          <Textarea id="project-description" v-model="form.description" maxlength="1000" placeholder="给未来的自己留下一点背景" />
        </div>
        <DialogFooter>
          <Button variant="ghost" :disabled="submitting" @click="$emit('close')">取消</Button>
          <Button type="submit" :loading="submitting">创建项目</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
