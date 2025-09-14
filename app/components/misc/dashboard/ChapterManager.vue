<!-- components/misc/dashboard/MiscDashboardChapterManager.vue -->
<script setup lang="ts">
import type { Database } from '~/types/database.types'
import { Button } from '~/components/ui/button'
import { VueDraggableNext } from 'vue-draggable-next'

type Chapter = Database['public']['Tables']['chapters']['Row']

const props = defineProps<{
    chapters: Ref<Chapter[] | null>
    loading: Ref<boolean>
}>()

const emit = defineEmits<{
    (e: 'add-chapter'): void
    (e: 'update-chapter-field', chapterId: string, field: keyof Pick<Chapter, 'chapter_title' | 'is_locked' | 'coin_cost'>, value: Chapter[typeof field]): void
    (e: 'delete-chapter', chapterId: string): void
    (e: 'reorder-chapters', newOrder: Chapter[]): void
}>()

// Local copy for drag & drop (avoids mutating props)
const localChapters = computed(() => props.chapters.value || [])

// Handle drag end
const handleDragEnd = () => {
    emit('reorder-chapters', [...localChapters.value])
}
</script>

<template>
    <div class="space-y-4">
        <!-- Chapter List -->
        <VueDraggableNext 
            v-model="localChapters" item-key="id" handle=".cursor-grab" :disabled="loading.value"
            @end="handleDragEnd">
            <template #item="{ element: chapter }">
                <div class="border rounded-lg p-4 space-y-4">
                    <MiscDashboardChapterCard  
                        :chapter="chapter"
                        @update-field="(field, value) => emit('update-chapter-field', chapter.id, field, value)"
                        @delete="() => emit('delete-chapter', chapter.id)" />
                </div>
            </template>
        </VueDraggableNext>

        <!-- Add Chapter Button -->
        <Button type="button" variant="outline" class="w-full" :disabled="loading.value" @click="emit('add-chapter')">
            {{ loading.value ? 'Adding...' : '+ Add Chapter' }}
        </Button>
    </div>
</template>

<style scoped>
.cursor-grab {
    cursor: grab;
    padding: 0.5rem;
    border-radius: 4px;
}

.cursor-grab:hover {
    background-color: hsl(var(--muted));
}

.cursor-grab:active {
    cursor: grabbing;
}
</style>