<!-- components/ChapterList.vue -->
<script setup lang="ts">
import type { Database } from '~/types/database.types'
import { ref, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Checkbox as UICheckbox } from '~/components/ui/checkbox'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { toast } from 'vue-sonner'
import {
    Plus,
    Trash2,
    Edit,
    Eye,
    Lock,
    Unlock,
    Coins,
    FileText,
    MoreVertical,
    GripVertical
} from 'lucide-vue-next'
import ChapterEditor from './chapter-editor.vue'
import ChapterNavigation from './chapter-navigation.vue'

type Chapter = Database['public']['Tables']['chapters']['Row']

const props = defineProps<{
    bookSlug: string
}>()

const emit = defineEmits<{
    'chapter-selected': (chapterId: string) => void
}>()

// Get chapters data
const { chapters, pending, error, refresh } = useChapters(props.bookSlug)

// Composables for actions
const { deleteChapters, loading: deleteLoading } = useDeleteChapters()
const { reorderChapters, loading: reorderLoading } = useReorderChapters()

// UI state
const selectedChapterIds = ref<string[]>([])
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const currentChapterId = ref<string>('')
const draggedChapter = ref<Chapter | null>(null)
const draggedOverChapter = ref<Chapter | null>(null)

// Computed
const hasSelectedChapters = computed(() => selectedChapterIds.value.length > 0)
const allSelected = computed(() => {
    return chapters.value.length > 0 && selectedChapterIds.value.length === chapters.value.length
})

// Methods
const toggleSelectAll = () => {
    if (allSelected.value) {
        selectedChapterIds.value = []
    } else {
        selectedChapterIds.value = chapters.value.map(ch => ch.id)
    }
}

const toggleSelectChapter = (chapterId: string) => {
    const index = selectedChapterIds.value.indexOf(chapterId)
    if (index === -1) {
        selectedChapterIds.value.push(chapterId)
    } else {
        selectedChapterIds.value.splice(index, 1)
    }
}

const handleEditChapter = (chapterId: string) => {
    currentChapterId.value = chapterId
    showEditDialog.value = true
}

const handleDeleteSelected = async () => {
    if (selectedChapterIds.value.length === 0) return

    if (confirm(`Are you sure you want to delete ${selectedChapterIds.value.length} chapter(s)?`)) {
        try {
            const result = await deleteChapters(props.bookSlug, selectedChapterIds.value)
            if (result.success) {
                toast.success(result.message)
                selectedChapterIds.value = []
                refresh()
            } else {
                toast.error(result.message)
            }
        } catch (err) {
            toast.error('Failed to delete chapters')
        }
    }
}

const handleDeleteChapter = async (chapterId: string) => {
    if (confirm('Are you sure you want to delete this chapter?')) {
        try {
            const result = await deleteChapters(props.bookSlug, [chapterId])
            if (result.success) {
                toast.success(result.message)
                refresh()
            } else {
                toast.error(result.message)
            }
        } catch (err) {
            toast.error('Failed to delete chapter')
        }
    }
}

// Drag and drop handlers
const handleDragStart = (chapter: Chapter) => {
    draggedChapter.value = chapter
}

const handleDragOver = (chapter: Chapter) => {
    draggedOverChapter.value = chapter
}

const handleDragEnd = async () => {
    if (!draggedChapter.value || !draggedOverChapter.value ||
        draggedChapter.value.id === draggedOverChapter.value.id) {
        draggedChapter.value = null
        draggedOverChapter.value = null
        return
    }

    try {
        // Create a new order array
        const chapterOrders = chapters.value.map(ch => ({
            id: ch.id,
            chapter_number: ch.chapter_number
        }))

        // Find the dragged and target chapters
        const draggedIndex = chapterOrders.findIndex(co => co.id === draggedChapter.value!.id)
        const targetIndex = chapterOrders.findIndex(co => co.id === draggedOverChapter.value!.id)

        // Remove the dragged chapter
        const [draggedChapterOrder] = chapterOrders.splice(draggedIndex, 1)

        // Insert it at the target position
        chapterOrders.splice(targetIndex, 0, draggedChapterOrder)

        // Update chapter numbers
        const updatedOrders = chapterOrders.map((order, index) => ({
            id: order.id,
            chapter_number: index + 1
        }))

        // Call the reorder API
        const result = await reorderChapters(props.bookSlug, updatedOrders)
        if (result.success) {
            toast.success('Chapters reordered successfully')
            refresh()
        } else {
            toast.error(result.message)
        }
    } catch (err) {
        toast.error('Failed to reorder chapters')
    } finally {
        draggedChapter.value = null
        draggedOverChapter.value = null
    }
}

// Chapter created/updated handler
const handleChapterUpdated = () => {
    refresh()
    showCreateDialog.value = false
    showEditDialog.value = false
}

// Format reading time
const formatReadingTime = (wordCount: number) => {
    const minutes = Math.ceil(wordCount / 200)
    return minutes > 0 ? `${minutes} min` : '< 1 min`
}
</script>

