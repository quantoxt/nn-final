<!-- components/ChapterNavigation.vue -->
<script setup lang="ts">
import type { Database } from '~/types/database.types'
import { computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

type Chapter = Database['public']['Tables']['chapters']['Row']

const props = defineProps<{
    chapters: Chapter[]
    currentChapterId: string
    bookSlug: string
}>()

const emit = defineEmits<{
    'navigate': (chapterId: string) => void
}>()

// Computed
const currentChapterIndex = computed(() => {
    return props.chapters.findIndex(ch => ch.id === props.currentChapterId)
})

const hasPrevious = computed(() => currentChapterIndex.value > 0)
const hasNext = computed(() => currentChapterIndex.value < props.chapters.length - 1)

const previousChapter = computed(() => {
    return hasPrevious.value ? props.chapters[currentChapterIndex.value - 1] : null
})

const nextChapter = computed(() => {
    return hasNext.value ? props.chapters[currentChapterIndex.value + 1] : null
})

// Navigation methods
const goToPrevious = () => {
    if (previousChapter.value) {
        emit('navigate', previousChapter.value.id)
    }
}

const goToNext = () => {
    if (nextChapter.value) {
        emit('navigate', nextChapter.value.id)
    }
}

const goToChapter = (chapterId: string) => {
    emit('navigate', chapterId)
}
</script>

<template>
    <div class="flex items-center justify-between">
        <!-- Previous chapter -->
        <Button variant="outline" size="sm" @click="goToPrevious" :disabled="!hasPrevious"
            class="flex items-center gap-2">
            <ChevronLeft class="h-4 w-4" />
            <span v-if="previousChapter">
                Chapter {{ previousChapter.chapter_number }}
            </span>
            <span v-else>
                Previous
            </span>
        </Button>

        <!-- Chapter selector -->
        <div class="flex items-center gap-2">
            <span class="text-sm text-muted-foreground">Chapter</span>
            <Select :value="currentChapterId" @update:value="goToChapter">
                <SelectTrigger class="w-48">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="chapter in chapters" :key="chapter.id" :value="chapter.id">
                        Chapter {{ chapter.chapter_number }}: {{ chapter.chapter_title }}
                    </SelectItem>
                </SelectContent>
            </Select>
            <span class="text-sm text-muted-foreground">
                of {{ chapters.length }}
            </span>
        </div>

        <!-- Next chapter -->
        <Button variant="outline" size="sm" @click="goToNext" :disabled="!hasNext" class="flex items-center gap-2">
            <span v-if="nextChapter">
                Chapter {{ nextChapter.chapter_number }}
            </span>
            <span v-else>
                Next
            </span>
            <ChevronRight class="h-4 w-4" />
        </Button>
    </div>
</template>