<template>
    <div class="space-y-4">
        <!-- Header with actions -->
        <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Chapters</h2>
            <div class="flex items-center gap-2">
                <Button v-if="hasSelectedChapters" variant="outline" size="sm" @click="handleDeleteSelected"
                    :disabled="deleteLoading">
                    <Trash2 class="h-4 w-4 mr-1" />
                    Delete ({{ selectedChapterIds.length }})
                </Button>
                <Dialog v-model:open="showCreateDialog">
                    <DialogTrigger as-child>
                        <Button size="sm">
                            <Plus class="h-4 w-4 mr-1" />
                            New Chapter
                        </Button>
                    </DialogTrigger>
                    <DialogContent class="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Chapter</DialogTitle>
                        </DialogHeader>
                        <ChapterEditor :chapter-id="''" :book-slug="bookSlug" :visible="showCreateDialog"
                            @update:visible="showCreateDialog = $event" @chapter-updated="handleChapterUpdated" />
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="pending" class="space-y-4">
            <div v-for="i in 3" :key="i" class="h-32 bg-muted rounded animate-pulse" />
        </div>

        <!-- Error state -->
        <Alert v-else-if="error" variant="destructive">
            <AlertDescription>{{ error }}</AlertDescription>
        </Alert>

        <!-- Empty state -->
        <div v-else-if="chapters.length === 0" class="text-center py-8">
            <FileText class="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 class="mt-2 text-lg font-medium">No chapters yet</h3>
            <p class="text-muted-foreground">Create your first chapter to get started</p>
            <Dialog v-model:open="showCreateDialog">
                <DialogTrigger as-child>
                    <Button class="mt-4">
                        <Plus class="h-4 w-4 mr-1" />
                        Create Chapter
                    </Button>
                </DialogTrigger>
            </Dialog>
        </div>

        <!-- Chapter list -->
        <div v-else class="space-y-2">
            <!-- Select all checkbox -->
            <div class="flex items-center p-2 border-b">
                <Checkbox :checked="allSelected" @update:checked="toggleSelectAll" class="mr-2" />
                <span class="text-sm text-muted-foreground">
                    {{ selectedChapterIds.length }} of {{ chapters.length }} selected
                </span>
            </div>

            <!-- Chapter items -->
            <Card v-for="chapter in chapters" :key="chapter.id" class="transition-colors" :class="{
                'border-primary': selectedChapterIds.includes(chapter.id),
                'bg-muted/50': draggedOverChapter?.id === chapter.id
            }" draggable="true" @dragstart="() => handleDragStart(chapter)"
                @dragover.prevent="() => handleDragOver(chapter)" @dragend="handleDragEnd">
                <CardContent class="p-4">
                    <div class="flex items-start">
                        <!-- Selection checkbox -->
                        <div class="flex items-center h-5 pt-0.5 mr-3">
                            <Checkbox :checked="selectedChapterIds.includes(chapter.id)"
                                @update:checked="() => toggleSelectChapter(chapter.id)" />
                        </div>

                        <!-- Drag handle -->
                        <div class="flex items-center h-5 pt-0.5 mr-3 cursor-move">
                            <GripVertical class="h-4 w-4 text-muted-foreground" />
                        </div>

                        <!-- Chapter info -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between mb-1">
                                <h3 class="font-medium truncate">
                                    Chapter {{ chapter.chapter_number }}: {{ chapter.chapter_title }}
                                </h3>
                                <div class="flex items-center gap-2">
                                    <Badge variant="outline" class="text-xs">
                                        {{ chapter.word_count }} words
                                    </Badge>
                                    <Badge variant="outline" class="text-xs">
                                        {{ formatReadingTime(chapter.word_count) }}
                                    </Badge>
                                </div>
                            </div>

                            <div class="flex items-center gap-4 text-sm text-muted-foreground">
                                <div class="flex items-center gap-1">
                                    <Coins class="h-3 w-3" />
                                    <span>{{ chapter.coin_cost }} coins</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <Lock v-if="chapter.is_locked" class="h-3 w-3" />
                                    <Unlock v-else class="h-3 w-3" />
                                    <span>{{ chapter.is_locked ? 'Locked' : 'Free' }}</span>
                                </div>
                                <div class="text-xs">
                                    Updated: {{ new Date(chapter.updated_at).toLocaleDateString() }}
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center gap-1 ml-2">
                            <Button variant="ghost" size="sm" @click="emit('chapter-selected', chapter.id)">
                                <Eye class="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" @click="handleEditChapter(chapter.id)">
                                <Edit class="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" @click="handleDeleteChapter(chapter.id)">
                                <Trash2 class="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Edit chapter dialog -->
        <Dialog v-model:open="showEditDialog">
            <DialogContent class="max-w-6xl">
                <DialogHeader>
                    <DialogTitle>Edit Chapter</DialogTitle>
                </DialogHeader>
                <ChapterEditor :chapter-id="currentChapterId" :book-slug="bookSlug" :visible="showEditDialog"
                    @update:visible="showEditDialog = $event" @chapter-updated="handleChapterUpdated" />
            </DialogContent>
        </Dialog>
    </div>
</template>